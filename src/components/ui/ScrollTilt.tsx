"use client";
import clsx from "clsx";
import { useEffect, useRef } from "react";

/**
 * Scroll-driven 3D "tilt to flat" reveal (pattern from awmedia.marketing):
 * the child starts tilted back (rotateX), slightly smaller and lower, and eases
 * flat and full size as it scrolls up the screen. Smoothed with a lerp so it
 * glides instead of tracking the scroll wheel 1:1. Off for reduced motion.
 */
export default function ScrollTilt({
  children,
  className,
  maxTilt = 18,
  minScale = 0.82,
  lift = 60,
}: {
  children: React.ReactNode;
  className?: string;
  /** Starting tilt in degrees. */
  maxTilt?: number;
  /** Starting scale (0–1). */
  minScale?: number;
  /** Starting downward offset in px. */
  lift?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const card = cardRef.current;
    if (!wrap || !card) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let current = -1;
    let target = 0;
    let frame = 0;

    // 0 = fully tilted, 1 = flat. Starts when the card's top is 62% down the
    // viewport and finishes when it reaches 10% from the top.
    const measure = () => {
      const vh = window.innerHeight;
      const top = wrap.getBoundingClientRect().top;
      target = Math.min(1, Math.max(0, (vh * 0.62 - top) / (vh * 0.52)));
    };
    const apply = (p: number) => {
      const e = 1 - Math.pow(1 - p, 3); // ease-out cubic
      const tilt = maxTilt * (1 - e);
      const scale = minScale + (1 - minScale) * e;
      const y = lift * (1 - e);
      card.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)}) rotateX(${tilt.toFixed(3)}deg)`;
    };
    const tick = () => {
      frame = 0;
      if (current < 0) current = target; // first paint: no glide from 0
      else current += (target - current) * 0.12;
      if (Math.abs(target - current) < 0.0005) current = target;
      apply(current);
      if (current !== target) frame = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      measure();
      if (!frame) frame = requestAnimationFrame(tick);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [maxTilt, minScale, lift]);

  return (
    <div ref={wrapRef} className="[perspective:1800px]">
      <div ref={cardRef} className={clsx("origin-top will-change-transform [transform-style:preserve-3d]", className)}>
        {children}
      </div>
    </div>
  );
}
