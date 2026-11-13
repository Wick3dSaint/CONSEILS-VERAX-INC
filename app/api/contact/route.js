import { contactPage, services } from '@/lib/content';
import { LIMITS, validateEnquiry } from '@/lib/validation';
import { isMailConfigured, sendEnquiryEmail } from '@/lib/mailer';

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

  // Email the enquiry to the firm's mailbox (see lib/mailer.js for the settings).
  if (isMailConfigured()) {
    try {
      await sendEnquiryEmail(enquiry);
      // Keep personal details out of the server log once email delivery works.
      console.info('[contact] Enquiry emailed', enquiry.receivedAt);
    } catch (error) {
      console.error('[contact] Email delivery failed:', error?.message ?? error);
      // The visitor sees the failure message, which tells them to email the firm directly.
      return Response.json({ ok: false, error: 'Delivery failed' }, { status: 502 });
    }
  } else {
    // Email is not configured yet (SMTP_USER / SMTP_PASS missing): the server log is the
    // only record. Enquiries contain personal information, so keep log access restricted.
    console.warn('[contact] Email not configured; enquiry logged only:', JSON.stringify(enquiry));
  }

  return Response.json({ ok: true });
}
