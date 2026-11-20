"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";

/**
 * "Book a free call" popup (layout after lev.com/schedule): pick a day and a
 * time, then add your details. Any link to "#book-a-call" opens it, and so does
 * window.dispatchEvent(new Event("booking:open")).
 */
const HASH = "#book-a-call";
const DURATION = 20;

type Step = "pick" | "details" | "done";
const pad = (n: number) => String(n).padStart(2, "0");
const dayKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const monthKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
const fmtTime = (iso: string) => new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date(iso));
const fmtDay = (d: Date) => new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(d);
const fmtLong = (d: Date) => new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(d);

function zoneLabel() {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const off = new Intl.DateTimeFormat("en-US", { timeZoneName: "shortOffset" }).formatToParts(new Date()).find((p) => p.type === "timeZoneName")?.value;
  return { tz, label: `${tz.replace(/_/g, " ")}${off ? ` (${off})` : ""}` };
}

export default function BookingModal() {
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [step, setStep] = useState<Step>("pick");
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [cache, setCache] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "", company: "" });
  const [showNotes, setShowNotes] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [meetUrl, setMeetUrl] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const zone = useMemo(() => (typeof window === "undefined" ? { tz: "", label: "" } : zoneLabel()), [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const show = useCallback(() => {
    setNow(new Date());
    setOpen(true);
    setStep("pick");
    setError("");
  }, []);
  const close = useCallback(() => {
    setOpen(false);
    if (location.hash === HASH) history.replaceState(null, "", location.pathname + location.search);
  }, []);

  // Open from any #book-a-call link, the custom event, or a #book-a-call URL.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.("a[href]") as HTMLAnchorElement | null;
      if (a && a.getAttribute("href")?.endsWith(HASH)) {
        e.preventDefault();
        e.stopPropagation();
        show();
      }
    };
    const onEvent = () => show();
    document.addEventListener("click", onClick, true);
    window.addEventListener("booking:open", onEvent);
    if (location.hash === HASH) queueMicrotask(show);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("booking:open", onEvent);
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

  // Load the free times for the month on screen.
  const key = monthKey(month);
  const loadMonth = useCallback(
    async (m: Date, force = false) => {
      const k = monthKey(m);
      if (!force && cache[k]) return cache[k];
      setLoading(true);
      setLoadError("");
      try {
        const from = new Date(Math.max(Date.now(), m.getTime()));
        const to = new Date(m.getFullYear(), m.getMonth() + 1, 1);
        const res = await fetch(`/api/booking/availability?from=${from.toISOString()}&to=${to.toISOString()}`, { cache: "no-store" });
        const j = await res.json();
        if (!res.ok) throw new Error(j.error || "Couldn't load times.");
        setCache((c) => ({ ...c, [k]: j.slots }));
        return j.slots as string[];
      } catch (e) {
        setLoadError(e instanceof Error ? e.message : "Couldn't load times.");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [cache],
  );

  useEffect(() => {
    if (!open) return;
    Promise.resolve().then(() => loadMonth(month)).then((slots) => {
      // Jump to the first day that has a free time.
      if (!day || !day.startsWith(key)) setDay(slots.length ? dayKey(new Date(slots[0])) : null);
    });
  }, [open, key]); // eslint-disable-line react-hooks/exhaustive-deps

  const slots = useMemo(() => cache[key] ?? [], [cache, key]);
  const byDay = useMemo(() => {
    const m: Record<string, string[]> = {};
    for (const s of slots) (m[dayKey(new Date(s))] ??= []).push(s);
    return m;
  }, [slots]);

  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonth = new Date(now.getTime() + 31 * 864e5);
  const canPrev = month > thisMonth;
  const canNext = new Date(month.getFullYear(), month.getMonth() + 1, 1) <= lastMonth;
  const lead = month.getDay();
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const today = dayKey(now);

  const pick = (s: string) => {
    setSlot(s);
    setStep("details");
    setError("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slot) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, start: slot, timeZone: zone.tz }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (j.taken) {
          await loadMonth(month, true);
          setStep("pick");
        }
        throw new Error(j.error || "Sorry, that didn't go through.");
      }
      setMeetUrl(j.meetUrl ?? null);
      setStep("done");
      setCache({});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sorry, that didn't go through.");
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;
  const start = slot ? new Date(slot) : null;
  const end = start ? new Date(start.getTime() + DURATION * 60_000) : null;
  const field =
    "w-full h-11 rounded-[10px] border border-white/15 bg-white/[0.04] px-3.5 text-[15px] text-white placeholder:text-white/35 outline-none transition-colors focus:border-secondary-light focus:bg-white/[0.06]";

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-labelledby="booking-title">
      <div className="absolute inset-0 bg-[#03060d]/70 backdrop-blur-sm animate-[fade-in_0.25s_ease-out]" onClick={close} />
      <div data-lenis-prevent className="absolute inset-0 overflow-y-auto overscroll-contain" onClick={(e) => e.target === e.currentTarget && close()}>
        <div className="min-h-full flex items-start md:items-center justify-center md:p-8 pointer-events-none">
          <div
            ref={panel}
            tabIndex={-1}
            className="pointer-events-auto grain relative isolate overflow-hidden w-full max-w-[880px] min-h-dvh md:min-h-0 md:rounded-[28px] bg-[linear-gradient(to_bottom,#080d1a,#0a1733)] text-white shadow-[0_40px_120px_-20px_rgba(0,0,0,0.6)] outline-none animate-[booking-in_0.45s_cubic-bezier(0.22,1,0.36,1)]"
          >
            <div aria-hidden className="absolute -right-32 -top-40 w-[520px] h-[380px] rounded-full bg-primary-light/25 blur-[100px]" />
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 md:right-5 md:top-5 z-10 size-10 rounded-full border border-white/15 bg-white/[0.04] flex items-center justify-center text-white/70 hover:text-white hover:border-white/30 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>

            <div className="relative px-5 pt-14 pb-6 md:px-10 md:pt-10 md:pb-10">
              {step !== "done" && (
                <header className="max-w-[560px] mb-7 md:mb-8">
                  <p className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.16em] text-secondary-light">
                    <span className="size-1.5 rounded-full bg-secondary-light" /> Free {DURATION}-minute call
                  </p>
                  <h2 id="booking-title" className="mt-3 font-title font-medium text-[30px] leading-[36px] md:text-[40px] md:leading-[46px] tracking-[-0.02em]">
                    Let&apos;s talk about <span className="italic text-secondary-light">your project.</span>
                  </h2>
                  <p className="mt-3 text-[15px] leading-[24px] md:text-[16px] md:leading-[26px] text-white/65">
                    Pick a time that suits you. We&apos;ll meet on Google Meet, and you&apos;ll leave with honest advice on what to do next. No obligation.
                  </p>
                </header>
              )}

              {step === "pick" && (
                <section className="rounded-[20px] border border-white/10 bg-white/[0.03] overflow-hidden">
                  <div className="flex items-center justify-between gap-4 px-5 md:px-6 h-14 border-b border-white/10">
                    <h3 className="font-title font-medium text-[17px]">Choose a time</h3>
                    <span className="text-[13px] text-white/50">{DURATION}-minute video call</span>
                  </div>
                  <div className="grid md:grid-cols-[1.15fr_1fr]">
                    {/* Calendar */}
                    <div className="p-5 md:p-6 md:border-r border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-[14px] font-medium">{new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(month)}</p>
                        <div className="flex gap-1.5">
                          {[
                            { dir: -1, ok: canPrev, label: "Previous month", d: "M9 2L4 7l5 5" },
                            { dir: 1, ok: canNext, label: "Next month", d: "M5 2l5 5-5 5" },
                          ].map((b) => (
                            <button
                              key={b.dir}
                              type="button"
                              disabled={!b.ok}
                              aria-label={b.label}
                              onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + b.dir, 1))}
                              className="size-8 rounded-lg border border-white/12 flex items-center justify-center text-white/80 enabled:hover:border-white/30 disabled:opacity-30 transition-colors"
                            >
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden><path d={b.d} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-7 text-center text-[11px] font-medium uppercase tracking-[0.1em] text-white/40 mb-1">
                        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span key={i} className="py-2">{d}</span>)}
                      </div>
                      <div className={clsx("grid grid-cols-7 gap-1 transition-opacity", loading && "opacity-50")}>
                        {Array.from({ length: lead }, (_, i) => <span key={`b${i}`} />)}
                        {Array.from({ length: days }, (_, i) => {
                          const k = `${key}-${pad(i + 1)}`;
                          const has = !!byDay[k]?.length;
                          const sel = day === k;
                          return (
                            <button
                              key={k}
                              type="button"
                              disabled={!has}
                              onClick={() => setDay(k)}
                              aria-pressed={sel}
                              className={clsx(
                                "relative aspect-square max-h-11 w-full rounded-[10px] text-[14px] transition-colors",
                                sel ? "bg-secondary-light text-[#071226] font-semibold" : has ? "text-white font-medium hover:bg-white/10" : "text-white/25",
                              )}
                            >
                              {i + 1}
                              {k === today && !sel && <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 size-1 rounded-full bg-white/40" />}
                            </button>
                          );
                        })}
                      </div>
                      <p className="mt-5 inline-flex items-center gap-2 text-[12px] text-white/45">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden><circle cx="8" cy="8" r="6.5" stroke="currentColor" /><path d="M1.5 8h13M8 1.5c2 2.2 2 10.8 0 13M8 1.5c-2 2.2-2 10.8 0 13" stroke="currentColor" /></svg>
                        {zone.label}
                      </p>
                    </div>
                    {/* Times */}
                    <div className="p-5 md:p-6 border-t md:border-t-0 border-white/10">
                      <p className="text-[14px] font-medium mb-4">{day ? fmtDay(new Date(`${day}T12:00:00`)) : "Pick a day"}</p>
                      {loadError ? (
                        <p className="text-[14px] text-red-300">{loadError}</p>
                      ) : loading && !slots.length ? (
                        <div className="flex flex-col gap-2.5">{[0, 1, 2, 3].map((i) => <span key={i} className="h-11 rounded-[10px] bg-white/[0.05] animate-pulse" />)}</div>
                      ) : day && byDay[day]?.length ? (
                        <ul className="grid grid-cols-2 md:grid-cols-1 gap-2.5 md:max-h-[300px] md:overflow-y-auto md:pr-1 [scrollbar-width:thin]">
                          {byDay[day].map((s) => (
                            <li key={s}>
                              <button
                                type="button"
                                onClick={() => pick(s)}
                                className="w-full h-11 rounded-[10px] border border-white/15 text-[14px] font-medium text-white hover:border-secondary-light hover:bg-secondary-light/10 transition-colors"
                              >
                                {fmtTime(s)}
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-[14px] leading-[22px] text-white/50">
                          {slots.length ? "No free times on this day. Pick another." : canNext ? "No free times left this month. Try the next month." : "No free times right now. Message me on WhatsApp instead."}
                        </p>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {step === "details" && start && end && (
                <section className="rounded-[20px] border border-white/10 bg-white/[0.03] grid md:grid-cols-[1fr_1.15fr] overflow-hidden">
                  <div className="p-5 md:p-6 md:border-r border-b md:border-b-0 border-white/10">
                    <h3 className="font-title font-medium text-[17px]">Free call with Vinod</h3>
                    <p className="mt-1.5 text-[14px] leading-[22px] text-white/55">A conversation about your business and what your website needs to do.</p>
                    <ul className="mt-5 pt-5 border-t border-white/10 flex flex-col gap-3.5 text-[14px] text-white/85">
                      {[
                        { icon: "M2.5 4.5h11v9h-11zM2.5 7h11M5.5 2.5v3M10.5 2.5v3", text: <>{fmtLong(start)}<br /><span className="text-white/55">{fmtTime(start.toISOString())} – {fmtTime(end.toISOString())}</span></> },
                        { icon: "M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM8 4.5V8l2.5 1.5", text: `${DURATION} minutes` },
                        { icon: "M1.5 4.5h9v7h-9zM10.5 7l4-2.5v7l-4-2.5", text: "Google Meet (link in your email)" },
                        { icon: "M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM1.5 8h13", text: zone.label },
                      ].map((r, i) => (
                        <li key={i} className="flex gap-3">
                          <svg className="mt-0.5 shrink-0 text-white/45" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden><path d={r.icon} stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          <span>{r.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <form onSubmit={submit} className="p-5 md:p-6 flex flex-col gap-4">
                    <h3 className="font-title font-medium text-[17px]">Your details</h3>
                    <label className="flex flex-col gap-1.5 text-[13px] text-white/70">
                      <span>Full name<span className="text-secondary-light">*</span></span>
                      <input required autoComplete="name" className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </label>
                    <label className="flex flex-col gap-1.5 text-[13px] text-white/70">
                      <span>Email address<span className="text-secondary-light">*</span></span>
                      <input required type="email" autoComplete="email" className={field} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </label>
                    <label className="flex flex-col gap-1.5 text-[13px] text-white/70">
                      <span>Phone or WhatsApp <span className="text-white/40">(optional)</span></span>
                      <input type="tel" autoComplete="tel" className={field} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </label>
                    {showNotes ? (
                      <label className="flex flex-col gap-1.5 text-[13px] text-white/70">
                        <span>What would you like to talk about?</span>
                        <textarea rows={3} className={clsx(field, "h-auto py-3 resize-none")} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                      </label>
                    ) : (
                      <button type="button" onClick={() => setShowNotes(true)} className="self-start text-[13px] text-white/60 hover:text-white transition-colors">+ Add notes</button>
                    )}
                    <input tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                    {error && <p role="alert" className="text-[14px] text-red-300">{error}</p>}
                    <button
                      type="submit"
                      disabled={sending}
                      className="mt-1 h-12 rounded-full bg-primary-light text-white text-[15px] font-semibold hover:bg-[#2a8dff] disabled:opacity-60 transition-colors"
                    >
                      {sending ? "Booking…" : "Confirm booking"}
                    </button>
                    <button type="button" onClick={() => setStep("pick")} className="text-[13px] text-white/55 hover:text-white transition-colors">
                      Choose another time
                    </button>
                  </form>
                </section>
              )}

              {step === "done" && start && end && (
                <section className="flex flex-col items-center text-center py-10 md:py-12 max-w-[520px] mx-auto">
                  <span className="size-16 rounded-full bg-secondary-light/15 border border-secondary-light/40 flex items-center justify-center animate-[booking-in_0.5s_cubic-bezier(0.22,1,0.36,1)]">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M5 12.5l4.5 4.5L19 7.5" stroke="#6fb2ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                  <h2 id="booking-title" className="mt-6 font-title font-medium text-[32px] leading-[38px] md:text-[40px] md:leading-[46px] tracking-[-0.02em]">
                    You&apos;re <span className="italic text-secondary-light">booked.</span>
                  </h2>
                  <p className="mt-4 text-[16px] leading-[26px] text-white/75">
                    {fmtLong(start)}, {fmtTime(start.toISOString())} – {fmtTime(end.toISOString())}
                  </p>
                  <p className="mt-2 text-[15px] leading-[24px] text-white/55">
                    A confirmation with the Google Meet link is on its way to <span className="text-white">{form.email}</span>.
                  </p>
                  <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {meetUrl && (
                      <a href={meetUrl} target="_blank" rel="noopener noreferrer" className="h-12 px-6 rounded-full bg-primary-light text-white text-[15px] font-semibold inline-flex items-center justify-center hover:bg-[#2a8dff] transition-colors">
                        Open Google Meet
                      </a>
                    )}
                    <button type="button" onClick={close} className="h-12 px-6 rounded-full border border-white/20 text-[15px] font-semibold hover:border-white/40 transition-colors">
                      Done
                    </button>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
