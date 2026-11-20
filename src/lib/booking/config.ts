/**
 * "Book a free call" settings. Times are Sri Lanka time (no daylight saving),
 * the calendar is the Google account set up in .env (see BOOKING.md).
 */
export const bookingConfig = {
  title: "Free discovery call with Vinod",
  durationMin: 20,
  /** A new slot starts every… */
  slotStepMin: 30,
  timeZone: "Asia/Colombo",
  /** Asia/Colombo is UTC+05:30 all year. */
  tzOffsetMin: 330,
  /** 0 = Sunday … 6 = Saturday */
  days: [1, 2, 3, 4, 5, 6],
  dayStart: "09:00",
  dayEnd: "18:00",
  /** Free time kept either side of existing calendar events. */
  bufferMin: 10,
  minNoticeHours: 12,
  maxDaysAhead: 30,
};

export const bookingEnv = () => ({
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
  resendKey: process.env.RESEND_API_KEY,
  from: process.env.CONTACT_FROM_EMAIL || "Vinod.lk <onboarding@resend.dev>",
  adminEmail: process.env.BOOKING_ADMIN_EMAIL || "info@vinod.lk",
});

export const calendarConfigured = () => {
  const e = bookingEnv();
  return !!(e.googleClientId && e.googleClientSecret && e.googleRefreshToken);
};
