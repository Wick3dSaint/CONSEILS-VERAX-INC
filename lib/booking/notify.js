import { SITE_URL, getDictionary } from '../i18n.js';
import { firmAddresses, isMailConfigured, oneLine, sendMail } from '../mailer.js';
import { BOOKING } from './config.js';

/** "{name} is {x}" → fills the {placeholders}. */
export function fill(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? '');
}

const LOCALES = { fr: 'fr-CA', en: 'en-CA' };

/** Date and time of a slot, in Eastern Time, for the given language. */
export function formatSlot(startIso, lang) {
  const date = new Date(startIso);
  const locale = LOCALES[lang] ?? 'en-CA';
  return {
    date: new Intl.DateTimeFormat(locale, {
      timeZone: BOOKING.timeZone,
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date),
    time: new Intl.DateTimeFormat(locale, { timeZone: BOOKING.timeZone, hour: 'numeric', minute: '2-digit' }).format(date),
  };
}

/* ------------------------------------------------------------------ */
/* Calendar file (.ics)                                                 */
/* ------------------------------------------------------------------ */

const icsDate = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const icsText = (t) => String(t).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

/** Folds lines longer than 75 octets, as the iCalendar format requires. */
function fold(line) {
  const bytes = Buffer.from(line, 'utf8');
  if (bytes.length <= 75) return line;
  const out = [];
  let current = '';
  for (const ch of line) {
    if (Buffer.byteLength(current + ch, 'utf8') > (out.length ? 74 : 75)) {
      out.push(current);
      current = ch;
    } else current += ch;
  }
  out.push(current);
  return out.join('\r\n ');
}

function calendarFile({ booking, method, summary, description }) {
  const start = new Date(booking.start);
  const end = new Date(start.getTime() + BOOKING.slotMinutes * 60_000);
  const { sender } = firmAddresses();
  const lines = [
    'BEGIN:VCALENDAR',
    'PRODID:-//Conseils Verax//Online booking//EN',
    'VERSION:2.0',
    'CALSCALE:GREGORIAN',
    `METHOD:${method}`,
    'BEGIN:VEVENT',
    `UID:booking-${booking.id}@conseilsverax.ca`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(start)}`,
    `DTEND:${icsDate(end)}`,
    `SEQUENCE:${method === 'CANCEL' ? 1 : 0}`,
    `STATUS:${method === 'CANCEL' ? 'CANCELLED' : 'CONFIRMED'}`,
    `SUMMARY:${icsText(summary)}`,
    `DESCRIPTION:${icsText(description)}`,
    ...(sender ? [`ORGANIZER;CN=Conseils Verax:mailto:${sender}`] : []),
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}

/* ------------------------------------------------------------------ */
/* Emails                                                               */
/* ------------------------------------------------------------------ */

function howLine(booking, e) {
  return booking.meetingType === 'phone' ? fill(e.phoneHow, { phone: booking.phone }) : e.videoHow;
}

/** Emails the client (in their language) and the firm. Never throws: the booking is already saved. */
export async function notifyBooked(booking, cancelToken) {
  if (!isMailConfigured()) {
    console.warn('[booking] Email not configured; no confirmation sent for booking', booking.id);
    return;
  }
  const { sender, inbox } = firmAddresses();
  const dict = getDictionary(booking.lang);
  const e = dict.bookingPage.emails;
  const when = formatSlot(booking.start, booking.lang);
  const cancelUrl = `${SITE_URL}/${booking.lang}/book/cancel?token=${encodeURIComponent(cancelToken)}`;
  const name = oneLine(`${booking.firstName} ${booking.lastName}`);

  const clientText = [
    fill(e.greeting, { firstName: oneLine(booking.firstName) }),
    '',
    e.confirmed,
    '',
    fill(e.when, when),
    fill(e.how, { how: howLine(booking, e) }),
    '',
    fill(e.cancelLine, { url: cancelUrl }),
    '',
    fill(e.questions, { email: dict.site.email, phone: dict.site.phone }),
    '',
    e.signoff,
  ].join('\n');

  const clientEmail = sendMail({
    from: { name: 'Conseils Verax', address: sender },
    to: { name, address: booking.email },
    replyTo: inbox,
    subject: fill(e.confirmSubject, when),
    text: clientText,
    icalEvent: {
      filename: 'consultation.ics',
      method: 'PUBLISH',
      content: calendarFile({
        booking,
        method: 'PUBLISH',
        summary: e.calendarTitle,
        description: `${howLine(booking, e)}\n\n${fill(e.cancelLine, { url: cancelUrl })}`,
      }),
    },
  });

  // The firm's notification is in English, like contact-form enquiries.
  const firmWhen = formatSlot(booking.start, 'en');
  const how = booking.meetingType === 'phone' ? `Phone call — call ${booking.phone}` : 'Video call — send them the video link';
  const firmText = [
    `${name} booked a first consultation.`,
    '',
    `When: ${firmWhen.date}, ${firmWhen.time} Eastern Time (${BOOKING.slotMinutes} minutes)`,
    `How: ${how}`,
    `Email: ${oneLine(booking.email)}`,
    `Phone: ${booking.phone || '—'}`,
    `Site language: ${booking.lang === 'fr' ? 'French' : 'English'}`,
    '',
    'Message:',
    booking.message || '(none)',
    '',
    '—',
    'Booked on the Conseils Verax website. Reply to this email to write to the client.',
  ].join('\n');

  const firmEmail = sendMail({
    from: { name: 'Conseils Verax website', address: sender },
    to: inbox,
    replyTo: { name, address: oneLine(booking.email) },
    subject: `New booking: ${name} — ${firmWhen.date}, ${firmWhen.time} ET (${booking.meetingType})`,
    text: firmText,
    icalEvent: {
      filename: 'booking.ics',
      method: 'PUBLISH',
      content: calendarFile({ booking, method: 'PUBLISH', summary: `Consultation: ${name} (${booking.meetingType})`, description: firmText }),
    },
  });

  const results = await Promise.allSettled([clientEmail, firmEmail]);
  for (const r of results) if (r.status === 'rejected') console.error('[booking] Email failed:', r.reason?.message ?? r.reason);
}

/** Emails the client and the firm when a booking is cancelled. Never throws. */
export async function notifyCancelled(booking) {
  if (!isMailConfigured()) return;
  const { sender, inbox } = firmAddresses();
  const e = getDictionary(booking.lang).bookingPage.emails;
  const when = formatSlot(booking.start, booking.lang);
  const name = oneLine(`${booking.firstName} ${booking.lastName}`);
  const firmWhen = formatSlot(booking.start, 'en');

  const results = await Promise.allSettled([
    sendMail({
      from: { name: 'Conseils Verax', address: sender },
      to: { name, address: booking.email },
      replyTo: inbox,
      subject: fill(e.cancelledSubject, when),
      text: [fill(e.cancelledBody, { ...when, url: `${SITE_URL}/${booking.lang}/book` }), '', e.signoff].join('\n'),
      icalEvent: {
        filename: 'consultation.ics',
        method: 'CANCEL',
        content: calendarFile({ booking, method: 'CANCEL', summary: e.calendarTitle, description: '' }),
      },
    }),
    sendMail({
      from: { name: 'Conseils Verax website', address: sender },
      to: inbox,
      replyTo: { name, address: oneLine(booking.email) },
      subject: `Booking cancelled: ${name} — ${firmWhen.date}, ${firmWhen.time} ET`,
      text: `${name} cancelled their consultation on ${firmWhen.date} at ${firmWhen.time} Eastern Time. The time is available again.`,
      icalEvent: {
        filename: 'booking.ics',
        method: 'CANCEL',
        content: calendarFile({ booking, method: 'CANCEL', summary: `Consultation: ${name}`, description: '' }),
      },
    }),
  ]);
  for (const r of results) if (r.status === 'rejected') console.error('[booking] Email failed:', r.reason?.message ?? r.reason);
}
