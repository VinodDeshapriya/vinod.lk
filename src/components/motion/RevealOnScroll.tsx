"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Scroll reveals like awmedia.marketing. Which elements reveal is decided in
 * CSS (`REVEAL` in globals.css): headings rise out of a mask, intros and
 * cards fade up, children of [data-reveal-stagger] follow one after another.
 * This only adds `.is-in` as each element enters the screen.
 */
export const REVEAL_SELECTOR = [
  "main h1",
  "main h2",
  "main h1 ~ p",
  "main h2 + p",
  "main [data-reveal]",
  "main [data-reveal-stagger] > *",
].join(",");

export default function RevealOnScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("js-reveal")) return;
    if (!("IntersectionObserver" in window)) {
      root.classList.remove("js-reveal");
      return;
    }

    // Headings start fully masked (clip-path), which the browser counts as
    // not visible, so they are watched through their parent instead.
    const watchers = new Map<Element, HTMLElement[]>();
    const io = new IntersectionObserver(
      (entries) => {
        // Elements arriving together play one after another.
        let n = 0;
        entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top ||
              a.boundingClientRect.left - b.boundingClientRect.left,
          )
          .forEach((e) => {
            for (const el of watchers.get(e.target) ?? []) {
              el.style.setProperty("--reveal-delay", `${Math.min(n++, 6) * 90}ms`);
              el.classList.add("is-in");
            }
            watchers.delete(e.target);
            io.unobserve(e.target);
          });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );

    const scan = () =>
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((el) => {
        if (el.classList.contains("is-in") || el.dataset.revealWatched) return;
        el.dataset.revealWatched = "1";
        const target = /^H[12]$/.test(el.tagName) && el.parentElement ? el.parentElement : el;
        const list = watchers.get(target);
        if (list) list.push(el);
        else {
          watchers.set(target, [el]);
          io.observe(target);
        }
      });
    scan();
    // Slices that render late (carousels, client components) get picked up too.
    const mo = new MutationObserver(scan);
    const main = document.querySelector("main");
    if (main) mo.observe(main, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      document.querySelectorAll<HTMLElement>("[data-reveal-watched]").forEach((el) => delete el.dataset.revealWatched);
    };
  }, [pathname]);

  return null;
}
