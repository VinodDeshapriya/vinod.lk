"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Whatsapp from "atd-icons/dist/Whatsapp";
import ChatbubbleEllipsesFill from "atd-icons/dist/ChatbubbleEllipsesFill";
import Close from "atd-icons/dist/Close";
import Send from "atd-icons/dist/Send";

type Msg = { role: "user" | "assistant"; content: string };

const QUICK_REPLIES = [
  "How much does a website cost?",
  "How long does a website take?",
  "What services do you offer?",
  "Can I see your work?",
];

const GREETING =
  "Hi there 👋 I'm Vinod's assistant. Ask me anything about his services, prices or process, and I'll answer right here.";

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

/** Renders **bold**, site paths (/contact) and full URLs in a reply as formatting and links. */
function RichReply({ text }: { text: string }) {
  const parts = text.split(
    /(\*\*[^*]+\*\*|https?:\/\/[^\s)]+|(?<![\w.])\/[a-z0-9][a-z0-9/-]*)/gi,
  );
  return (
    <>
      {parts.map((p, i) => {
        if (!p) return null;
        if (p.startsWith("**") && p.endsWith("**"))
          return <strong key={i}>{p.slice(2, -2)}</strong>;
        if (/^https?:\/\//.test(p))
          return (
            <a
              key={i}
              href={p}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-primary-light break-all"
            >
              {p.replace(/^https?:\/\/(www\.)?/, "")}
            </a>
          );
        if (/^\/[a-z0-9]/i.test(p))
          return (
            <Link key={i} href={p} className="underline text-primary-light">
              {p}
            </Link>
          );
        return <Fragment key={i}>{p}</Fragment>;
      })}
    </>
  );
}

/** Sticky "Live chat" pill (bottom right): WhatsApp shortcut plus an AI chat that answers from the site's content. */
export default function LiveChat({
  whatsapp = "94775037738",
}: {
  whatsapp?: string;
}) {
  const [open, setOpen] = useState(false);
  const [online, setOnline] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const tick = () => setOnline(isOnline());
    queueMicrotask(tick);
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, busy]);

  const lastQuestion = [...messages]
    .reverse()
    .find((m) => m.role === "user")?.content;

  async function ask(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    const history: Msg[] = [...messages, { role: "user", content: q }];
    setMessages(history);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) {
        const reason = res.status === 429 ? "rate" : "down";
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content:
              reason === "rate"
                ? "You've sent a lot of messages in a short time. Please message Vinod on WhatsApp and he'll reply personally."
                : "Sorry, I can't answer right now. Please message Vinod on WhatsApp, or send your details through /contact.",
          },
        ]);
        return;
      }
      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = m.slice();
          const last = copy[copy.length - 1];
          copy[copy.length - 1] = { ...last, content: last.content + chunk };
          return copy;
        });
      }
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Sorry, something went wrong. Please message Vinod on WhatsApp.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  const waText = lastQuestion
    ? `Hi Vinod! ${lastQuestion}`
    : "Hi Vinod! I found you on vinod.lk.";

  return (
    <div
      ref={rootRef}
      className="fixed z-[90] right-4 bottom-4 sm:right-6 sm:bottom-6 flex flex-col items-end gap-3"
    >
      {open && (
        <div
          role="dialog"
          aria-label="Chat with Vinod's assistant"
          className="flex flex-col w-[min(360px,calc(100vw-2rem))] h-[min(560px,calc(100dvh-7rem))] overflow-hidden rounded-[20px] bg-white border border-border-primary shadow-[0_24px_64px_-12px_rgba(10,18,33,0.28)] animate-[booking-in_0.25s_cubic-bezier(0.22,1,0.36,1)] origin-bottom-right"
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
              <p className="text-body-base-bold">Vinod&apos;s assistant</p>
              <p className="text-[13px] leading-5 text-white/70">
                Instant answers ·{" "}
                {online
                  ? "Vinod is online"
                  : "Vinod replies within a working day"}
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

          <div
            ref={listRef}
            data-lenis-prevent
            aria-live="polite"
            className="flex-1 overflow-y-auto overscroll-contain flex flex-col gap-3 p-4 bg-offwhite-2"
          >
            <p className="self-start max-w-[88%] px-4 py-3 rounded-[16px] rounded-tl-[4px] bg-white border border-border-secondary text-body-small text-text-heading">
              {GREETING}
            </p>
            {messages.length === 0 && (
              <div className="flex flex-wrap justify-end gap-2">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => ask(q)}
                    className="px-3.5 py-2 rounded-full border border-primary-light/40 bg-white text-[13px] leading-5 text-primary-light hover:bg-primary-light hover:text-white transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            {messages.map((m, i) =>
              m.role === "user" ? (
                <p
                  key={i}
                  className="self-end max-w-[85%] px-4 py-2.5 rounded-[16px] rounded-tr-[4px] bg-primary-light text-white text-body-small whitespace-pre-wrap break-words"
                >
                  {m.content}
                </p>
              ) : m.content ? (
                <p
                  key={i}
                  className="self-start max-w-[88%] px-4 py-3 rounded-[16px] rounded-tl-[4px] bg-white border border-border-secondary text-body-small text-text-heading whitespace-pre-wrap break-words"
                >
                  <RichReply text={m.content} />
                </p>
              ) : null,
            )}
            {busy && messages.at(-1)?.role !== "assistant" && (
              <span
                className="self-start flex gap-1 px-4 py-3.5 rounded-[16px] rounded-tl-[4px] bg-white border border-border-secondary"
                aria-label="Typing"
              >
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="size-1.5 rounded-full bg-text-inactive animate-bounce"
                    style={{ animationDelay: `${d * 120}ms` }}
                  />
                ))}
              </span>
            )}
          </div>

          <a
            href={waLink(whatsapp, waText)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2.5 border-t border-border-secondary text-[13px] leading-5 font-medium text-[#128C7E] hover:bg-[#25D366]/10 transition-colors"
          >
            <Whatsapp size={16} />
            Talk to Vinod on WhatsApp
          </a>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="flex items-center gap-2 p-3 border-t border-border-secondary"
          >
            <label htmlFor="live-chat-message" className="sr-only">
              Your message
            </label>
            <input
              id="live-chat-message"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={1000}
              placeholder="Ask a question…"
              className="flex-1 min-w-0 h-10 px-4 rounded-full bg-offwhite-2 text-[16px] sm:text-body-small text-text-heading placeholder:text-text-inactive outline-none focus:ring-2 focus:ring-primary-light/30"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send"
              className="grid place-items-center size-10 shrink-0 rounded-full bg-primary-light text-white disabled:opacity-40 hover:brightness-110 transition"
            >
              <Send size={18} />
            </button>
          </form>
          <p className="pb-2.5 text-center text-[11px] leading-4 text-text-inactive">
            AI answers from vinod.lk. Vinod reads every enquiry himself.
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
