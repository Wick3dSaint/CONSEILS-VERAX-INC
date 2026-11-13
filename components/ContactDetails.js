/**
 * Email and phone that turn into mailto:/tel: links automatically once the
 * bracketed placeholders for them in lib/content.js are replaced with real values.
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
  const digits = phone.replace(/[^\d+]/g, '');
  // 10-digit North American numbers get the +1 country code so they dial from anywhere.
  const href = /^\d{10}$/.test(digits) ? `+1${digits}` : digits;
  return (
    <a className={className} href={`tel:${href}`}>
      {phone}
    </a>
  );
}
