/**
 * Sends an enquiry two ways at once: Resend emails (/api/contact) and a copy to
 * Netlify Forms ("project-enquiry", declared in public/__forms.html). It counts as
 * sent if either gets through. Throws with a message the visitor can read otherwise.
 */
export async function sendEnquiry(payload: Record<string, string>) {
  const data = {
    ...payload,
    page: typeof location === "undefined" ? "" : location.href,
  };
  const viaEmail = fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(async (res) => ({
      ok: res.ok,
      error: ((await res.json().catch(() => ({}))) as { error?: string }).error,
    }))
    .catch(() => ({ ok: false, error: undefined as string | undefined }));
  const viaNetlify = fetch("/__forms.html", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      "form-name": "project-enquiry",
      ...data,
    }).toString(),
  })
    .then((res) => res.ok)
    .catch(() => false);
  const [email, stored] = await Promise.all([viaEmail, viaNetlify]);
  if (!email.ok && !stored)
    throw new Error(
      email.error ||
        "Something went wrong. Please try WhatsApp or email instead.",
    );
}
