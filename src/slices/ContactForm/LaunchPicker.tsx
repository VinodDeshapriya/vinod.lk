"use client";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type Value = { y: number; m: number } | "asap" | "flexible" | null;

const label = (v: Value) =>
  v === "asap"
    ? "As soon as possible"
    : v === "flexible"
      ? "I'm flexible"
      : v
        ? `${LONG[v.m]} ${v.y}`
        : "";

/**
 * "Ideal launch date": a month picker in a popover (the native month input
 * shows "--------- ----" and a different picker in every browser).
 * Posts the readable value, e.g. "March 2027", under `name`.
 */
export default function LaunchPicker({
  name,
  inputClass,
}: {
  name: string;
  inputClass: string;
}) {
  const now = new Date();
  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<Value>(null);
  const [year, setYear] = useState(thisYear);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) =>
      !box.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (v: Value) => {
    setValue(v);
    setOpen(false);
  };
  const text = label(value);

  return (
    <div ref={box} className="relative">
      <input type="hidden" name={name} value={text} />
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={clsx(
          inputClass,
          "flex items-center gap-3 text-left cursor-pointer",
          open && "border-primary-light ring-3 ring-primary-light/15",
        )}
      >
        <svg
          aria-hidden
          className="shrink-0 text-text-description"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
        >
          <rect
            x="2.25"
            y="3.5"
            width="13.5"
            height="12"
            rx="2.5"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path
            d="M2.25 7.25h13.5M6 1.75v3M12 1.75v3"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
        <span
          className={clsx("grow truncate", !text && "text-text-placeholder")}
        >
          {text || "Choose a month"}
        </span>
        {text ? (
          <span
            role="button"
            tabIndex={0}
            aria-label="Clear launch date"
            onClick={(e) => {
              e.stopPropagation();
              setValue(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                setValue(null);
              }
            }}
            className="shrink-0 size-6 -mr-1 rounded-full flex items-center justify-center text-text-description hover:bg-offwhite-2 hover:text-text-heading"
          >
            <svg
              aria-hidden
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
            >
              <path
                d="M1.5 1.5l7 7M8.5 1.5l-7 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        ) : (
          <svg
            aria-hidden
            className={clsx(
              "shrink-0 text-text-description transition-transform",
              open && "rotate-180",
            )}
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
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Choose a launch month"
          className="absolute z-30 right-0 mt-2 w-full sm:w-[320px] max-w-[calc(100vw-2rem)] rounded-[16px] border border-border-primary bg-white p-4 shadow-[0_24px_48px_-12px_rgba(10,18,33,0.18)] animate-[booking-in_0.25s_cubic-bezier(0.22,1,0.36,1)]"
        >
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              aria-label="Previous year"
              disabled={year <= thisYear}
              onClick={() => setYear((y) => y - 1)}
              className="size-8 rounded-full flex items-center justify-center text-text-heading enabled:hover:bg-offwhite-2 disabled:opacity-25"
            >
              <svg
                aria-hidden
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M9 2.5L4.5 7 9 11.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <span className="font-title font-medium text-[16px] text-text-heading">
              {year}
            </span>
            <button
              type="button"
              aria-label="Next year"
              disabled={year >= thisYear + 2}
              onClick={() => setYear((y) => y + 1)}
              className="size-8 rounded-full flex items-center justify-center text-text-heading enabled:hover:bg-offwhite-2 disabled:opacity-25"
            >
              <svg
                aria-hidden
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M5 2.5L9.5 7 5 11.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {MONTHS.map((m, i) => {
              const past = year === thisYear && i < thisMonth;
              const selected =
                typeof value === "object" && value?.y === year && value.m === i;
              const current = year === thisYear && i === thisMonth;
              return (
                <button
                  key={m}
                  type="button"
                  disabled={past}
                  aria-pressed={selected}
                  onClick={() => pick({ y: year, m: i })}
                  className={clsx(
                    "h-10 rounded-[10px] text-[14px] transition-colors",
                    selected
                      ? "bg-primary-light text-white font-medium"
                      : past
                        ? "text-text-inactive/50"
                        : clsx(
                            "text-text-heading hover:bg-info-bg",
                            current &&
                              "ring-1 ring-inset ring-primary-light/40",
                          ),
                  )}
                >
                  {m}
                </button>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-border-secondary flex flex-wrap gap-1.5">
            {(["asap", "flexible"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => pick(v)}
                className={clsx(
                  "flex-auto min-h-9 px-4 py-2 rounded-full text-[13px] leading-tight whitespace-nowrap transition-colors",
                  value === v
                    ? "bg-primary-light text-white"
                    : "bg-offwhite-2 text-text-heading hover:bg-info-bg",
                )}
              >
                {label(v)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
