"use client";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import type { LinkField } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { sendEnquiry } from "@/lib/contact/submit";

type Status = {
  state: "idle" | "sending" | "sent" | "error";
  message?: string;
  /** Who sent it, for the thank-you note. */
  name?: string;
  email?: string;
};

const WHATSAPP = "94775037738";

const NEXT_STEPS = [
  { title: "I read your project", when: "Today, or the next working day" },
  {
    title: "You get a clear reply",
    when: "Questions or a quote, within one working day",
  },
  {
    title: "A short call, if it helps",
    when: "Only if there's something to talk through",
  },
];

const inputClass =
  "w-full h-[50px] px-4 rounded-[12px] border border-border-primary bg-surface text-body-small text-text-heading placeholder:text-text-placeholder focus:outline-none focus:border-primary-light focus:ring-3 focus:ring-primary-light/15";

function Label({
  children,
  required,
  optional,
}: {
  children: React.ReactNode;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <span className="text-body-small font-medium text-text-heading">
      {children}
      {required && <span className="text-primary-light">*</span>}
      {optional && (
        <span className="font-normal text-text-inactive"> (optional)</span>
      )}
    </span>
  );
}

function Choices({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {options.map((o, i) => {
        const odd = options.length % 2 === 1 && i === options.length - 1;
        return (
          <label
            key={o}
            className={clsx(
              "relative cursor-pointer h-12 px-3 rounded-full flex items-center justify-center text-center text-[15px] transition-colors",
              odd && "col-span-2",
              value === o
                ? "bg-primary-light text-white"
                : "bg-offwhite-2 text-text-heading hover:bg-info-bg",
            )}
          >
            <input
              type="radio"
              name={name}
              value={o}
              checked={value === o}
              onChange={() => onChange(o)}
              className="sr-only"
            />
            {o}
          </label>
        );
      })}
    </div>
  );
}

/** Client form for the ContactForm slice. Sends through sendEnquiry (Resend + Netlify Forms). */
export default function ProjectForm({
  services,
  budgets,
  submitLabel,
  successMessage,
  privacyLink,
}: {
  services: string[];
  budgets: string[];
  submitLabel: string;
  successMessage: string;
  privacyLink: LinkField;
}) {
  const [service, setService] = useState("");
  const [budget, setBudget] = useState("");
  const [status, setStatus] = useState<Status>({ state: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus({ state: "sending" });
    const payload = { ...data, service, budget } as Record<string, string>;
    try {
      await sendEnquiry(payload);
      form.reset();
      setStatus({
        state: "sent",
        name: String(data.name ?? "")
          .trim()
          .split(/\s+/)[0],
        email: String(data.email ?? ""),
      });
    } catch (err) {
      setStatus({ state: "error", message: (err as Error).message });
    }
  }

  if (status.state === "sent") {
    return (
      <ThankYou
        name={status.name}
        email={status.email}
        // The heading already says thanks, so drop a leading "Thanks!" from the Prismic text.
        message={successMessage.replace(/^\s*thank(s| you)[^.!]*[.!]\s*/i, "")}
        onReset={() => {
          setService("");
          setBudget("");
          setStatus({ state: "idle" });
        }}
      />
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full lg:w-[560px] shrink-0 flex flex-col gap-5 p-6 sm:p-10 rounded-[24px] bg-surface border border-border-primary shadow-[0_16px_48px_0_rgba(10,18,33,0.06)]"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-2">
          <Label required>Name</Label>
          <input
            name="name"
            required
            autoComplete="name"
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-2">
          <Label required>Email</Label>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-2 sm:col-span-2">
          <Label optional>Phone or WhatsApp</Label>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            className={inputClass}
          />
        </label>
      </div>
      {services.length > 0 && (
        <label className="flex flex-col gap-2">
          <Label required>What do you need?</Label>
          <span className="relative">
            <select
              name="service"
              required
              value={service}
              onChange={(e) => setService(e.target.value)}
              className={clsx(
                inputClass,
                "appearance-none pr-11 cursor-pointer",
                !service && "text-text-placeholder",
              )}
            >
              <option value="" disabled>
                Choose a service
              </option>
              {services.map((o) => (
                <option key={o} value={o} className="text-text-heading">
                  {o}
                </option>
              ))}
            </select>
            <svg
              aria-hidden
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-description"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M3 5.25L7 9.25L11 5.25"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </label>
      )}
      {budgets.length > 0 && (
        <fieldset className="flex flex-col gap-2.5">
          <legend className="mb-2.5">
            <Label optional>Budget</Label>
          </legend>
          <Choices
            name="budget"
            options={budgets}
            value={budget}
            onChange={setBudget}
          />
        </fieldset>
      )}
      <label className="flex flex-col gap-2">
        <Label required>What are you trying to achieve?</Label>
        <textarea
          name="message"
          required
          rows={4}
          placeholder="A few lines about your business and your goals"
          className={clsx(inputClass, "h-auto py-3")}
        />
      </label>
      {/* Honeypot for bots */}
      <input
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />
      <label className="flex items-start gap-2.5 text-[13px] leading-5 text-text-description">
        <input
          name="consent"
          type="checkbox"
          required
          className="mt-0.5 size-4 accent-primary-light"
        />
        <span>
          Your details are only used to reply to you. I agree to the{" "}
          <PrismicNextLink
            field={privacyLink}
            className="text-primary-light underline"
          >
            {privacyLink.text || "privacy policy"}
          </PrismicNextLink>
          .<span className="text-primary-light">*</span>
        </span>
      </label>
      {status.state === "error" && (
        <p role="alert" className="text-body-small text-error-primary">
          {status.message}
        </p>
      )}
      <button
        type="submit"
        disabled={status.state === "sending"}
        className="h-[50px] rounded-full bg-primary-light text-white text-body-base-bold hover:bg-button-primary-hover hover:text-button-primary-text-hover disabled:opacity-60 transition-colors"
      >
        {status.state === "sending" ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}

/** Shown in place of the form once an enquiry has gone through. */
function ThankYou({
  name,
  email,
  message,
  onReset,
}: {
  name?: string;
  email?: string;
  message: string;
  onReset: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // The note is shorter than the form, so bring it into view (mostly for phones).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    if (top < 80 || top > window.innerHeight * 0.6) {
      const y = window.scrollY + top - 120;
      if (window.__lenis) window.__lenis.scrollTo(y);
      else window.scrollTo({ top: y, behavior: "smooth" });
    }
    el.focus({ preventScroll: true });
  }, []);
  const wa = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    `Hi Vinod, I just sent a project enquiry on vinod.lk${name ? ` (${name})` : ""}.`,
  )}`;

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="status"
      aria-live="polite"
      className="relative w-full lg:w-[560px] shrink-0 self-start overflow-hidden p-6 sm:p-10 rounded-[24px] bg-surface border border-border-primary shadow-[0_16px_48px_0_rgba(10,18,33,0.06)] outline-none animate-[booking-in_0.5s_cubic-bezier(0.22,1,0.36,1)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-primary-light/10 blur-3xl"
      />
      <span className="relative flex size-14 items-center justify-center rounded-full bg-info-bg border border-primary-light/30">
        <span className="absolute inset-0 rounded-full bg-primary-light/20 animate-ping [animation-iteration-count:2] motion-reduce:hidden" />
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M5 12.5l4.5 4.5L19 7.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary-light"
          />
        </svg>
      </span>

      <p className="relative mt-6 text-body-small font-medium text-primary-light">
        Message sent
      </p>
      <h3 className="relative mt-2 font-title font-medium text-[30px] leading-[36px] sm:text-[36px] sm:leading-[42px] tracking-[-0.02em] text-text-heading">
        Thanks{name ? `, ${name}` : ""}.{" "}
        <span className="italic text-primary-light">Got it.</span>
      </h3>
      <p className="relative mt-3 text-body-small text-text-description">
        {message}
        {email && (
          <>
            {" "}
            A copy of your message is on its way to{" "}
            <span className="font-medium text-text-heading [overflow-wrap:break-word]">
              {email}
            </span>
            .
          </>
        )}
      </p>

      <div className="relative mt-8 pt-6 border-t border-border-primary">
        <p className="text-body-small font-medium text-text-heading">
          What happens next
        </p>
        <ol className="mt-4 flex flex-col">
          {NEXT_STEPS.map((step, i) => (
            <li key={step.title} className="relative flex gap-4 pb-5 last:pb-0">
              {i < NEXT_STEPS.length - 1 && (
                <span
                  aria-hidden
                  className="absolute left-[13px] top-8 bottom-1 w-px bg-border-primary"
                />
              )}
              <span className="relative z-[1] flex size-7 shrink-0 items-center justify-center rounded-full bg-offwhite-2 border border-border-primary text-[13px] font-semibold text-text-heading">
                {i + 1}
              </span>
              <span className="pt-0.5">
                <span className="block text-[15px] leading-[22px] font-medium text-text-heading">
                  {step.title}
                </span>
                <span className="block text-[13px] leading-5 text-text-description">
                  {step.when}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="relative mt-8 flex flex-col sm:flex-row gap-3">
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 h-[50px] px-5 rounded-full bg-primary-light text-white text-body-base-bold inline-flex items-center justify-center gap-2 hover:bg-button-primary-hover hover:text-button-primary-text-hover transition-colors"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 004.74 1.21c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.8 14.13c-.24.68-1.42 1.3-1.95 1.35-.5.05-.97.23-3.27-.68-2.77-1.09-4.53-3.92-4.67-4.1-.13-.18-1.11-1.48-1.11-2.82 0-1.34.7-2 .95-2.28.25-.27.54-.34.72-.34l.52.01c.17.01.39-.06.61.47.24.55.79 1.9.86 2.04.07.14.11.3.02.48-.09.18-.14.3-.27.46l-.41.48c-.14.14-.28.28-.12.56.16.27.71 1.17 1.52 1.9 1.05.93 1.93 1.22 2.21 1.36.27.14.43.11.59-.07.16-.18.68-.79.86-1.06.18-.27.36-.23.61-.14.25.09 1.59.75 1.86.89.27.14.45.2.52.32.07.11.07.66-.17 1.33z" />
          </svg>
          Chat on WhatsApp
        </a>
        <Link
          href="/work"
          className="flex-1 h-[50px] px-5 rounded-full border border-border-primary text-body-base-bold text-text-heading inline-flex items-center justify-center hover:border-primary-light hover:text-primary-light transition-colors"
        >
          See recent work
        </Link>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="relative mt-5 w-full text-center text-[13px] text-text-description hover:text-primary-light transition-colors"
      >
        Need to add something? Send another message
      </button>
    </div>
  );
}
