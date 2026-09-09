// Journey progress (Sprint 7 S7-010) — advisory, local, through the storage adapter.
//
// One namespaced, versioned envelope per journey (`journey:<id>`). Completing a step
// needs no analytics, no network write and no identity. Step ids that no longer exist in
// the journey are dropped AT READ TIME (§7), so an edited journey keeps only the
// progress that still applies. Writes are best effort: a blocked browser keeps the
// session's progress in memory and the page keeps working.

import { get, set, remove } from './storage';

export interface JourneyProgressV1 {
  version: 1;
  journeyId: string;
  completedStepIds: string[];
  lastStepId?: string;
  updatedAt: string;
}

const KEY = (journeyId: string) => `journey:${journeyId}`;
const EVENT = 'journeychange';

function isProgress(v: unknown): v is JourneyProgressV1 {
  return Boolean(v) && typeof v === 'object' && Array.isArray((v as JourneyProgressV1).completedStepIds);
}

function notify(): void {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(EVENT));
}

export function onJourneyChange(fn: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(EVENT, fn);
  return () => window.removeEventListener(EVENT, fn);
}

/** Read progress, keeping only step ids still present in `validStepIds`. */
export function loadProgress(journeyId: string, validStepIds: readonly string[]): JourneyProgressV1 {
  const valid = new Set(validStepIds);
  const stored = get(KEY(journeyId), isProgress);
  const completed = (stored?.completedStepIds ?? []).filter((id) => valid.has(id));
  const last = stored?.lastStepId && valid.has(stored.lastStepId) ? stored.lastStepId : undefined;
  return {
    version: 1,
    journeyId,
    completedStepIds: [...new Set(completed)],
    lastStepId: last,
    updatedAt: stored?.updatedAt ?? new Date().toISOString(),
  };
}

/** Mark or unmark a step. Returns the new progress; persists best effort. */
export function toggleStep(journeyId: string, stepId: string, validStepIds: readonly string[]): JourneyProgressV1 {
  const p = loadProgress(journeyId, validStepIds);
  if (!validStepIds.includes(stepId)) return p;
  const done = p.completedStepIds.includes(stepId);
  const next: JourneyProgressV1 = {
    ...p,
    completedStepIds: done ? p.completedStepIds.filter((id) => id !== stepId) : [...p.completedStepIds, stepId],
    lastStepId: stepId,
    updatedAt: new Date().toISOString(),
  };
  set(KEY(journeyId), next);
  notify();
  return next;
}

export function resetProgress(journeyId: string): void {
  remove(KEY(journeyId));
  notify();
}

/** The first step not yet completed, for "resume here". */
export function nextIncompleteStepId(p: JourneyProgressV1, orderedStepIds: readonly string[]): string | null {
  return orderedStepIds.find((id) => !p.completedStepIds.includes(id)) ?? null;
}
