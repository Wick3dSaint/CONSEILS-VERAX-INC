import Link from 'next/link';

/**
 * A headline whose second half is grey: "Verax. The truthful way to run your finances."
 * `title` is either a plain string or { lead, rest }.
 */
export function Headline({ as: Tag = 'h2', title, className = 'h2', id }) {
  if (typeof title === 'string') {
    return (
      <Tag id={id} className={className}>
        {title}
      </Tag>
    );
  }
  return (
    <Tag id={id} className={className}>
      <span className="hl-lead">{title.lead}</span> <span className="hl-rest">{title.rest}</span>
    </Tag>
  );
}

/** Renders a string, or an array of strings and { em, lang } parts. */
export function RichText({ value }) {
  if (!Array.isArray(value)) return value;
  return value.map((part, i) =>
    typeof part === 'string' ? (
      part
    ) : (
      <em key={i} lang={part.lang}>
        {part.em}
      </em>
    ),
  );
}

/** "Learn more ›" style text link. The chevron is hidden from screen readers. */
export function MoreLink({ href, children, className = '' }) {
  return (
    <Link href={href} className={`more-link ${className}`.trim()}>
      {children}
      <Chevron />
    </Link>
  );
}

export function Chevron() {
  return (
    <span className="chev" aria-hidden="true">
      {' ›'}
    </span>
  );
}

/** Rounded pill button-style link. Variants: green, black. */
export function PillLink({ href, children, variant = 'green', className = '' }) {
  return (
    <Link href={href} className={`pill pill--${variant} ${className}`.trim()}>
      {children}
    </Link>
  );
}
