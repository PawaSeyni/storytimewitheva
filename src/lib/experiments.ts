// Experiment ENGINE (Sprint 5 S5-008): eligibility, deterministic assignment, once-only
// exposure, kill switch. Pure functions take every input explicitly so they are unit-tested;
// the React hook binds them to the storage adapter, the URL and the analytics wrapper.
//
// Rules (spec §7): assignment happens before the variant renders; exposure fires once per
// assignment and only when the variant is viewable; conversions carry experiment/variant
// only when an exposure exists; weights total 100 and are immutable during a run; bots
// (navigator.webdriver) and ineligible locales/routes get control with no exposure; a
// paused or complete experiment is a kill switch (control, no exposure). With storage
// denied the adapter keeps the unit id in memory, so assignment is stable for the session
// and the page works exactly as before.
import { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { EXPERIMENT_BY_ID, EXPERIMENTS } from '../analytics/experiments';
import { CONTROL, assign } from '../analytics/experimentEngine';
export { CONTROL, assign, experimentProblems, hashBucket, routeMatches } from '../analytics/experimentEngine';
import { get, set } from './storage';
import { splitLangFromPath } from './locales';
import { redactRoute } from './errorRedact';
import { track } from './analytics';

// ---- storage: the unit id and the exposures already sent, through the adapter ----
const UNIT_KEY = 'experiment-unit';
const EXPOSED_KEY = 'experiment-exposed';
const isString = (v: unknown): v is string => typeof v === 'string' && v.length > 0;
const isStringArray = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === 'string');

function randomId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** The stable, anonymous unit id (memory-only when storage is denied). */
export function unitId(): string {
  const existing = get(UNIT_KEY, isString);
  if (existing) return existing;
  const id = randomId();
  set(UNIT_KEY, id);
  return id;
}

/** Fire the exposure once per (experiment, variant) for this unit; returns whether it fired now. */
export function exposeOnce(experimentId: string, variant: string, placement?: string): boolean {
  const key = `${experimentId}:${variant}`;
  const sent = get(EXPOSED_KEY, isStringArray) ?? [];
  if (sent.includes(key)) return false;
  set(EXPOSED_KEY, [...sent, key].slice(-50));
  track('Experiment Exposure', { experiment: experimentId, variant, ...(placement ? { placement } : {}) });
  return true;
}

export function hasExposure(experimentId: string, variant: string): boolean {
  return (get(EXPOSED_KEY, isStringArray) ?? []).includes(`${experimentId}:${variant}`);
}

/** Props to attach to a conversion event: only when an exposure exists for the assignment. */
export function experimentProps(experimentId: string, variant: string): { experiment?: string; variant?: string } {
  return variant !== CONTROL || hasExposure(experimentId, variant) ? (hasExposure(experimentId, variant) ? { experiment: experimentId, variant } : {}) : {};
}

const isBot = () => typeof navigator !== 'undefined' && Boolean(navigator.webdriver);

/**
 * React binding. `variant` is decided before the first render (assignment is synchronous);
 * call `expose()` when the variant's surface is actually viewable (e.g. inside the same
 * IntersectionObserver that fires the surface's impression event).
 */
export function useExperiment(experimentId: string): { variant: string; eligible: boolean; expose: (placement?: string) => void; conversionProps: () => { experiment?: string; variant?: string } } {
  const { pathname } = useLocation();
  const def = EXPERIMENT_BY_ID[experimentId];
  const { lang, rest } = splitLangFromPath(pathname);
  const assignment = useMemo(() => {
    if (!def) return { variant: CONTROL, eligible: false };
    return assign(def, { unitId: def.status === 'active' ? unitId() : null, locale: lang, route: redactRoute(rest), isBot: isBot() });
  }, [def, lang, rest]);
  const exposed = useRef(false);
  useEffect(() => { exposed.current = false; }, [assignment.variant, pathname]);
  const expose = (placement?: string) => {
    if (!assignment.eligible || exposed.current) return;
    exposed.current = true;
    exposeOnce(experimentId, assignment.variant, placement);
  };
  const conversionProps = () => (assignment.eligible ? experimentProps(experimentId, assignment.variant) : {});
  return { variant: assignment.variant, eligible: assignment.eligible, expose, conversionProps };
}

export const activeExperiments = () => EXPERIMENTS.filter((e) => e.status === 'active');
