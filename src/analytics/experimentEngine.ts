// Experiment ENGINE, pure half (S5-008 / S5-011) — BROWSER-FREE so it is unit-tested and
// validated in CI through scripts/lib/catalog.mjs. The React binding is src/lib/experiments.ts.
import type { ExperimentDefinition } from './experiments';
import type { Language } from '../lib/locales';
import { EVENT_BY_NAME } from './events';

export const CONTROL = 'control';

/** Every reason an experiment record is invalid; empty means it may run (S5-011). */
export function experimentProblems(e: ExperimentDefinition): string[] {
  const out: string[] = [];
  if (!/^[a-z0-9-]+$/.test(e.id)) out.push(`${e.id}: id is not a bare token`);
  if (!['draft', 'active', 'paused', 'complete'].includes(e.status)) out.push(`${e.id}: unknown status`);
  if (e.variants.length < 2) out.push(`${e.id}: needs at least two variants`);
  if (new Set(e.variants.map((v) => v.id)).size !== e.variants.length) out.push(`${e.id}: duplicate variant id`);
  const total = e.variants.reduce((n, v) => n + v.weight, 0);
  if (total !== 100) out.push(`${e.id}: variant weights total ${total}, not 100`);
  if (e.variants.some((v) => v.weight < 0 || !Number.isInteger(v.weight))) out.push(`${e.id}: weights must be non-negative integers`);
  if (!EVENT_BY_NAME[e.primaryMetric] || EVENT_BY_NAME[e.primaryMetric].reserved) out.push(`${e.id}: primaryMetric "${e.primaryMetric}" is not a dictionary event`);
  for (const l of e.eligibility.locales ?? []) if (!['en', 'es', 'fr'].includes(l)) out.push(`${e.id}: unknown locale ${l}`);
  if (e.startAt && Number.isNaN(Date.parse(e.startAt))) out.push(`${e.id}: startAt is not a date`);
  if (e.endAt && Number.isNaN(Date.parse(e.endAt))) out.push(`${e.id}: endAt is not a date`);
  if (e.startAt && e.endAt && Date.parse(e.endAt) <= Date.parse(e.startAt)) out.push(`${e.id}: endAt before startAt`);
  if (e.status !== 'draft') {
    for (const k of ['hypothesis', 'owner', 'audience', 'analysisRule', 'stopRule', 'doc'] as const) if (!e[k] || String(e[k]).trim().length < 10) out.push(`${e.id}: ${k} is required for a ${e.status} experiment`);
    if (!(e.durationDays > 0)) out.push(`${e.id}: durationDays required`);
    if (!(e.minimumSample > 0)) out.push(`${e.id}: minimumSample required`);
    if (!e.guardrails.length) out.push(`${e.id}: at least one guardrail`);
    if (e.status === 'active' && !e.startAt) out.push(`${e.id}: an active experiment needs startAt`);
  }
  return out;
}

/** 32-bit FNV-1a; small, dependency-free, deterministic across runtimes. */
export function hashBucket(input: string, buckets = 100): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) { h ^= input.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h % buckets;
}

/** Route pattern match: '/books/:id' matches '/books/mayas-shadow'; '/books' matches only '/books'. */
export function routeMatches(pattern: string, route: string): boolean {
  const p = pattern.split('/').filter(Boolean);
  const r = route.split('/').filter(Boolean);
  if (p.length !== r.length) return false;
  return p.every((seg, i) => seg.startsWith(':') || seg === r[i]);
}

export interface AssignmentInput { unitId: string | null; locale: Language; route: string; date?: Date; isBot?: boolean }

/** Deterministic assignment; CONTROL whenever the experiment must not run for this unit. */
export function assign(e: ExperimentDefinition, input: AssignmentInput): { variant: string; eligible: boolean } {
  const date = input.date ?? new Date();
  if (e.status !== 'active') return { variant: CONTROL, eligible: false };
  if (experimentProblems(e).length) return { variant: CONTROL, eligible: false };
  if (input.isBot || !input.unitId) return { variant: CONTROL, eligible: false };
  if (e.eligibility.locales && !e.eligibility.locales.includes(input.locale)) return { variant: CONTROL, eligible: false };
  if (e.eligibility.routes && !e.eligibility.routes.some((p) => routeMatches(p, input.route))) return { variant: CONTROL, eligible: false };
  if (e.startAt && date < new Date(e.startAt)) return { variant: CONTROL, eligible: false };
  if (e.endAt && date > new Date(e.endAt)) return { variant: CONTROL, eligible: false };
  const bucket = hashBucket(`${e.id}:${input.unitId}`);
  let acc = 0;
  for (const v of e.variants) { acc += v.weight; if (bucket < acc) return { variant: v.id, eligible: true }; }
  return { variant: e.variants[e.variants.length - 1].id, eligible: true };
}

