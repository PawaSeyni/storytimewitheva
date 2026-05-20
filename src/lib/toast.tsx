// Lightweight in-app toast system. No external deps.
//
// Usage:
//   1. Wrap the app in <ToastProvider> (done in main.tsx).
//   2. Inside any component, call: const toast = useToast();
//   3. Fire: toast('Saved!'), toast.success('...'), toast.error('...').
//
// Toasts auto-dismiss after 3.5s. Multiple toasts stack bottom-right (bottom-center on mobile).
// role="status" / aria-live="polite" so screen readers announce them.

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

type ToastVariant = 'info' | 'success' | 'error';

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastFn {
  (message: string): void;
  info: (message: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastFn | null>(null);

const TOAST_DURATION_MS = 3500;

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const push = useCallback((message: string, variant: ToastVariant) => {
    const id = ++nextId;
    setToasts((prev) => [...prev, { id, message, variant }]);
    // Auto-remove after duration.
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, TOAST_DURATION_MS);
  }, []);

  const toast = useCallback(
    ((message: string) => push(message, 'info')) as ToastFn,
    [push],
  );
  toast.info = useCallback((m: string) => push(m, 'info'), [push]);
  toast.success = useCallback((m: string) => push(m, 'success'), [push]);
  toast.error = useCallback((m: string) => push(m, 'error'), [push]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastFn {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      // Fixed positioning. Bottom-center on mobile, bottom-right on sm+.
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-4 sm:items-end"
      aria-live="polite"
      role="status"
    >
      {toasts.map((t) => (
        <ToastItemView key={t.id} item={t} onDismiss={() => onDismiss(t.id)} />
      ))}
    </div>
  );
}

function ToastItemView({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    // Trigger the entry transition on next frame.
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const variantClass =
    item.variant === 'success'
      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
      : item.variant === 'error'
        ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
        : 'bg-gradient-to-r from-purple-600 to-pink-500 text-white';

  const icon = item.variant === 'success' ? '✓' : item.variant === 'error' ? '✕' : 'ℹ';

  return (
    <button
      type="button"
      onClick={onDismiss}
      className={`pointer-events-auto flex items-center gap-3 rounded-full px-5 py-3 shadow-2xl ring-1 ring-white/20 text-sm font-semibold transition-all duration-200 max-w-md ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      } ${variantClass}`}
      aria-label="Dismiss notification"
    >
      <span className="text-lg leading-none">{icon}</span>
      <span className="text-left">{item.message}</span>
    </button>
  );
}
