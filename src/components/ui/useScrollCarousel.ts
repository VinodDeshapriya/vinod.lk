"use client";
import { useCallback, useEffect, useRef, useState } from "react";

/** Scroll-snap carousel helper: prev/next by one card, tracks edges. */
export default function useScrollCarousel<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({
      left: dir * ((card?.offsetWidth ?? el.clientWidth) + gap),
      behavior: "smooth",
    });
  };

  return {
    ref,
    canPrev,
    canNext,
    prev: () => scrollByCard(-1),
    next: () => scrollByCard(1),
  };
}
