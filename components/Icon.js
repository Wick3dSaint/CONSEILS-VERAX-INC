/** Simple 24×24 stroke icons. Decorative by default; pass `label` to expose one. */
const PATHS = {
  // Tax Preparation
  document: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h6" />
    </>
  ),
  // Tax Planning: a calendar with a check
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
      <path d="m9 14.75 2 2 4-4" />
    </>
  ),
  // Fractional Controller: a bar chart
  chart: (
    <>
      <path d="M4 20.5h16" />
      <path d="M7 17v-5M12 17V7M17 17V10" />
    </>
  ),
  // Advisory: a compass
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5z" />
    </>
  ),
  // Bookkeeping: an open book
  book: (
    <>
      <path d="M12 6.5C10.5 5.2 8.2 4.5 4 4.5v14c4.2 0 6.5.7 8 2 1.5-1.3 3.8-2 8-2v-14c-4.2 0-6.5.7-8 2z" />
      <path d="M12 6.5v14" />
    </>
  ),
  building: (
    <>
      <path d="M4.5 21V4.5A1.5 1.5 0 0 1 6 3h7.5A1.5 1.5 0 0 1 15 4.5V21" />
      <path d="M15 9h3a1.5 1.5 0 0 1 1.5 1.5V21" />
      <path d="M2.5 21h19" />
      <path d="M8 7h3.5M8 11h3.5M8 15h3.5" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
      <path d="M3 12.5h18" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5c.8-3.8 3.8-6 7.5-6s6.7 2.2 7.5 6" />
    </>
  ),
  chat: (
    <path d="M5 4.5h14A1.5 1.5 0 0 1 20.5 6v9a1.5 1.5 0 0 1-1.5 1.5h-8L6 20.5v-4H5A1.5 1.5 0 0 1 3.5 15V6A1.5 1.5 0 0 1 5 4.5z" />
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
};

export function Icon({ name, size = 24, strokeWidth = 1.5, label, className }) {
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': 'true' };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...a11y}
    >
      {PATHS[name]}
    </svg>
  );
}
