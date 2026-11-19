"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import type { Content, ImageField, LinkField } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import StyledButton from "@/components/ui/StyledButton";
import { findFallback, type ProjectStatus } from "./projects";

type PrismicProject = Content.FeaturedProjectSliceDefaultPrimaryProjectsItem;

type Item = {
  name: string;
  headline: string;
  summary: string;
  status: ProjectStatus | null;
  tags: string[];
  logo: { field: ImageField } | { src: string; width: number; height: number } | null;
  image: { field: ImageField } | { src: string } | null;
  link: { field: LinkField } | { href: string } | null;
};

/** Prismic wins field by field; the Figma fallback fills whatever is empty. */
function toItem(p: PrismicProject): Item {
  const fb = findFallback(p.name);
  const tags = (p.tags ?? "").split("|").map((t) => t.trim()).filter(Boolean);
  const fromCms = !!p.headline;
  return {
    name: p.name || fb?.name || "",
    headline: p.headline || fb?.headline || "",
    summary: p.summary || fb?.summary || "",
    status: fromCms ? (p.is_live ? "live" : null) : (fb?.status ?? null),
    tags: tags.length ? tags : (fb?.tags ?? []),
    logo: isFilled.image(p.logo) ? { field: p.logo } : fb ? fb.logo : null,
    image: isFilled.image(p.image) ? { field: p.image } : fb ? { src: fb.image } : null,
    link: isFilled.link(p.link) ? { field: p.link } : fb ? { href: fb.url } : null,
  };
}

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const TICK = 12; // px between ruler marks

export default function ProjectTabs({
  projects,
  autoplayMs = 8000,
}: {
  projects: PrismicProject[];
  autoplayMs?: number;
}) {
  const items = projects.map(toItem).filter((x) => x.name);
  const [active, setActive] = useState(0);
  const [marker, setMarker] = useState<{ x: number; ready: boolean }>({ x: 0, ready: false });
  const [auto, setAuto] = useState(true); // turns off for good once the visitor picks a tab
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  const count = items.length;
  const go = useCallback(
    (i: number, user = true) => {
      if (!count) return;
      setActive(((i % count) + count) % count);
      if (user) setAuto(false);
    },
    [count],
  );

  // Marker sits under the middle of the active tab; it glides between tabs.
  const measure = useCallback(() => {
    const tab = tabRefs.current[active];
    if (!tab) return;
    setMarker((m) => ({ x: tab.offsetLeft + tab.offsetWidth / 2, ready: m.ready || m.x !== 0 }));
  }, [active]);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (scrollerRef.current) ro.observe(scrollerRef.current);
    return () => ro.disconnect();
  }, [measure]);

  // On small screens the tab row scrolls; keep the active tab in view.
  useEffect(() => {
    const sc = scrollerRef.current;
    const tab = tabRefs.current[active];
    if (!sc || !tab || sc.scrollWidth <= sc.clientWidth) return;
    sc.scrollTo({ left: tab.offsetLeft - (sc.clientWidth - tab.offsetWidth) / 2, behavior: "smooth" });
  }, [active]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Gentle autoplay: only while on screen, never while hovered or focused,
  // and not at all for reduced-motion visitors.
  useEffect(() => {
    if (!auto || paused || !inView || count < 2 || !autoplayMs) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => go(active + 1, false), autoplayMs);
    return () => window.clearTimeout(t);
  }, [auto, paused, inView, active, count, autoplayMs, go]);

  if (!count) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    const k = e.key;
    const next = k === "ArrowRight" ? active + 1 : k === "ArrowLeft" ? active - 1 : k === "Home" ? 0 : k === "End" ? count - 1 : null;
    if (next === null) return;
    e.preventDefault();
    go(next);
    tabRefs.current[((next % count) + count) % count]?.focus();
  };

  return (
    <div
      ref={rootRef}
      className="w-full flex flex-col gap-6 lg:gap-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Tabs + dial ruler */}
      <div
        ref={scrollerRef}
        className="-mx-4 md:mx-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="relative w-max min-w-full px-4 md:px-0">
          <div
            role="tablist"
            aria-label="Recent projects"
            onKeyDown={onKeyDown}
            className="flex lg:grid gap-1 lg:gap-0"
            style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
          >
            {items.map((x, i) => {
              const on = i === active;
              return (
                <button
                  key={x.name + i}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  type="button"
                  id={`project-tab-${i}`}
                  aria-selected={on}
                  aria-controls={`project-panel-${i}`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => go(i)}
                  className={clsx(
                    "relative h-11 px-4 lg:px-2 whitespace-nowrap text-[17px] lg:text-lg font-semibold tracking-[-0.01em] rounded-full",
                    "transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary-light/50",
                    on ? "text-text-heading" : "text-text-heading/40 hover:text-text-heading/75",
                  )}
                >
                  {x.name}
                </button>
              );
            })}
          </div>

          {/* Ruler: the ticks drift a little with each step (a dial), the marker glides. */}
          <div
            aria-hidden
            className="relative mt-3 h-7 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_5%,#000_95%,transparent)]"
          >
            <div
              className={clsx("absolute inset-y-0 -left-[12%] w-[124%] transition-transform duration-700 motion-reduce:transition-none", EASE)}
              style={{
                transform: `translateX(${-active * TICK * 1.5}px)`,
                backgroundImage: [
                  `repeating-linear-gradient(to right, color-mix(in oklab, var(--color-text-heading) 55%, transparent) 0 1px, transparent 1px ${TICK * 10}px)`,
                  `repeating-linear-gradient(to right, var(--color-text-inactive) 0 1px, transparent 1px ${TICK}px)`,
                ].join(","),
                backgroundSize: "100% 20px, 100% 11px",
                backgroundPosition: "0 100%, 0 100%",
                backgroundRepeat: "no-repeat",
              }}
            />
            <span
              className={clsx(
                "absolute bottom-0 left-0 h-7 w-0.5 -ml-px rounded-full bg-primary-light shadow-[0_0_12px_rgba(33,118,255,0.55)]",
                marker.ready && "transition-transform duration-500 motion-reduce:transition-none",
                EASE,
              )}
              style={{ transform: `translateX(${marker.x}px)` }}
            />
          </div>
        </div>
      </div>

      {/* Card stack: every project sits in the same cell, so the height never jumps. */}
      <div
        className="grid touch-pan-y"
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse") swipe.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => {
          const s = swipe.current;
          swipe.current = null;
          if (!s) return;
          const dx = e.clientX - s.x;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - s.y)) go(active + (dx < 0 ? 1 : -1));
        }}
      >
        {items.map((p, i) => (
          <ProjectCard key={p.name + i} p={p} i={i} on={i === active} />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ p, i, on }: { p: Item; i: number; on: boolean }) {
  const rise = (delay: number) => ({
    className: clsx(
      "transition-[opacity,transform] duration-700 motion-reduce:transition-none",
      EASE,
      on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
    ),
    style: { transitionDelay: on ? `${delay}ms` : "0ms" },
  });

  return (
    <article
      id={`project-panel-${i}`}
      role="tabpanel"
      aria-labelledby={`project-tab-${i}`}
      aria-hidden={!on}
      inert={!on}
      className={clsx(
        "[grid-area:1/1] relative overflow-hidden rounded-[28px] border border-secondary-light bg-offwhite",
        "grid lg:grid-cols-[minmax(0,509fr)_minmax(0,770fr)]",
        "transition-opacity duration-500 motion-reduce:transition-none",
        on ? "opacity-100 z-10" : "opacity-0 pointer-events-none",
      )}
    >
      <div className="flex flex-col justify-between gap-8 p-6 sm:p-8 lg:py-10 lg:pl-[60px] lg:pr-10">
        <div className="flex flex-col gap-6 lg:gap-8">
          {p.logo && (
            <div {...rise(80)}>
              {"field" in p.logo ? (
                <PrismicNextImage field={p.logo.field} className="h-10 lg:h-12 w-auto" />
              ) : (
                <Image
                  src={p.logo.src}
                  alt={`${p.name} logo`}
                  width={p.logo.width}
                  height={p.logo.height}
                  className="h-10 lg:h-12 w-auto"
                />
              )}
            </div>
          )}
          <p className={clsx(rise(140).className, "text-title-base text-text-heading text-balance")} style={rise(140).style}>
            {p.headline}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <p className={clsx(rise(200).className, "text-body-small text-text-heading")} style={rise(200).style}>
            {p.summary}
          </p>
          <ul className={clsx(rise(260).className, "flex flex-wrap gap-1.5")} style={rise(260).style}>
            {p.status === "live" && (
              <li className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-info-bg border border-primary-light text-xs leading-4 font-medium text-primary-light">
                <span className="relative flex size-1.5">
                  <span className="absolute inset-0 rounded-full bg-primary-light animate-ping opacity-60 motion-reduce:hidden" />
                  <span className="relative size-1.5 rounded-full bg-primary-light" />
                </span>
                Live
              </li>
            )}
            {p.status === "progress" && (
              <li className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-400 text-xs leading-4 font-medium text-amber-600">
                <span className="size-1.5 rounded-full bg-amber-500" />
                In progress
              </li>
            )}
            {p.tags.map((tag) => (
              <li
                key={tag}
                className="px-2.5 py-1 rounded-full bg-white border border-border-primary text-xs leading-4 font-medium text-text-description"
              >
                {tag}
              </li>
            ))}
          </ul>
          {p.link && (
            <div className={rise(320).className} style={rise(320).style}>
              {"field" in p.link ? (
                <StyledButton
                  field={p.link.field}
                  label={p.link.field.text || "View the project"}
                  variant="Link with Arrow"
                />
              ) : (
                <StyledButton link={p.link.href} target="_blank" label="View the project" variant="Link with Arrow" />
              )}
            </div>
          )}
        </div>
      </div>

      {p.image && (
        <div className="relative aspect-[1538/1214] lg:aspect-auto lg:min-h-[560px] overflow-hidden bg-[#001339]">
          <div
            className={clsx(
              "absolute inset-0 transition-transform duration-[900ms] motion-reduce:transition-none",
              EASE,
              on ? "scale-100 translate-x-0" : "scale-[1.04] translate-x-4",
            )}
          >
            {"field" in p.image ? (
              <PrismicNextImage
                field={p.image.field}
                fill
                sizes="(min-width: 1024px) 770px, 100vw"
                className="object-cover object-left-top"
              />
            ) : (
              <Image
                src={p.image.src}
                alt={`${p.name} website`}
                fill
                sizes="(min-width: 1024px) 770px, 100vw"
                priority={i === 0}
                className="object-cover object-left-top"
              />
            )}
          </div>
        </div>
      )}
    </article>
  );
}
