"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Inertia scrolling like awmedia.marketing (Lenis, lerp 0.09).
 * Off for reduced-motion visitors; touch devices keep native scrolling.
 * Scrollable overlays opt out with `data-lenis-prevent`.
 */
export default function SmoothScroll() {
  const pathname = usePathname();
  const first = useRef(true);
  const backForward = useRef(false);

  // Back / forward should return to where the visitor was, so remember it.
  useEffect(() => {
    const onPop = () => (backForward.current = true);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 1,
      autoRaf: true,
      anchors: { offset: -96 },
    });
    window.__lenis = lenis;
    return () => {
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  // New page: start at the top (or at its #anchor), drop any glide in
  // progress and re-measure the page height. Back / forward keeps its spot.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const lenis = window.__lenis;
    const wasBack = backForward.current;
    backForward.current = false;
    const hash = window.location.hash;
    const target = hash && hash !== "#book-a-call" ? document.querySelector<HTMLElement>(hash) : null;
    if (!wasBack) {
      if (target) {
        if (lenis) lenis.scrollTo(target, { immediate: true, force: true, offset: -96 });
        else target.scrollIntoView();
      } else if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
      else window.scrollTo(0, 0);
    } else if (lenis) {
      lenis.scrollTo(window.scrollY, { immediate: true, force: true });
    }
    if (!lenis) return;
    const id = window.setTimeout(() => lenis.resize(), 300);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
