import nodemailer from 'nodemailer';

/**
 * Sends contact-form enquiries to the firm's mailbox over SMTP.
 *
 * Configure with environment variables (in hPanel: Websites → your site →
 * Node.js → Environment variables). Never commit real values.
 *
 *   SMTP_USER         Mailbox address that sends the email, e.g. name@yourdomain.ca   (required)
 *   SMTP_PASS         That mailbox's password                                         (required)
 *   CONTACT_TO_EMAIL  Where enquiries are delivered (default: SMTP_USER)
 *   SMTP_HOST         Default: smtp.hostinger.com
 *   SMTP_PORT         Default: 465 (SSL). Use 587 for STARTTLS.
 *
 * Without SMTP_USER and SMTP_PASS, email is switched off and enquiries are only logged.
 */

export function isMailConfigured() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

let transporter;

function getTransporter() {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT || 465);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.hostinger.com',
      port,
      secure: port === 465, // 465 = SSL from the start; 587 = STARTTLS upgrade
      requireTLS: port === 587,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });
  }
  return transporter;
}

/** Removes line breaks and control characters from text used in email headers. */
function oneLine(value) {
  return String(value ?? '')
    .replace(/[\u0000-\u001f\u007f]+/g, ' ')
    .trim();
}

export async function sendEnquiryEmail(enquiry) {
  const sender = process.env.SMTP_USER;
  const recipient = process.env.CONTACT_TO_EMAIL || sender;
  const fullName = oneLine(`${enquiry.firstName} ${enquiry.lastName}`);
  const service = oneLine(enquiry.service);

  const lines = [
    `Name: ${fullName}`,
    `Email: ${oneLine(enquiry.email)}`,
    `I am a: ${oneLine(enquiry.clientType) || '—'}`,
    `Service of interest: ${service || '—'}`,
    `Site language: ${oneLine(enquiry.language) || '—'}`,
    `Received: ${enquiry.receivedAt}`,
    '',
    'Message:',
    enquiry.message || '(no message)',
    '',
    '—',
    'Sent from the contact form on the Conseils Verax website. Reply to this email to answer the sender directly.',
  ];

  await getTransporter().sendMail({
    from: { name: 'Conseils Verax website', address: sender },
    to: recipient,
    replyTo: { name: fullName, address: oneLine(enquiry.email) },
    subject: `New enquiry: ${fullName}${service ? ` — ${service}` : ''}`,
    text: lines.join('\n'),
  });
}
