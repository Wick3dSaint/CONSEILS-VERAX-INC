import { contactPage, services } from '@/lib/content';
import { LIMITS, validateEnquiry } from '@/lib/validation';

// Only accept the choices the form actually offers.
const CLIENT_TYPES = new Set(contactPage.form.clientTypes);
const SERVICES = new Set([...services.map((s) => s.title), contactPage.form.notSure]);

// Generous upper bound for one enquiry, in bytes.
const MAX_BODY_BYTES = 16 * 1024;

export async function POST(request) {
  const declaredLength = Number(request.headers.get('content-length') ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return Response.json({ ok: false, error: 'Payload too large' }, { status: 413 });
  }

  let body;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return Response.json({ ok: false, error: 'Payload too large' }, { status: 413 });
    }
    body = JSON.parse(raw);
  } catch {
    return Response.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  // Honeypot: a hidden field that only bots fill in. Pretend success, keep nothing.
  if (typeof body?.website === 'string' && body.website.trim() !== '') {
    return Response.json({ ok: true });
  }

  const { values, errors, isValid } = validateEnquiry(body);
  if (!isValid) {
    return Response.json({ ok: false, errors }, { status: 422 });
  }

  const enquiry = {
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    clientType: CLIENT_TYPES.has(values.clientType) ? values.clientType : '',
    service: SERVICES.has(values.service) ? values.service : '',
    message: values.message.slice(0, LIMITS.message),
    receivedAt: new Date().toISOString(),
  };

  // Enquiries contain personal information: make sure your hosting logs are
  // access-controlled and retained only as long as necessary.
  console.info('[contact] New enquiry', JSON.stringify(enquiry));

  // TODO: Connect an email service or CRM so enquiries reach a real inbox.
  // Set CONTACT_WEBHOOK_URL in your environment (see .env.example), then forward
  // the enquiry here, for example:
  //
  //   const url = process.env.CONTACT_WEBHOOK_URL;
  //   if (url) {
  //     const res = await fetch(url, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(enquiry),
  //     });
  //     if (!res.ok) return Response.json({ ok: false }, { status: 502 });
  //   }
  //
  // Until this is done, enquiries are ONLY written to the server log above.

  return Response.json({ ok: true });
}
