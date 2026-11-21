"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { THEME_KEY } from "./themeScript";

type Mode = "light" | "dark";

const systemMode = (): Mode =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

function apply(mode: Mode, animate: boolean) {
  const root = document.documentElement;
  if (animate) {
    root.classList.add("theme-switching");
    window.setTimeout(() => root.classList.remove("theme-switching"), 400);
  }
  root.classList.toggle("dark", mode === "dark");
  root.classList.toggle("light", mode === "light");
  root.style.colorScheme = mode;
}

/**
 * Light / dark switch for the header. Follows the system theme by default; a click
 * saves the visitor's choice. Choosing the same mode as the system clears the saved
 * choice, so the site goes back to following the system.
 */
export default function ThemeToggle({
  className,
  size = "md",
}: {
  className?: string;
  size?: "md" | "lg";
}) {
  const [mode, setMode] = useState<Mode | null>(null);

  useEffect(() => {
    queueMicrotask(() =>
      setMode(
        document.documentElement.classList.contains("dark") ? "dark" : "light",
      ),
    );
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystem = () => {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem(THEME_KEY);
      } catch {}
      if (saved) return; // visitor picked a mode; keep it
      const next = systemMode();
      apply(next, true);
      setMode(next);
    };
    mq.addEventListener("change", onSystem);
    return () => mq.removeEventListener("change", onSystem);
  }, []);

  const toggle = () => {
    const next: Mode = mode === "dark" ? "light" : "dark";
    try {
      if (next === systemMode()) localStorage.removeItem(THEME_KEY);
      else localStorage.setItem(THEME_KEY, next);
    } catch {}
    apply(next, true);
    setMode(next);
  };

  const dark = mode === "dark";
  const big = size === "lg";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Dark mode"
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggle}
      className={clsx(
        "group relative shrink-0 inline-flex items-center rounded-full p-1 border transition-colors",
        "border-border-primary bg-offwhite-2 hover:border-primary-light/60 dark:bg-[#171f2e] dark:border-[#3a4660]",
        big ? "h-10 w-[76px]" : "h-9 w-[68px]",
        className,
      )}
    >
      {/* Track icons */}
      <span
        aria-hidden
        className="absolute inset-0 flex items-center justify-between px-2.5 text-text-inactive dark:text-[#8b96ab]"
      >
        <Sun className={big ? "size-4" : "size-[15px]"} />
        <Moon className={big ? "size-4" : "size-[15px]"} />
      </span>
      {/* Knob */}
      <span
        aria-hidden
        className={clsx(
          "relative grid place-items-center rounded-full shadow-[0_2px_6px_rgba(10,18,33,0.25)] transition-[transform,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          big ? "size-8" : "size-7",
          mode === null && "opacity-0",
          dark
            ? clsx(
                "bg-[#2a3c63] text-[#d6e8ff] shadow-[0_0_10px_rgba(77,163,255,0.45)]",
                big ? "translate-x-[36px]" : "translate-x-[32px]",
              )
            : "translate-x-0 bg-white text-[#f5a524]",
        )}
      >
        {dark ? <Moon className="size-4" /> : <Sun className="size-4" />}
      </span>
    </button>
  );
}

function Sun({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
    >
      <circle cx="12" cy="12" r="4.2" fill="currentColor" stroke="none" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </svg>
  );
}

function Moon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a.6.6 0 0 0-.8-.7A9.5 9.5 0 1 0 21.2 15.4a.6.6 0 0 0-.7-.8Z" />
    </svg>
  );
}
