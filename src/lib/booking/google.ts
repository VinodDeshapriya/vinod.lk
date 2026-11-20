import { bookingEnv } from "./config";

/** Google Calendar over its REST API, authorised with the owner's refresh token. */
let cached: { token: string; exp: number } | null = null;

async function accessToken() {
  if (cached && cached.exp > Date.now() + 60_000) return cached.token;
  const e = bookingEnv();
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: e.googleClientId!,
      client_secret: e.googleClientSecret!,
      refresh_token: e.googleRefreshToken!,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Google token ${res.status}: ${await res.text()}`);
  const j = (await res.json()) as { access_token: string; expires_in: number };
  cached = { token: j.access_token, exp: Date.now() + j.expires_in * 1000 };
  return j.access_token;
}

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`https://www.googleapis.com/calendar/v3${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${await accessToken()}`, "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Google Calendar ${res.status}: ${await res.text()}`);
  return (await res.json()) as T;
}

export type Busy = { start: number; end: number };

/** Busy blocks on the booking calendar between two times. */
export async function getBusy(from: Date, to: Date): Promise<Busy[]> {
  const id = bookingEnv().calendarId;
  const j = await api<{ calendars: Record<string, { busy: { start: string; end: string }[] }> }>("/freeBusy", {
    method: "POST",
    body: JSON.stringify({ timeMin: from.toISOString(), timeMax: to.toISOString(), items: [{ id }] }),
  });
  const cal = j.calendars[id] ?? Object.values(j.calendars)[0];
  return (cal?.busy ?? []).map((b) => ({ start: Date.parse(b.start), end: Date.parse(b.end) }));
}

/** Creates the meeting with a Google Meet link and invites the guest. */
export async function createEvent(opts: {
  start: Date;
  end: Date;
  summary: string;
  description: string;
  guest: { email: string; name: string };
}) {
  const id = encodeURIComponent(bookingEnv().calendarId);
  const ev = await api<{
    id: string;
    htmlLink: string;
    hangoutLink?: string;
    conferenceData?: { entryPoints?: { entryPointType: string; uri: string }[] };
  }>(`/calendars/${id}/events?conferenceDataVersion=1&sendUpdates=all`, {
    method: "POST",
    body: JSON.stringify({
      summary: opts.summary,
      description: opts.description,
      start: { dateTime: opts.start.toISOString() },
      end: { dateTime: opts.end.toISOString() },
      attendees: [{ email: opts.guest.email, displayName: opts.guest.name }],
      conferenceData: {
        createRequest: { requestId: crypto.randomUUID(), conferenceSolutionKey: { type: "hangoutsMeet" } },
      },
      reminders: { useDefault: true },
    }),
  });
  const meetUrl = ev.hangoutLink ?? ev.conferenceData?.entryPoints?.find((p) => p.entryPointType === "video")?.uri;
  return { id: ev.id, htmlLink: ev.htmlLink, meetUrl };
}
