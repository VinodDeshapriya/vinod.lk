"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { sendEnquiry } from "@/lib/contact/submit";

/**
 * "Get a Free Quote" popup. Any link to /contact whose text mentions "quote", any
 * link to "#get-a-quote", and window.dispatchEvent(new Event("quote:open")) open it.
 * Two short steps (project, then contact details) instead of one long form; it sends
 * through the same route as the Contact page form (Resend emails + Netlify Forms).
 */
const HASH = "#get-a-quote";
type Step = "project" | "details" | "done";

const isQuoteLink = (a: HTMLAnchorElement) => {
  const raw = a.getAttribute("href") ?? "";
  if (raw.endsWith(HASH)) return true;
  let url: URL;
  try {
    url = new URL(a.href, location.href);
  } catch {
    return false;
  }
  return (
    url.origin === location.origin &&
    /^\/contact\/?$/.test(url.pathname) &&
    /quote/i.test(a.textContent ?? a.getAttribute("aria-label") ?? "")
  );
};

const PERKS = [
  {
    t: "A clear price, not a guess",
    d: "A written quote based on what you actually need.",
  },
  {
    t: "Reply within one working day",
    d: "Usually the same day, Monday to Saturday.",
  },
  {
    t: "Free, with no obligation",
    d: "Honest advice even if we don't end up working together.",
  },
];

export default function QuoteModal({
  services,
  budgets,
  privacyHref,
  whatsapp,
}: {
  services: string[];
  budgets: string[];
  privacyHref: string;
  whatsapp: string;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("project");
  const [service, setService] = useState("");
  const [budget, setBudget] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    company: "",
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const panel = useRef<HTMLDivElement>(null);
  const nameField = useRef<HTMLInputElement>(null);

  const show = useCallback(() => {
    setOpen(true);
    setError("");
    setStep((s) => (s === "done" ? "project" : s));
  }, []);
  const close = useCallback(() => {
    setOpen(false);
    if (location.hash === HASH)
      history.replaceState(null, "", location.pathname + location.search);
    setStep((s) => {
      if (s === "done") {
        setService("");
        setBudget("");
        setForm({ name: "", email: "", phone: "", message: "", company: "" });
        return "project";
      }
      return s;
    });
  }, []);

  // Open from quote links, the custom event, or a #get-a-quote URL.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const a = (e.target as HTMLElement).closest?.(
        "a[href]",
      ) as HTMLAnchorElement | null;
      if (a && isQuoteLink(a)) {
        e.preventDefault();
        e.stopPropagation();
        show();
      }
    };
    const onEvent = () => show();
    document.addEventListener("click", onClick, true);
    window.addEventListener("quote:open", onEvent);
    if (location.hash === HASH) queueMicrotask(show);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("quote:open", onEvent);
    };
  }, [show]);

  // Lock the page behind the popup; Escape closes it.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    window.__lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    panel.current?.focus();
    return () => {
      html.style.overflow = prev;
      window.__lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  useEffect(() => {
    if (open && step === "details")
      nameField.current?.focus({ preventScroll: true });
  }, [open, step]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      await sendEnquiry({ ...form, service, budget, source: "Quote popup" });
      setStep("done");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Sorry, that didn't go through.",
      );
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;
  const first = form.name.trim().split(/\s+/)[0];
  const field =
    "w-full h-12 rounded-[12px] border border-white/15 bg-white/[0.04] px-4 text-[15px] text-white placeholder:text-white/35 outline-none transition-colors focus:border-secondary-light focus:bg-white/[0.07]";
  const chip = (on: boolean) =>
    clsx(
      "min-h-11 px-3.5 py-2 rounded-[12px] border text-[14px] leading-[18px] text-left transition-colors",
      on
        ? "border-secondary-light bg-secondary-light/15 text-white"
        : "border-white/12 bg-white/[0.03] text-white/80 hover:border-white/30 hover:text-white",
    );
  const wa = `https://wa.me/${whatsapp}?text=${encodeURIComponent("Hi Vinod, I'd like a quote for a website.")}`;

  return (
    <div
      className="fixed inset-0 z-[100]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quote-title"
    >
      <div
        className="absolute inset-0 bg-[#03060d]/70 backdrop-blur-sm animate-[fade-in_0.25s_ease-out]"
        onClick={close}
      />
      <div
        data-lenis-prevent
        className="absolute inset-0 overflow-y-auto overscroll-contain"
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        <div className="min-h-full flex items-start md:items-center justify-center md:p-8 pointer-events-none">
          <div
            ref={panel}
            tabIndex={-1}
            className="pointer-events-auto grain relative isolate overflow-hidden w-full max-w-[920px] min-h-dvh md:min-h-0 md:rounded-[28px] bg-[linear-gradient(to_bottom,#080d1a,#0a1733)] text-white shadow-[0_40px_120px_-20px_rgba(0,0,0,0.6)] outline-none animate-[booking-in_0.45s_cubic-bezier(0.22,1,0.36,1)]"
          >
            <div
              aria-hidden
              className="absolute -left-40 -top-40 w-[520px] h-[380px] rounded-full bg-primary-light/25 blur-[100px]"
            />
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 md:right-5 md:top-5 z-10 size-10 rounded-full border border-white/15 bg-white/[0.04] flex items-center justify-center text-white/70 hover:text-white hover:border-white/30 transition-colors"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden
              >
                <path
                  d="M1 1l12 12M13 1L1 13"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {step === "done" ? (
              <section className="relative flex flex-col items-center text-center px-6 py-20 md:py-16 max-w-[540px] mx-auto">
                <span className="size-16 rounded-full bg-secondary-light/15 border border-secondary-light/40 flex items-center justify-center animate-[booking-in_0.5s_cubic-bezier(0.22,1,0.36,1)]">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M5 12.5l4.5 4.5L19 7.5"
                      stroke="#6fb2ff"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <h2
                  id="quote-title"
                  className="mt-6 font-title font-medium text-[32px] leading-[38px] md:text-[40px] md:leading-[46px] tracking-[-0.02em]"
                >
                  Thanks{first ? `, ${first}` : ""}.{" "}
                  <span className="italic text-secondary-light">Got it.</span>
                </h2>
                <p className="mt-4 text-[16px] leading-[26px] text-white/70">
                  I&apos;ll look at your project and reply within one working
                  day. A copy is on its way to{" "}
                  <span className="text-white">{form.email}</span>.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-12 px-6 rounded-full bg-primary-light text-white text-[15px] font-semibold inline-flex items-center justify-center hover:bg-[#2a8dff] transition-colors"
                  >
                    Chat on WhatsApp now
                  </a>
                  <button
                    type="button"
                    onClick={close}
                    className="h-12 px-6 rounded-full border border-white/20 text-[15px] font-semibold hover:border-white/40 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </section>
            ) : (
              <div className="relative grid md:grid-cols-[0.85fr_1.15fr]">
                {/* Why ask for a quote */}
                <aside className="px-5 pt-16 pb-2 md:px-10 md:py-10 md:border-r border-white/10 flex flex-col">
                  <p className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.16em] text-secondary-light">
                    <span className="size-1.5 rounded-full bg-secondary-light" />{" "}
                    Free quote
                  </p>
                  <h2
                    id="quote-title"
                    className="mt-3 font-title font-medium text-[30px] leading-[36px] md:text-[38px] md:leading-[44px] tracking-[-0.02em]"
                  >
                    Tell me about{" "}
                    <span className="italic text-secondary-light">
                      your project.
                    </span>
                  </h2>
                  <p className="mt-3 text-[15px] leading-[24px] text-white/60">
                    Takes under a minute. Two quick steps.
                  </p>
                  <ul className="hidden md:flex mt-8 flex-col gap-5">
                    {PERKS.map((p) => (
                      <li key={p.t} className="flex gap-3">
                        <span className="mt-0.5 size-5 shrink-0 rounded-full bg-secondary-light/15 flex items-center justify-center">
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 12 12"
                            fill="none"
                            aria-hidden
                          >
                            <path
                              d="M2.5 6.2l2.3 2.3L9.5 3.8"
                              stroke="#6fb2ff"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        <span>
                          <span className="block text-[15px] font-medium">
                            {p.t}
                          </span>
                          <span className="block mt-0.5 text-[13px] leading-[20px] text-white/55">
                            {p.d}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden md:inline-flex mt-auto pt-10 items-center gap-2 text-[14px] text-white/60 hover:text-white transition-colors"
                  >
                    Prefer to chat?{" "}
                    <span className="underline underline-offset-4">
                      Message me on WhatsApp
                    </span>
                  </a>
                </aside>

                {/* The form */}
                <div className="px-5 pt-6 pb-8 md:px-10 md:py-10">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-[12px] font-medium text-white/50 whitespace-nowrap">
                      Step {step === "project" ? 1 : 2} of 2
                    </span>
                    <span className="flex-1 grid grid-cols-2 gap-1.5">
                      <span className="h-1 rounded-full bg-secondary-light" />
                      <span
                        className={clsx(
                          "h-1 rounded-full transition-colors",
                          step === "details"
                            ? "bg-secondary-light"
                            : "bg-white/12",
                        )}
                      />
                    </span>
                  </div>

                  {step === "project" ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (service) setStep("details");
                      }}
                      className="flex flex-col gap-7"
                    >
                      <fieldset>
                        <legend className="text-[15px] font-medium mb-3">
                          What do you need?
                        </legend>
                        <div className="grid grid-cols-2 gap-2">
                          {services.map((s, i) => (
                            <button
                              key={s}
                              type="button"
                              aria-pressed={service === s}
                              onClick={() => setService(s)}
                              className={clsx(
                                chip(service === s),
                                services.length % 2 === 1 &&
                                  i === services.length - 1 &&
                                  "col-span-2",
                              )}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </fieldset>
                      {budgets.length > 0 && (
                        <fieldset>
                          <legend className="text-[15px] font-medium mb-3">
                            Rough budget{" "}
                            <span className="font-normal text-white/45">
                              (optional)
                            </span>
                          </legend>
                          <div className="flex flex-wrap gap-2">
                            {budgets.map((b) => (
                              <button
                                key={b}
                                type="button"
                                aria-pressed={budget === b}
                                onClick={() => setBudget(budget === b ? "" : b)}
                                className={clsx(
                                  chip(budget === b),
                                  "rounded-full px-4",
                                )}
                              >
                                {b}
                              </button>
                            ))}
                          </div>
                        </fieldset>
                      )}
                      <button
                        type="submit"
                        disabled={!service}
                        className="h-12 rounded-full bg-primary-light text-white text-[15px] font-semibold enabled:hover:bg-[#2a8dff] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        {service ? "Continue" : "Choose a service to continue"}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={submit} className="flex flex-col gap-4">
                      <div className="flex items-center justify-between gap-3 rounded-[12px] border border-white/10 bg-white/[0.03] px-4 py-3">
                        <span className="text-[14px] text-white/80 truncate">
                          {service}
                          {budget && (
                            <span className="text-white/45"> · {budget}</span>
                          )}
                        </span>
                        <button
                          type="button"
                          onClick={() => setStep("project")}
                          className="shrink-0 text-[13px] text-secondary-light hover:text-white transition-colors"
                        >
                          Change
                        </button>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <label className="flex flex-col gap-1.5 text-[13px] text-white/70">
                          <span>
                            Your name
                            <span className="text-secondary-light">*</span>
                          </span>
                          <input
                            ref={nameField}
                            required
                            autoComplete="name"
                            className={field}
                            value={form.name}
                            onChange={(e) =>
                              setForm({ ...form, name: e.target.value })
                            }
                          />
                        </label>
                        <label className="flex flex-col gap-1.5 text-[13px] text-white/70">
                          <span>
                            Email<span className="text-secondary-light">*</span>
                          </span>
                          <input
                            required
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            className={field}
                            value={form.email}
                            onChange={(e) =>
                              setForm({ ...form, email: e.target.value })
                            }
                          />
                        </label>
                      </div>
                      <label className="flex flex-col gap-1.5 text-[13px] text-white/70">
                        <span>
                          WhatsApp or phone{" "}
                          <span className="text-white/40">
                            (optional, for a quicker reply)
                          </span>
                        </span>
                        <input
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder="07X XXX XXXX"
                          className={field}
                          value={form.phone}
                          onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                          }
                        />
                      </label>
                      <label className="flex flex-col gap-1.5 text-[13px] text-white/70">
                        <span>
                          Anything I should know?{" "}
                          <span className="text-white/40">(optional)</span>
                        </span>
                        <textarea
                          rows={3}
                          placeholder="Your business, what the site should do, or a site you like"
                          className={clsx(field, "h-auto py-3 resize-none")}
                          value={form.message}
                          onChange={(e) =>
                            setForm({ ...form, message: e.target.value })
                          }
                        />
                      </label>
                      <input
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden
                        className="hidden"
                        value={form.company}
                        onChange={(e) =>
                          setForm({ ...form, company: e.target.value })
                        }
                      />
                      {error && (
                        <p role="alert" className="text-[14px] text-red-300">
                          {error}
                        </p>
                      )}
                      <button
                        type="submit"
                        disabled={sending}
                        className="mt-1 h-12 rounded-full bg-primary-light text-white text-[15px] font-semibold hover:bg-[#2a8dff] disabled:opacity-60 transition-colors"
                      >
                        {sending ? "Sending…" : "Get my free quote"}
                      </button>
                      <p className="text-[12px] leading-[18px] text-white/45 text-center">
                        Your details are only used to reply to you. See the{" "}
                        <a
                          href={privacyHref}
                          target="_blank"
                          className="underline underline-offset-2 hover:text-white"
                        >
                          privacy policy
                        </a>
                        .
                      </p>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
