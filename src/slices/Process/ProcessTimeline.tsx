"use client";
import { useEffect, useRef, useState } from "react";
import type { Content } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import PrismicTitle from "@/components/ui/PrismicTitle";
import clsx from "clsx";
import ArrowForward from "atd-icons/dist/ArrowForward";
import StyledContainer from "@/components/ui/StyledContainer";
import { smoothScrollTo } from "@/components/motion/scrollTo";

const pad = (n: number) => String(n).padStart(2, "0");

type Primary = Content.ProcessSlice["primary"];

/**
 * Figma content_process_variants1: 1440 (19342:3991), 768 (19342:3992), 375 (19342:4084).
 * Desktop: the dark panel is sticky and follows the step in view.
 * Tablet/mobile: the panel sits above the steps, so a slim progress bar sticks
 * under the navbar while the steps are on screen (the panel's counter would be
 * off-screen otherwise).
 */
export default function ProcessTimeline({ primary }: { primary: Primary }) {
  const steps = primary.steps.map((s) => ({
    title: s.title ?? "",
    short: (s.short_label || s.title || "").split("|").map((l) => l.trim()),
    free: s.is_free,
    text: s.description,
  }));
  const n = steps.length;
  const [active, setActive] = useState(0);
  const [showBar, setShowBar] = useState(false);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Small screens: show the sticky bar once the panel has scrolled away and the steps are on screen.
  useEffect(() => {
    const panel = panelRef.current;
    const list = listRef.current;
    if (!panel || !list) return;
    let panelGone = false;
    let listIn = false;
    const update = () => setShowBar(panelGone && listIn);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.target === panel) panelGone = !e.isIntersecting && e.boundingClientRect.top < 0;
          if (e.target === list) listIn = e.isIntersecting;
        });
        update();
      },
      { rootMargin: "-80px 0px -20% 0px" },
    );
    io.observe(panel);
    io.observe(list);
    return () => io.disconnect();
  }, []);

  const goTo = (i: number) => {
    const el = stepRefs.current[i];
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.45 + 40;
    smoothScrollTo(top);
  };

  const current = steps[active] ?? steps[0];
  const progress = `${((active + 1) / Math.max(1, n)) * 100}%`;

  return (
    <StyledContainer
      as="section"
      slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }}
      className="flex flex-col lg:flex-row gap-7 md:gap-10 lg:gap-14 items-start"
    >
      {/* Left panel */}
      <div
        ref={panelRef}
        className={clsx(
          "relative w-full lg:w-[540px] shrink-0 overflow-hidden rounded-[28px] text-white",
          "flex flex-col gap-6 px-5 py-6 md:p-12",
          "lg:sticky lg:top-28 lg:h-[min(1124px,calc(100vh-140px))] lg:min-h-[640px]",
          "shadow-[0_30px_70px_0_rgba(10,26,77,0.25)] bg-[linear-gradient(123deg,#080d1a_0%,#0a1733_60%,#0f4da8_100%)]",
        )}
      >
        <div aria-hidden className="absolute inset-0 opacity-[0.11] bg-[url(/images/noise.webp)] [background-size:256px]" />
        <div
          aria-hidden
          className="absolute left-[200px] top-[620px] lg:top-[56%] w-[303px] h-[245px] md:w-[520px] md:h-[420px] rounded-full bg-primary-light/50 blur-[70px]"
        />
        {primary.eyebrow && (
          <p className="relative flex items-center gap-2.5 text-[13px] leading-[17px] font-medium uppercase tracking-[0.14em] text-secondary-light">
            <span className="size-2 rounded-full bg-secondary-light" />
            {primary.eyebrow}
          </p>
        )}
        <PrismicTitle
          field={primary.title}
          className="relative font-title font-medium text-[30px] leading-[34px] md:text-[48px] md:leading-[56px]"
          emClassName="text-secondary-light"
        />
        <div className="hidden lg:block grow" />

        <div className="relative flex items-end gap-4" aria-live="polite">
          <p
            key={active}
            className="animate-[step-in_0.45s_cubic-bezier(0.22,1,0.36,1)] font-title font-medium text-[99px] md:text-[128px] lg:text-[160px] leading-[0.85] tracking-[-0.06em] bg-clip-text text-transparent bg-[linear-gradient(to_bottom,#fff,rgba(112,178,255,0.6))] pt-[0.1em] -mt-[0.1em]"
          >
            {pad(active + 1)}
          </p>
          <div className="pb-3.5 flex flex-col gap-0.5">
            <p className="text-[13px] leading-[17px] font-medium uppercase tracking-[0.14em] text-white/50">
              of {pad(n)}
            </p>
            <p className="font-title font-medium text-[20px] leading-[26px] md:text-[24px] md:leading-[30px] tracking-[-0.2px]">
              {current?.title}
            </p>
          </div>
        </div>

        <div className="relative h-[3px] rounded-xs bg-white/15 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-secondary-light rounded-xs transition-[width] duration-500"
            style={{ width: progress }}
          />
        </div>

        <ol className="relative hidden md:flex gap-2">
          {steps.map((s, i) => (
            <li key={s.title} className="flex-1">
              <button
                type="button"
                onClick={() => goTo(i)}
                className="group w-full flex flex-col gap-1 text-left"
                aria-label={`Go to step ${i + 1}: ${s.title}`}
              >
                <span
                  className={clsx(
                    "text-[13px] leading-[17px] font-medium uppercase tracking-[0.14em] transition-colors",
                    i === active ? "text-secondary-light" : "text-white/40 group-hover:text-white/70",
                  )}
                >
                  {pad(i + 1)}
                </span>
                <span
                  className={clsx(
                    "text-[14px] leading-[22px] transition-colors",
                    i === active ? "text-white/95" : "text-white/45 group-hover:text-white/75",
                  )}
                >
                  {s.short.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </button>
            </li>
          ))}
        </ol>

        <div className="relative flex flex-col md:flex-row items-center gap-4 px-5 py-[18px] rounded-[18px] bg-white/7 border border-white/14">
          <div className="flex-1 flex flex-col gap-0.5 max-md:text-center">
            <p className="font-medium text-[16px] leading-[26px] md:text-[18px] md:leading-[30px]">{primary.cta_title}</p>
            <p className="text-[16px] leading-6 text-white/60">{primary.cta_meta}</p>
          </div>
          <PrismicNextLink
            field={primary.cta_link}
            className="shrink-0 flex items-center justify-center gap-2 h-[50px] md:h-[54px] px-5 rounded-full bg-primary-light font-medium text-[16px] leading-[26px] md:text-[18px] md:leading-[30px] hover:bg-surface hover:text-text-heading transition-colors"
          >
            {primary.cta_link.text || "Get a Free Quote"}
            <ArrowForward size={16} />
          </PrismicNextLink>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative flex-1 w-full">
        {/* Tablet/mobile: slim sticky progress (takes no space) */}
        <div className="lg:hidden sticky top-[82px] z-20 h-0">
          <div
            aria-hidden={!showBar}
            className={clsx(
              "flex items-center gap-3 h-12 pl-1.5 pr-4 rounded-full text-white shadow-[0_12px_30px_-8px_rgba(10,26,77,0.45)]",
              "bg-[linear-gradient(110deg,#080d1a_0%,#0a1733_60%,#0f4da8_100%)] border border-white/10",
              "transition-[opacity,transform] duration-300",
              showBar ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none",
            )}
          >
            <span className="size-9 shrink-0 grid place-items-center rounded-full bg-primary-light font-title font-semibold text-[14px]">
              {pad(active + 1)}
            </span>
            <span className="flex-1 min-w-0 flex flex-col gap-1">
              <span className="flex items-baseline gap-2 min-w-0">
                <span className="truncate font-title font-medium text-[15px] leading-5">{current?.title}</span>
                <span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.14em] text-white/50">
                  of {pad(n)}
                </span>
              </span>
              <span className="relative h-[3px] rounded-full bg-white/15 overflow-hidden">
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-secondary-light transition-[width] duration-500"
                  style={{ width: progress }}
                />
              </span>
            </span>
          </div>
        </div>

        <ol ref={listRef} data-reveal-stagger className="flex flex-col">
          {steps.map((s, i) => {
            const isActive = i === active;
            const isLast = i === n - 1;
            return (
              <li
                key={s.title}
                data-index={i}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                className={clsx("flex gap-3.5 md:gap-7", !isLast && "pb-5")}
              >
                <div className="flex flex-col items-center w-11 md:w-14 shrink-0">
                  <span
                    className={clsx(
                      "size-11 md:size-14 shrink-0 rounded-full flex items-center justify-center font-title font-semibold text-[14px] md:text-[18px] transition-all duration-300",
                      isActive
                        ? "bg-primary-light text-white shadow-[0_0_0_6px_rgba(20,128,247,0.18)] md:shadow-[0_0_0_8px_rgba(20,128,247,0.18)]"
                        : "bg-surface border-[1.2px] border-border-primary text-text-inactive",
                    )}
                  >
                    {pad(i + 1)}
                  </span>
                  {!isLast && (
                    <span
                      className={clsx(
                        "w-0.5 grow",
                        isActive ? "bg-[linear-gradient(to_bottom,#1480f7,#d9dee5)]" : "bg-border-primary",
                      )}
                    />
                  )}
                </div>
                <div
                  className={clsx(
                    "flex-1 min-w-0 flex flex-col gap-2.5 px-5 py-7 md:px-8 rounded-[24px] transition-[background-color,border-color,box-shadow] duration-300",
                    isActive
                      ? "bg-surface border-[1.5px] border-primary-light shadow-[0_16px_48px_0_rgba(20,128,247,0.14)]"
                      : "bg-offwhite-2 border border-border-secondary",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={clsx(
                        "text-[13px] leading-[17px] font-medium uppercase tracking-[0.14em] transition-colors",
                        isActive ? "text-primary-light" : "text-text-inactive",
                      )}
                    >
                      Step {i + 1}
                    </span>
                    {s.free && (
                      <span className="px-2.5 py-1 rounded-full bg-info-bg text-[13px] leading-[17px] font-medium uppercase tracking-[0.14em] text-primary-light">
                        Free
                      </span>
                    )}
                  </div>
                  <h3
                    className={clsx(
                      "font-title font-medium text-[24px] leading-[30px] md:text-[32px] md:leading-10 transition-colors",
                      isActive ? "text-text-heading" : "text-text-description",
                    )}
                  >
                    {s.title}
                  </h3>
                  <p
                    className={clsx(
                      "text-[16px] leading-[26px] md:text-[18px] md:leading-[30px] transition-colors",
                      isActive ? "text-text-description" : "text-text-inactive",
                    )}
                  >
                    {s.text}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </StyledContainer>
  );
}
