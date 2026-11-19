"use client";
import { useEffect } from "react";
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

  // New page: drop any glide in progress and re-measure the page height.
  useEffect(() => {
    const lenis = window.__lenis;
    if (!lenis) return;
    lenis.scrollTo(window.scrollY, { immediate: true, force: true });
    const id = window.setTimeout(() => lenis.resize(), 300);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
