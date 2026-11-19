"use client";
import { useEffect, useRef, useState } from "react";
import type { Content } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import PrismicTitle from "@/components/ui/PrismicTitle";
import clsx from "clsx";
import ArrowForward from "atd-icons/dist/ArrowForward";
import StyledContainer from "@/components/ui/StyledContainer";

const pad = (n: number) => String(n).padStart(2, "0");

type Primary = Content.ProcessSlice["primary"];

/** Client part of the Process slice: sticky panel follows the step in view. */
export default function ProcessTimeline({ primary }: { primary: Primary }) {
  const processSteps = primary.steps.map((s) => ({
    title: s.title ?? "",
    short: (s.short_label || s.title || "").split("|").map((l) => l.trim()),
    free: s.is_free,
    text: s.description,
  }));
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.index));
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const current = processSteps[active] ?? processSteps[0];

  return (
    <StyledContainer
      as="section"
      slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }}
      className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start"
    >
            {/* Left panel */}
      <div className="relative w-full lg:w-[540px] shrink-0 lg:sticky lg:top-28 lg:h-[min(1124px,calc(100vh-140px))] min-h-[420px] overflow-hidden rounded-lg p-8 lg:p-12 flex flex-col gap-6 text-white shadow-[0_30px_70px_0_rgba(10,26,77,0.25)] bg-[linear-gradient(123deg,#080d1a_0%,#0a1733_43%,#0f4da8_71%)]">
        <div
          aria-hidden
          className="absolute left-[200px] top-[55%] w-[520px] h-[420px] rounded-full bg-primary-light/40 blur-[100px]"
        />
        {primary.eyebrow && (
          <p className="relative flex items-center gap-2.5 text-[13px] font-medium uppercase tracking-[0.14em] text-secondary-light">
            <span className="size-2 rounded-full bg-secondary-light" />
            {primary.eyebrow}
          </p>
        )}
        <PrismicTitle
          field={primary.title}
          className="relative text-title-x-large"
          emClassName="text-secondary-light"
        />
        <div className="grow" />
        <div className="relative hidden lg:flex items-end gap-4">
          <p className="font-title font-medium text-[160px] leading-[0.85] tracking-[-0.06em] bg-clip-text text-transparent bg-[linear-gradient(to_bottom,#fff,rgba(112,178,255,0.6))]">
            {pad(active + 1)}
          </p>
          <div className="pb-3.5 flex flex-col gap-0.5">
            <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-white/50">
              of {pad(processSteps.length)}
            </p>
            <p className="text-title-base">{current?.title}</p>
          </div>
        </div>
        <div className="relative h-[3px] rounded-xs bg-white/15 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-secondary-light rounded-xs transition-[width] duration-500"
            style={{ width: `${((active + 1) / processSteps.length) * 100}%` }}
          />
        </div>
        <ol className="relative hidden sm:flex gap-2">
          {processSteps.map((s, i) => (
            <li key={s.title} className="flex-1 flex flex-col gap-1">
              <span
                className={clsx(
                  "text-[13px] font-medium uppercase tracking-[0.14em]",
                  i === active ? "text-secondary-light" : "text-white/40",
                )}
              >
                {pad(i + 1)}
              </span>
              <span
                className={clsx(
                  "text-body-x-small transition-colors",
                  i === active ? "text-white/95" : "text-white/45",
                )}
              >
                {s.short.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ol>
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-[18px] rounded-[18px] bg-white/7 border border-white/14">
          <div className="flex-1">
            <p className="text-body-base-bold">{primary.cta_title}</p>
            <p className="text-body-small text-white/60">{primary.cta_meta}</p>
          </div>
          <PrismicNextLink
            field={primary.cta_link}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-primary-light text-body-base-bold hover:bg-white hover:text-text-heading transition-colors"
          >
            {primary.cta_link.text || "Book a Free Call"}
            <ArrowForward size={16} />
          </PrismicNextLink>
        </div>
      </div>

      {/* Timeline */}
      <ol className="flex-1 w-full flex flex-col">
        {processSteps.map((s, i) => {
          const isActive = i === active;
          const isLast = i === processSteps.length - 1;
          return (
            <li
              key={s.title}
              data-index={i}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              className={clsx("flex gap-4 lg:gap-7", !isLast && "pb-5")}
            >
              <div className="flex flex-col items-center w-11 lg:w-14 shrink-0">
                <span
                  className={clsx(
                    "size-11 lg:size-14 shrink-0 rounded-full flex items-center justify-center font-title font-semibold text-base lg:text-lg transition-colors",
                    isActive
                      ? "bg-primary-light text-white shadow-[0_0_0_6px_rgba(20,128,247,0.18)]"
                      : "bg-white border-[1.5px] border-border-primary text-text-inactive",
                  )}
                >
                  {pad(i + 1)}
                </span>
                {!isLast && (
                  <span
                    className={clsx(
                      "w-0.5 grow",
                      isActive
                        ? "bg-[linear-gradient(to_bottom,#1480f7,#d9dee5)]"
                        : "bg-border-primary",
                    )}
                  />
                )}
              </div>
              <div
                className={clsx(
                  "flex-1 min-w-0 flex flex-col gap-2.5 px-6 py-6 lg:px-8 lg:py-7 rounded-[24px] transition-all duration-300",
                  isActive
                    ? "bg-white border-[1.5px] border-primary-light shadow-[0_16px_48px_0_rgba(20,128,247,0.14)]"
                    : "bg-offwhite-2 border border-border-secondary",
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={clsx(
                      "text-[13px] font-medium uppercase tracking-[0.14em]",
                      isActive ? "text-primary-light" : "text-text-inactive",
                    )}
                  >
                    Step {i + 1}
                  </span>
                  {s.free && (
                    <span className="px-2.5 py-1 rounded-full bg-info-bg text-[13px] font-medium uppercase tracking-[0.14em] text-primary-light">
                      Free
                    </span>
                  )}
                </div>
                <h3
                  className={clsx(
                    "text-title-medium",
                    isActive ? "text-text-heading" : "text-text-description",
                  )}
                >
                  {s.title}
                </h3>
                <p
                  className={clsx(
                    "text-body-base",
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
    </StyledContainer>
  );
}
