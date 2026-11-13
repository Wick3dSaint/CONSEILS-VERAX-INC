/**
 * The Conseils Verax mark: a spirit level at rest ("On the level").
 * - vial (frame): a steady frame — structure and discipline
 * - two lines: what we say and what we do, always the same distance apart
 * - bubble: the truth, at rest in the centre
 *
 * Pass `label` when the mark carries meaning on its own; otherwise it is decorative.
 */
export function LogoMark({
  frame = '#1d1d1f',
  lines,
  bubble = '#0a6e5c',
  width = 34,
  height = 17,
  label,
  className,
}) {
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': 'true' };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 20"
      width={width}
      height={height}
      className={className}
      {...a11y}
    >
      <rect x="1.25" y="1.25" width="37.5" height="17.5" rx="8.75" fill="none" stroke={frame} strokeWidth="2.5" />
      <path d="M15 5.5v9M25 5.5v9" stroke={lines ?? frame} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="20" cy="10" r="3.3" fill={bubble} />
    </svg>
  );
}
