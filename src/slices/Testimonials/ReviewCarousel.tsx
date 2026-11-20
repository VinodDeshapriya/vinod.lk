"use client";
import { Children, useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";

/**
 * Figma testimonial_variants1 carousel: one card on mobile, two on tablet,
 * three on desktop; swipe / trackpad / mouse-drag, snapping per card, with dots.
 */
export default function ReviewCarousel({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);
  const n = Children.count(children);
  const [active, setActive] = useState(0);
  const [scrollable, setScrollable] = useState(false);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const wasDrag = useRef(false);

  const sync = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setScrollable(max > 2);
    setActive(max > 2 ? Math.round((el.scrollLeft / max) * (n - 1)) : 0);
  }, [n]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    el.addEventListener("scroll", sync, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", sync);
    };
  }, [sync]);

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: (max * i) / Math.max(1, n - 1), behavior: "smooth" });
  };

  const endDrag = () => {
    const d = drag.current;
    const el = ref.current;
    drag.current = null;
    if (!d || !el) return;
    wasDrag.current = d.moved;
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0") : 0;
    el.style.scrollSnapType = "";
    if (step) el.scrollTo({ left: Math.round(el.scrollLeft / step) * step, behavior: "smooth" });
  };

  return (
    <div className="w-full flex flex-col items-center gap-6 md:gap-10">
      <ul
        ref={ref}
        data-reveal
        aria-label="Client reviews"
        className={clsx(
          // extra room so the card shadow isn't clipped, cancelled by negative margins
          "w-[calc(100%+32px)] -mx-4 px-4 scroll-px-4 pt-2 pb-8 -mt-2 -mb-8",
          "flex gap-5 overflow-x-auto snap-x snap-mandatory overscroll-x-contain",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          scrollable && "md:cursor-grab active:cursor-grabbing",
        )}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || !scrollable || !ref.current) return;
          if ((e.target as HTMLElement).closest("button, a, dialog")) return;
          drag.current = { x: e.clientX, left: ref.current.scrollLeft, moved: false };
          ref.current.style.scrollSnapType = "none";
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d || !ref.current) return;
          const dx = e.clientX - d.x;
          if (Math.abs(dx) > 4) d.moved = true;
          ref.current.scrollLeft = d.left - dx;
        }}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={(e) => {
          if (wasDrag.current) {
            e.preventDefault();
            e.stopPropagation();
            wasDrag.current = false;
          }
        }}
      >
        {children}
      </ul>

      {scrollable && n > 1 && (
        <div className="flex items-center gap-1.5 h-4" role="group" aria-label="Choose reviews">
          {Array.from({ length: n }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show review ${i + 1} of ${n}`}
              aria-current={i === active}
              onClick={() => goTo(i)}
              className={clsx(
                "rounded-full transition-all duration-300",
                i === active ? "size-4 bg-primary-light" : "size-3 bg-text-inactive hover:bg-text-description",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
