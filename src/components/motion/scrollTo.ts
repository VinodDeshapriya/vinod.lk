import type Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Smooth-scroll to a page Y position, through Lenis when it is running. */
export function smoothScrollTo(top: number) {
  const lenis = typeof window !== "undefined" ? window.__lenis : undefined;
  if (lenis) lenis.scrollTo(top, { duration: 1.1 });
  else window.scrollTo({ top, behavior: "smooth" });
}
