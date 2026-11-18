// The three reading-status icons (lucide circle-check, book-open, book-marked) as an
// SVG sprite. BookStatusButton renders on every BookCard, so the catalog page carried
// 60 copies of the full lucide markup (~25 KB of a 136 KB page, over the 130 KB
// per-route HTML budget). The paths now live once per document, in a hidden sprite
// mounted by App, and each button draws them with <use>, ~70 bytes instead of ~420.
// The sprite's presentation attributes (stroke, fill, line caps) are inherited by the
// referenced symbol, and currentColor still resolves to the button's text color.

export type StatusIconName = 'read' | 'reading' | 'want-to-read';

const PATHS: Record<StatusIconName, string> = {
  // lucide circle-check
  read: '<circle cx="12" cy="12" r="10"/><path d="m16 9-5.5 5.5L8 12"/>',
  // lucide book-open
  reading: '<path d="M12 5v16"/><path d="M20.001 19A2 2 0 0 0 22 17V5a2 2 0 0 0-1.999-2L16 3.002A5 5 0 0 0 12 5a5 5 0 0 0-4-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 1.999 2H8a5 5 0 0 1 4 2 5 5 0 0 1 4-2z"/>',
  // lucide book-marked
  'want-to-read': '<path d="M10 2v7.751a.25.25 0 0 0 .407.195l2.28-1.834a.5.5 0 0 1 .627 0l2.28 1.834A.25.25 0 0 0 16 9.751V2"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>',
};

const symbolId = (name: StatusIconName) => `status-icon-${name}`;

/** Mount once per document (App does), before or after any StatusIcon: <use> resolves by id. */
export function StatusIconSprite() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="0"
      height="0"
      className="absolute"
      aria-hidden="true"
      focusable="false"
      data-status-icon-sprite
    >
      {(Object.keys(PATHS) as StatusIconName[]).map((name) => (
        <symbol
          key={name}
          id={symbolId(name)}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          dangerouslySetInnerHTML={{ __html: PATHS[name] }}
        />
      ))}
    </svg>
  );
}

export function StatusIcon({ name, className }: { name: StatusIconName; className?: string }) {
  return (
    <svg className={className} aria-hidden="true" focusable="false">
      <use href={`#${symbolId(name)}`} />
    </svg>
  );
}
