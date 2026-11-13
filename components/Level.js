/**
 * The signature animation: a spirit level drawn inside black panels.
 * On page load the bubble swings widely from side to side with shrinking swings,
 * then settles in the exact centre (see .level__bubble keyframes in globals.css).
 * Under prefers-reduced-motion the bubble simply sits in the centre.
 */
const GEOMETRY = {
  large: {
    viewBox: '0 0 400 140',
    width: 400,
    height: 140,
    vial: { x: 8, y: 22, width: 384, height: 96, rx: 48, strokeWidth: 4 },
    lines: { xs: [156, 244], y1: 40, y2: 100, strokeWidth: 3 },
    bubble: { cx: 200, cy: 70, r: 26 },
  },
  small: {
    viewBox: '0 0 200 100',
    width: 200,
    height: 100,
    vial: { x: 6, y: 22, width: 188, height: 56, rx: 28, strokeWidth: 2.5 },
    lines: { xs: [75, 125], y1: 33, y2: 67, strokeWidth: 2 },
    bubble: { cx: 100, cy: 50, r: 15 },
  },
};

export function Level({ size = 'large', label, className = '' }) {
  const g = GEOMETRY[size] ?? GEOMETRY.large;
  const [x1, x2] = g.lines.xs;
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': 'true' };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={g.viewBox}
      width={g.width}
      height={g.height}
      className={`level level--${size} ${className}`.trim()}
      {...a11y}
    >
      <rect
        x={g.vial.x}
        y={g.vial.y}
        width={g.vial.width}
        height={g.vial.height}
        rx={g.vial.rx}
        fill="rgba(95, 211, 179, 0.06)"
        stroke="#f5f5f7"
        strokeWidth={g.vial.strokeWidth}
      />
      <path
        d={`M${x1} ${g.lines.y1}V${g.lines.y2}M${x2} ${g.lines.y1}V${g.lines.y2}`}
        stroke="#f5f5f7"
        strokeWidth={g.lines.strokeWidth}
        strokeLinecap="round"
      />
      <circle className="level__bubble" cx={g.bubble.cx} cy={g.bubble.cy} r={g.bubble.r} fill="#5fd3b3" />
    </svg>
  );
}
