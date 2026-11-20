import { NextResponse } from "next/server";

/**
 * Dev only: open http://127.0.0.1:1204/api/booking/google-auth to connect the
 * booking calendar. Needs GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local
 * (a Google "Desktop app" OAuth client). The callback saves the refresh token there.
 */
export const redirectUri = (request: Request) => `${new URL(request.url).origin}/api/booking/google-auth/callback`;

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") return new Response("Not found", { status: 404 });
  const id = process.env.GOOGLE_CLIENT_ID;
  if (!id || !process.env.GOOGLE_CLIENT_SECRET) {
    return new Response("Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env.local, then reload this page.", { status: 400 });
  }
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search = new URLSearchParams({
    client_id: id,
    redirect_uri: redirectUri(request),
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    login_hint: "vinoddeshapriya@gmail.com",
    scope: "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.freebusy",
  }).toString();
  return NextResponse.redirect(url);
}
