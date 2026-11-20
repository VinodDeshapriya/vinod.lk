"use client";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "Our approach": the left column sticks with a big step counter and a
 * progress line; the step cards on the right light up one at a time as they
 * pass the middle of the screen (awmedia.marketing pattern).
 */
export default function ApproachSteps({
  intro,
  steps,
}: {
  intro: string;
  steps: { title: string; text: string }[];
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.i))),
      { rootMargin: "-48% 0px -48% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-10 lg:gap-20">
      <div className="lg:w-[420px] shrink-0">
        <div className="lg:sticky lg:top-32 flex flex-col gap-6">
          <h2 className="text-title-2x-large text-white">
            Our <span className="italic text-secondary-light">approach.</span>
          </h2>
          <p className="text-body-base text-white/65 max-w-[420px]">{intro}</p>
          <div className="hidden lg:flex flex-col gap-5 pt-6" aria-hidden>
            <p
              key={active}
              className="animate-[step-in_0.45s_cubic-bezier(0.22,1,0.36,1)] font-title font-medium text-[140px] leading-[0.85] tracking-[-0.06em] bg-clip-text text-transparent bg-[linear-gradient(to_bottom,#fff,rgba(112,178,255,0.55))] pt-[0.1em] -mt-[0.1em]"
            >
              {pad(active + 1)}
            </p>
            <div className="relative h-[3px] w-40 rounded-full bg-white/15 overflow-hidden">
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-secondary-light transition-[width] duration-500"
                style={{ width: `${((active + 1) / steps.length) * 100}%` }}
              />
            </div>
            <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-white/45">
              Step {pad(active + 1)} of {pad(steps.length)}
            </p>
          </div>
        </div>
      </div>

      <ol className="flex-1 flex flex-col gap-4">
        {steps.map((s, i) => (
          <li
            key={s.title}
            data-i={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className={clsx(
              "rounded-[20px] border p-6 md:p-8 transition-[opacity,background-color,border-color,transform] duration-500",
              i === active
                ? "opacity-100 bg-white/[0.07] border-white/25 lg:translate-x-0"
                : "opacity-100 lg:opacity-40 bg-white/[0.03] border-white/10",
            )}
          >
            <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-secondary-light mb-3">
              {pad(i + 1)}
            </p>
            <h3 className="font-title font-medium text-[22px] leading-[30px] md:text-[24px] text-white">{s.title}</h3>
            <p className="mt-2 text-body-base text-white/70">{s.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
