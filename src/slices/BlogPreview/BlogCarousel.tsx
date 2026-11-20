"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import PostCard from "@/components/blog/PostCard";
import type { PostSummary } from "@/lib/blog";

/**
 * Figma blog_variants1 carousel: a row of post cards that scrolls sideways
 * (swipe, trackpad, or drag with the mouse), snapping to each card, with dots.
 * Cards: 314px wide on mobile, 405px on tablet, three across on desktop.
 */
export default function BlogCarousel({ posts }: { posts: PostSummary[] }) {
  const ref = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const [scrollable, setScrollable] = useState(false);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const wasDrag = useRef(false);
  const n = posts.length;

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
    // snap to the nearest card after a mouse drag
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
        aria-label="Latest articles"
        className={clsx(
          "w-[calc(100%+32px)] md:w-[calc(100%+80px)] xl:w-[calc(100%+160px)] -mx-4 md:-mx-10 xl:-mx-20",
          "px-4 md:px-10 xl:px-20 scroll-px-4 md:scroll-px-10 xl:scroll-px-20",
          // room for the card shadow, cancelled out by negative margins
          "pt-4 pb-14 -mt-4 -mb-14",
          "flex gap-3 md:gap-8 overflow-x-auto snap-x snap-mandatory overscroll-x-contain",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          scrollable && "md:cursor-grab active:cursor-grabbing",
        )}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || !scrollable || !ref.current) return;
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
        onPointerUp={() => endDrag()}
        onPointerLeave={() => endDrag()}
        onClickCapture={(e) => {
          // a drag shouldn't open the card it ends on
          if (wasDrag.current) {
            e.preventDefault();
            e.stopPropagation();
            wasDrag.current = false;
          }
        }}
        onDragStart={(e) => e.preventDefault()}
      >
        {posts.map((p) => (
          <PostCard
            key={p.id}
            post={p}
            className="snap-start shrink-0 w-[314px] md:w-[405px] xl:w-[calc((100%-64px)/3)]"
          />
        ))}
      </ul>

      {scrollable && n > 1 && (
        <div className="flex items-center gap-1.5 h-4" role="group" aria-label="Choose articles">
          {posts.map((p, i) => (
            <button
              key={p.id}
              type="button"
              aria-label={`Show article ${i + 1} of ${n}`}
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
