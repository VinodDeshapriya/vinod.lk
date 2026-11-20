import { promises as fs } from "node:fs";
import path from "node:path";
import { redirectUri } from "../route";

/** Dev only: swaps Google's code for a refresh token and writes it to .env.local (never shown). */
export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") return new Response("Not found", { status: 404 });
  const code = new URL(request.url).searchParams.get("code");
  if (!code) return new Response("Google didn't send a code. Start again at /api/booking/google-auth.", { status: 400 });

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri(request),
      grant_type: "authorization_code",
    }),
  });
  const j = (await res.json()) as { refresh_token?: string; error?: string; error_description?: string };
  if (!j.refresh_token) {
    return new Response(`No refresh token returned (${j.error ?? res.status}: ${j.error_description ?? ""}). Start again.`, { status: 400 });
  }

  const file = path.join(process.cwd(), ".env.local");
  const current = await fs.readFile(file, "utf8").catch(() => "");
  const line = `GOOGLE_REFRESH_TOKEN=${j.refresh_token}`;
  const next = /^GOOGLE_REFRESH_TOKEN=.*$/m.test(current)
    ? current.replace(/^GOOGLE_REFRESH_TOKEN=.*$/m, line)
    : `${current.replace(/\n?$/, "\n")}${line}\n`;
  await fs.writeFile(file, next);

  return new Response(
    `<!doctype html><meta charset="utf-8"><body style="font:16px/1.6 system-ui;padding:48px;max-width:560px">
    <h1 style="font-size:24px">Calendar connected ✓</h1>
    <p>The refresh token was saved to <code>.env.local</code>. Add the same three GOOGLE_ values to your host's environment variables before deploying.</p>
    <p><a href="/#book-a-call">Open the booking popup</a></p></body>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}
