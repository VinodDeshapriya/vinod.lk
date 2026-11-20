#!/usr/bin/env node
/**
 * One-time: connects the booking popup to your Google Calendar.
 *
 *   GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=... node scripts/google-calendar-token.mjs
 *
 * Open the link it prints, sign in as vinoddeshapriya@gmail.com and allow access.
 * It then prints GOOGLE_REFRESH_TOKEN to put in .env.local and on your host.
 */
import http from "node:http";

const id = process.env.GOOGLE_CLIENT_ID;
const secret = process.env.GOOGLE_CLIENT_SECRET;
if (!id || !secret) {
  console.error("Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET first (see BOOKING.md).");
  process.exit(1);
}
const PORT = 53682;
const redirect = `http://127.0.0.1:${PORT}/callback`;
const auth = new URL("https://accounts.google.com/o/oauth2/v2/auth");
auth.search = new URLSearchParams({
  client_id: id,
  redirect_uri: redirect,
  response_type: "code",
  access_type: "offline",
  prompt: "consent",
  scope: "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.freebusy",
}).toString();

http
  .createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", redirect);
    if (url.pathname !== "/callback") return res.end();
    const code = url.searchParams.get("code");
    if (!code) {
      res.end("No code received.");
      return;
    }
    const r = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ code, client_id: id, client_secret: secret, redirect_uri: redirect, grant_type: "authorization_code" }),
    });
    const j = await r.json();
    if (!j.refresh_token) {
      res.end("Google didn't return a refresh token. Check the terminal.");
      console.error(j);
      process.exit(1);
    }
    res.end("Connected. You can close this tab and go back to the terminal.");
    console.log(`\nAdd this to .env.local and to your host's environment variables:\n\nGOOGLE_REFRESH_TOKEN=${j.refresh_token}\n`);
    process.exit(0);
  })
  .listen(PORT, "127.0.0.1", () => console.log(`\nOpen this link, sign in as vinoddeshapriya@gmail.com and allow access:\n\n${auth}\n`));
