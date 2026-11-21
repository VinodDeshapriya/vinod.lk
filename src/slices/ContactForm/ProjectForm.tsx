"use client";
import { useState } from "react";
import clsx from "clsx";
import type { LinkField } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";

type Status = {
  state: "idle" | "sending" | "sent" | "error";
  message?: string;
};

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

/** Client form for the ContactForm slice. Posts to /api/contact. */
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
    // Two routes at once: Resend emails (/api/contact) and a Netlify Forms copy.
    // The enquiry counts as sent if either one gets through.
    const viaEmail = fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(async (res) => ({
      ok: res.ok,
      error: ((await res.json().catch(() => ({}))) as { error?: string }).error,
    }));
    const viaNetlify = fetch("/__forms.html", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        "form-name": "project-enquiry",
        ...payload,
      }).toString(),
    })
      .then((res) => res.ok)
      .catch(() => false);
    try {
      const [email, stored] = await Promise.all([
        viaEmail.catch(() => ({ ok: false, error: undefined })),
        viaNetlify,
      ]);
      if (!email.ok && !stored)
        throw new Error(
          email.error ||
            "Something went wrong. Please try WhatsApp or email instead.",
        );
      form.reset();
      setStatus({ state: "sent" });
    } catch (err) {
      setStatus({ state: "error", message: (err as Error).message });
    }
  }

  if (status.state === "sent") {
    return (
      <div
        role="status"
        className="w-full lg:w-[560px] self-start p-10 rounded-[24px] bg-surface border border-border-primary text-center text-body-base text-text-heading"
      >
        {successMessage}
      </div>
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
