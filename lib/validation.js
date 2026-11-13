/**
 * Contact-form validation, shared by the browser form and the API route so both
 * apply exactly the same rules. Returns error *codes*; the messages shown to
 * visitors live in lib/content.js (contactPage.form.errors).
 */

export const LIMITS = {
  name: 100,
  email: 254,
  choice: 100,
  message: 5000,
  phone: 40,
};

// Deliberately simple: something@something.tld, no spaces.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Fields that must be filled in, in the order they appear on the form. */
export const REQUIRED_FIELDS = ['firstName', 'lastName', 'email'];

/** Field order used to decide which invalid field receives focus first. */
export const FIELD_ORDER = ['firstName', 'lastName', 'email', 'clientType', 'service', 'message'];

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function validateEnquiry(input) {
  const source = input && typeof input === 'object' ? input : {};

  const values = {
    firstName: text(source.firstName),
    lastName: text(source.lastName),
    email: text(source.email),
    clientType: text(source.clientType),
    service: text(source.service),
    message: text(source.message),
  };

  const errors = {};

  if (!values.firstName) errors.firstName = 'required';
  else if (values.firstName.length > LIMITS.name) errors.firstName = 'tooLong';

  if (!values.lastName) errors.lastName = 'required';
  else if (values.lastName.length > LIMITS.name) errors.lastName = 'tooLong';

  if (!values.email) errors.email = 'required';
  else if (values.email.length > LIMITS.email) errors.email = 'tooLong';
  else if (!EMAIL_PATTERN.test(values.email)) errors.email = 'invalid';

  if (values.message.length > LIMITS.message) errors.message = 'tooLong';

  return { values, errors, isValid: Object.keys(errors).length === 0 };
}

export const MEETING_TYPES = ['phone', 'video'];

/** Booking form: same rules as the contact form for name, email and message, plus how to meet. */
export function validateBooking(input) {
  const source = input && typeof input === 'object' ? input : {};
  const { values: base, errors } = validateEnquiry(source);
  const values = {
    firstName: base.firstName,
    lastName: base.lastName,
    email: base.email,
    message: base.message,
    meetingType: text(source.meetingType),
    phone: text(source.phone),
    start: text(source.start),
  };

  if (!MEETING_TYPES.includes(values.meetingType)) errors.meetingType = 'required';
  if (values.meetingType === 'phone') {
    const digits = values.phone.replace(/\D/g, '');
    if (!values.phone) errors.phone = 'required';
    else if (values.phone.length > LIMITS.phone || !/^[+\d\s().-]+$/.test(values.phone) || digits.length < 10 || digits.length > 15)
      errors.phone = 'invalid';
  } else values.phone = '';
  if (!values.start) errors.start = 'required';

  return { values, errors, isValid: Object.keys(errors).length === 0 };
}

/** Field order for moving focus to the first invalid booking field. */
export const BOOKING_FIELD_ORDER = ['firstName', 'lastName', 'email', 'meetingType', 'phone', 'message'];
