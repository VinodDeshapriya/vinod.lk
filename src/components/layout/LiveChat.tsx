"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Whatsapp from "atd-icons/dist/Whatsapp";
import ChatbubbleEllipsesFill from "atd-icons/dist/ChatbubbleEllipsesFill";
import Close from "atd-icons/dist/Close";
import Send from "atd-icons/dist/Send";

const QUICK_REPLIES = [
  "I need a new website",
  "I want to redesign my site",
  "Can I get a quote?",
  "Something else",
];

/** Mon–Sat, 09:00–18:00 in Sri Lanka (same hours as the booking calendar). */
function isOnline(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Colombo",
    weekday: "short",
    hour: "numeric",
    hour12: false,
  }).formatToParts(date);
  const day = parts.find((p) => p.type === "weekday")?.value;
  const hour = Number(parts.find((p) => p.type === "hour")?.value);
  return day !== "Sun" && hour >= 9 && hour < 18;
}

const waLink = (number: string, text: string) =>
  `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

/** Sticky "Live chat" pill (bottom right): WhatsApp shortcut plus a small chat panel with quick replies. */
export default function LiveChat({
  whatsapp = "94775037738",
}: {
  whatsapp?: string;
}) {
  const [open, setOpen] = useState(false);
  const [online, setOnline] = useState(false);
  const [message, setMessage] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tick = () => setOnline(isOnline());
    queueMicrotask(tick);
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (!panelRef.current?.parentElement?.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const send = (text: string) => {
    window.open(
      waLink(whatsapp, text || "Hi Vinod!"),
      "_blank",
      "noopener,noreferrer",
    );
    setMessage("");
    setOpen(false);
  };

  return (
    <div className="fixed z-[90] right-4 bottom-4 sm:right-6 sm:bottom-6 flex flex-col items-end gap-3">
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Chat with Vinod"
          data-lenis-prevent
          className="w-[min(340px,calc(100vw-2rem))] overflow-hidden rounded-[20px] bg-white border border-border-primary shadow-[0_24px_64px_-12px_rgba(10,18,33,0.28)] animate-[booking-in_0.25s_cubic-bezier(0.22,1,0.36,1)] origin-bottom-right"
        >
          <div className="flex items-center gap-3 p-4 text-white bg-[linear-gradient(140deg,#080d1a_0%,#0a1733_55%,#0f4da8_100%)]">
            <span className="relative shrink-0">
              <Image
                src="/images/pages/photos/about-portrait.jpg"
                alt="Vinod Deshapriya"
                width={44}
                height={44}
                className="size-11 rounded-full object-cover object-top"
              />
              <span
                className={`absolute -right-0.5 -bottom-0.5 size-3 rounded-full ring-2 ring-[#0a1733] ${online ? "bg-[#25D366]" : "bg-white/40"}`}
              />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-body-base-bold">Vinod Deshapriya</p>
              <p className="text-[13px] leading-5 text-white/70">
                {online
                  ? "Online now · usually replies in minutes"
                  : "Away · I'll reply within one working day"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="grid place-items-center size-8 rounded-full hover:bg-white/10 transition-colors"
            >
              <Close size={18} />
            </button>
          </div>

          <div className="flex flex-col gap-3 p-4 bg-offwhite-2">
            <p className="self-start max-w-[85%] px-4 py-3 rounded-[16px] rounded-tl-[4px] bg-white border border-border-secondary text-body-small text-text-heading">
              Hi there 👋 I&apos;m Vinod. How can I help with your website
              today?
            </p>
            <div className="flex flex-wrap justify-end gap-2">
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => send(q)}
                  className="px-3.5 py-2 rounded-full border border-primary-light/40 bg-white text-[13px] leading-5 text-primary-light hover:bg-primary-light hover:text-white transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(message.trim());
            }}
            className="flex items-center gap-2 p-3 border-t border-border-secondary"
          >
            <label htmlFor="live-chat-message" className="sr-only">
              Your message
            </label>
            <input
              id="live-chat-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message…"
              className="flex-1 min-w-0 h-10 px-4 rounded-full bg-offwhite-2 text-body-small text-text-heading placeholder:text-text-inactive outline-none focus:ring-2 focus:ring-primary-light/30"
            />
            <button
              type="submit"
              aria-label="Send on WhatsApp"
              className="grid place-items-center size-10 shrink-0 rounded-full bg-[#25D366] text-white hover:brightness-95 transition"
            >
              <Send size={18} />
            </button>
          </form>
          <p className="pb-3 text-center text-[11px] leading-4 text-text-inactive">
            Opens WhatsApp to continue the chat
          </p>
        </div>
      )}

      <div className="flex items-center gap-1.5 p-1.5 pl-4 rounded-full bg-[#0a1221]/90 backdrop-blur-md border border-white/10 shadow-[0_12px_32px_-8px_rgba(10,18,33,0.45)]">
        <span className="flex items-center gap-2 pr-1 text-[14px] leading-5 text-white">
          <span className="relative flex size-2">
            {online && (
              <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-60" />
            )}
            <span
              className={`relative size-2 rounded-full ${online ? "bg-[#25D366]" : "bg-white/60"}`}
            />
          </span>
          Live chat
        </span>
        <a
          href={waLink(whatsapp, "Hi Vinod! I found you on vinod.lk.")}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="grid place-items-center size-10 rounded-full bg-white/10 text-white hover:bg-[#25D366] transition-colors"
        >
          <Whatsapp size={20} />
        </a>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? "Close chat" : "Open chat"}
          className="grid place-items-center size-10 rounded-full bg-white text-[#0a1221] hover:scale-105 transition-transform"
        >
          {open ? <Close size={20} /> : <ChatbubbleEllipsesFill size={20} />}
        </button>
      </div>
    </div>
  );
}
