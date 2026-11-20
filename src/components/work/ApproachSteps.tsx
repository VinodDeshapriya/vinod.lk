"use client";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "Our approach": the left column stays pinned while the steps scroll past.
 * It holds a rolling step counter (odometer, as on awmedia.marketing), a
 * progress bar. On the right, a timeline
 * line fills as you scroll and the card in the middle of the screen lights up.
 */
export default function ApproachSteps({
  intro,
  steps,
}: {
  intro: string;
  steps: { title: string; text: string }[];
}) {
  const [active, setActive] = useState(0);
  const [fill, setFill] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      // Trigger line a little below the middle, so the lit card is the one being read.
      const mid = window.innerHeight * 0.65;
      // Active step: the last card whose top has passed the trigger line.
      let next = 0;
      refs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= mid) next = i;
      });
      setActive(next);
      // Timeline fill: how far the trigger line has travelled down the list.
      const list = listRef.current;
      if (list) {
        const r = list.getBoundingClientRect();
        setFill(Math.min(1, Math.max(0, (mid - r.top) / r.height)));
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-10 lg:gap-20">
      <div className="lg:w-[400px] shrink-0">
        <div className="lg:sticky lg:top-28 flex flex-col gap-6">
          <h2 className="text-title-2x-large text-white">
            Our <span className="italic text-secondary-light">approach.</span>
          </h2>
          <p className="text-body-base text-white/65 max-w-[400px]">{intro}</p>

          <div className="hidden lg:flex flex-col gap-6 pt-4" aria-hidden>
            {/* Odometer: a column of numbers that rolls to the active step */}
            <div className="flex items-end gap-4">
              <div className="h-[112px] overflow-hidden">
                <div
                  className="flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ transform: `translateY(${-active * 112}px)` }}
                >
                  {steps.map((_, i) => (
                    <span
                      key={i}
                      className="block h-[112px] font-title font-medium text-[112px] leading-[112px] tracking-[-0.06em] bg-clip-text text-transparent bg-[linear-gradient(to_bottom,#fff_20%,rgba(112,178,255,0.55))]"
                    >
                      {pad(i + 1)}
                    </span>
                  ))}
                </div>
              </div>
              <span className="pb-3 text-[15px] font-medium text-white/40">/ {pad(steps.length)}</span>
            </div>
            <div className="relative h-[3px] w-full max-w-[320px] rounded-full bg-white/12 overflow-hidden">
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-secondary-light transition-[width] duration-500"
                style={{ width: `${((active + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

        </div>
      </div>

      <ol ref={listRef} className="relative flex-1 flex flex-col gap-5 pl-9 md:pl-12">
        {/* Timeline: a faint track with a blue fill that follows the scroll */}
        <span aria-hidden className="absolute left-[11px] md:left-[15px] top-2 bottom-2 w-px bg-white/12" />
        <span
          aria-hidden
          className="absolute left-[11px] md:left-[15px] top-2 w-px bg-[linear-gradient(to_bottom,rgba(112,178,255,0.2),#70b2ff)] origin-top"
          style={{ height: `calc((100% - 16px) * ${fill})` }}
        />
        {steps.map((s, i) => {
          const on = i === active;
          const done = i < active;
          return (
            <li
              key={s.title}
              ref={(el) => {
                refs.current[i] = el;
              }}
              className={clsx(
                "relative rounded-[20px] border p-6 md:p-8 transition-[background-color,border-color,box-shadow] duration-500",
                on
                  ? "bg-white/[0.08] border-white/25 shadow-[0_24px_60px_-20px_rgba(64,140,255,0.45)]"
                  : "bg-white/[0.03] border-white/10",
              )}
            >
              {/* Timeline node */}
              <span
                aria-hidden
                className={clsx(
                  "absolute top-8 md:top-9 -left-[31px] md:-left-[41px] size-[13px] rounded-full border-2 transition-all duration-500",
                  on
                    ? "border-secondary-light bg-secondary-light shadow-[0_0_0_6px_rgba(112,178,255,0.18)]"
                    : done
                      ? "border-secondary-light bg-[#0a1733]"
                      : "border-white/25 bg-[#0a1733]",
                )}
              />
              <p
                className={clsx(
                  "text-[13px] font-medium uppercase tracking-[0.14em] mb-3 transition-colors duration-500",
                  on ? "text-secondary-light" : "text-white/40",
                )}
              >
                Step {pad(i + 1)}
              </p>
              <h3
                className={clsx(
                  "font-title font-medium text-[22px] leading-[30px] md:text-[24px] transition-colors duration-500",
                  on ? "text-white" : "text-white/80 lg:text-white/60",
                )}
              >
                {s.title}
              </h3>
              <p
                className={clsx(
                  "mt-2 text-body-base transition-colors duration-500",
                  on ? "text-white/75" : "text-white/60 lg:text-white/45",
                )}
              >
                {s.text}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
