# Book a free call

Any link to `#book-a-call` (for example a Prismic button with the URL `#book-a-call`)
opens the booking popup. A visitor picks a day and time from your free slots, adds
their details, and then:

1. an event with a Google Meet link is created on your Google Calendar and the
   visitor is invited to it,
2. the visitor gets a confirmation email,
3. info@vinod.lk gets an email with their details.

Hours, call length and notice are in `src/lib/booking/config.ts` (Sri Lanka time).
Preview the emails while `npm run dev` runs:
`/api/booking/preview?to=guest` and `/api/booking/preview?to=admin`.

## Environment variables

Set these in `.env.local` and on your host (Vercel › Settings › Environment Variables):

| Variable | Value |
| --- | --- |
| `GOOGLE_CLIENT_ID` | From the Google Cloud OAuth client (step 1) |
| `GOOGLE_CLIENT_SECRET` | From the same client |
| `GOOGLE_REFRESH_TOKEN` | Printed by `scripts/google-calendar-token.mjs` (step 2) |
| `GOOGLE_CALENDAR_ID` | Optional. `primary` by default |
| `RESEND_API_KEY` | Resend API key (also used by the contact form) |
| `CONTACT_FROM_EMAIL` | `Vinod.lk <info@vinod.lk>` once vinod.lk is verified in Resend |
| `BOOKING_ADMIN_EMAIL` | Optional. `info@vinod.lk` by default |

## 1. Google Cloud (once, about 10 minutes)

1. Go to https://console.cloud.google.com, signed in as vinoddeshapriya@gmail.com,
   and create a project, e.g. "vinod.lk website".
2. APIs & Services › Library › **Google Calendar API** › Enable.
3. APIs & Services › OAuth consent screen: External, app name "vinod.lk",
   your email for support and developer contact. Add yourself as a test user.
   Then click **Publish app** (In production). Unpublished "Testing" apps get
   refresh tokens that expire after 7 days, which would stop bookings.
4. APIs & Services › Credentials › Create credentials › OAuth client ID ›
   **Desktop app**. Copy the client ID and secret.

## 2. Connect the calendar (once)

```bash
GOOGLE_CLIENT_ID=xxx GOOGLE_CLIENT_SECRET=yyy node scripts/google-calendar-token.mjs
```

Open the link, sign in as vinoddeshapriya@gmail.com. Google warns the app is
unverified: click Advanced › Go to vinod.lk (it's your own app). Allow access,
then copy the printed `GOOGLE_REFRESH_TOKEN`.

## 3. Email (Resend)

In https://resend.com add the domain **vinod.lk** and the DNS records it shows,
so emails can come from info@vinod.lk. Until then, Resend only delivers to your
own Resend account address.

Without the Google variables the popup still shows working-hour slots, and in
development a booking is only logged. In production it asks visitors to use
WhatsApp or email instead.
