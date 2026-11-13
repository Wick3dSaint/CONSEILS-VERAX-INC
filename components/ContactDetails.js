/**
 * Email and phone that turn into mailto:/tel: links automatically once the
 * [YOUR EMAIL] / [YOUR PHONE] placeholders in lib/content.js are replaced.
 */
function isPlaceholder(value) {
  return /^\[.*\]$/.test(String(value).trim());
}

export function EmailLink({ email, className }) {
  if (isPlaceholder(email)) return <span className={className}>{email}</span>;
  return (
    <a className={className} href={`mailto:${email}`}>
      {email}
    </a>
  );
}

export function PhoneLink({ phone, className }) {
  if (isPlaceholder(phone)) return <span className={className}>{phone}</span>;
  return (
    <a className={className} href={`tel:${phone.replace(/[^\d+]/g, '')}`}>
      {phone}
    </a>
  );
}
