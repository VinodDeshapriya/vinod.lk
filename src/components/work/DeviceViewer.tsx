"use client";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import ArrowUpRight from "@/components/ui/ArrowUpRight";
import type { Shot } from "@/data/caseStudies";
import { BrowserFrame, PhoneFrame, ShotImage } from "./Frames";

/**
 * "The work": a Desktop / Mobile switch over a browser window (or phones)
 * that scroll inside, so visitors can look through the site's key screens.
 */
export default function DeviceViewer({
  name,
  url,
  desktop,
  mobile,
}: {
  name: string;
  url?: string;
  desktop: Shot[];
  mobile: Shot[];
}) {
  const [mode, setMode] = useState<"desktop" | "mobile">("desktop");
  // Only offer scrolling (and say so) when a screenshot is taller than its frame.
  const stage = useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = useState(false);

  useEffect(() => {
    const root = stage.current;
    if (!root) return;
    const check = () =>
      setScrollable(
        [...root.querySelectorAll<HTMLElement>("[data-scroller]")].some(
          (el) => el.scrollHeight > el.clientHeight + 24,
        ),
      );
    const ro = new ResizeObserver(check);
    root
      .querySelectorAll("[data-scroller], [data-scroller] img")
      .forEach((el) => ro.observe(el));
    check();
    return () => ro.disconnect();
  }, [mode]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label="Device"
          className="inline-flex p-1 rounded-full bg-surface border border-border-primary"
        >
          {(["desktop", "mobile"] as const).map((m) => (
            <button
              key={m}
              role="tab"
              type="button"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={clsx(
                "h-9 px-5 rounded-full text-body-small font-medium capitalize transition-colors",
                mode === m
                  ? "bg-text-heading text-surface"
                  : "text-text-description hover:text-text-heading",
              )}
            >
              {m}
            </button>
          ))}
        </div>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 h-10 px-4 rounded-full border border-border-primary bg-surface text-body-small font-medium text-text-heading hover:border-primary-light hover:text-primary-light transition-colors"
          >
            Visit live site
            <ArrowUpRight size={14} />
          </a>
        )}
      </div>

      <div ref={stage}>
        {mode === "desktop" ? (
          <BrowserFrame url={url ?? `${name} (design)`}>
            <div
              data-scroller
              data-lenis-prevent
              tabIndex={0}
              aria-label={`${name} desktop screens, scrollable`}
              className="h-[min(640px,62vw)] min-h-[300px] overflow-y-auto overscroll-contain [scrollbar-width:thin]"
            >
              {desktop.map((s) => (
                <ShotImage
                  key={s.src}
                  shot={s}
                  sizes="(min-width: 1280px) 1280px, 100vw"
                />
              ))}
            </div>
          </BrowserFrame>
        ) : (
          <div className="flex justify-center gap-6 md:gap-10 py-4 rounded-[24px] bg-offwhite-2 border border-border-secondary">
            {mobile.map((s, i) => (
              <PhoneFrame
                key={s.src}
                className={clsx(
                  "relative w-[260px] md:w-[300px]",
                  i > 0 && "hidden sm:block",
                )}
              >
                <div
                  data-scroller
                  data-lenis-prevent={scrollable || undefined}
                  tabIndex={scrollable ? 0 : undefined}
                  aria-label={scrollable ? `${s.alt}, scrollable` : s.alt}
                  className="max-h-[520px] md:max-h-[600px] overflow-y-auto overscroll-contain [scrollbar-width:none]"
                >
                  <ShotImage shot={s} sizes="300px" />
                </div>
              </PhoneFrame>
            ))}
          </div>
        )}
      </div>
      {scrollable && (
        <p className="text-center text-body-small text-text-inactive">
          {mode === "desktop"
            ? "Scroll inside the window to look through the site."
            : "Scroll inside the phone."}
        </p>
      )}
    </div>
  );
}
