"use client";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import clsx from "clsx";
import type { Content, ImageField, LinkField } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import StyledButton from "@/components/ui/StyledButton";
import { findFallback, type ProjectStatus } from "./projects";
import { playTicks, prepareTick } from "./tickSound";
import { smoothScrollTo } from "@/components/motion/scrollTo";

type PrismicProject = Content.FeaturedProjectSliceDefaultPrimaryProjectsItem;

type Item = {
  name: string;
  headline: string;
  summary: string;
  status: ProjectStatus | null;
  tags: string[];
  logo:
    | { field: ImageField }
    | { src: string; darkSrc: string; width: number; height: number }
    | null;
  image: { field: ImageField } | { src: string } | null;
  link: { field: LinkField } | { href: string } | null;
};

/** Prismic wins field by field; the Figma fallback fills whatever is empty. */
function toItem(p: PrismicProject): Item {
  const fb = findFallback(p.name);
  const tags = (p.tags ?? "")
    .split("|")
    .map((t) => t.trim())
    .filter(Boolean);
  const fromCms = !!p.headline;
  return {
    name: p.name || fb?.name || "",
    headline: p.headline || fb?.headline || "",
    summary: p.summary || fb?.summary || "",
    status: fromCms ? (p.is_live ? "live" : null) : (fb?.status ?? null),
    tags: tags.length ? tags : (fb?.tags ?? []),
    // Local transparent logos (with dark-mode versions) win; the Prismic logo is the fallback.
    logo: fb ? fb.logo : isFilled.image(p.logo) ? { field: p.logo } : null,
    image: isFilled.image(p.image)
      ? { field: p.image }
      : fb
        ? { src: fb.image }
        : null,
    link: isFilled.link(p.link)
      ? { field: p.link }
      : fb
        ? { href: fb.url }
        : null,
  };
}

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const TICK = 12; // target px between ruler marks

export default function ProjectTabs({
  projects,
  autoplayMs = 8000,
}: {
  projects: PrismicProject[];
  autoplayMs?: number;
}) {
  const items = projects.map(toItem).filter((x) => x.name);
  const [active, setActive] = useState(0);
  const [geo, setGeo] = useState<{ centers: number[]; width: number }>({
    centers: [],
    width: 0,
  });
  const [ready, setReady] = useState(false);
  const [auto, setAuto] = useState(true); // turns off for good once the visitor picks a tab
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  // Scroll mode (desktop): the section pins and scrolling steps through projects.
  const [pin, setPin] = useState({ on: false, top: 0, h: 0, step: 0 });

  const rootRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  const count = items.length;
  // Ruler marks: a dark mark exactly under every tab's centre, evenly spaced
  // light marks between them, continued out to both edges.
  const ruler = useMemo(() => {
    const { centers: c, width } = geo;
    if (c.length === 0 || !width)
      return {
        marks: [] as { x: number; major: boolean }[],
        between: [] as number[],
      };
    const between: number[] = [];
    const marks: { x: number; major: boolean }[] = [];
    const subdivide = (a: number, b: number) =>
      Math.max(4, Math.round(Math.abs(b - a) / TICK));
    const first = c.length > 1 ? (c[1] - c[0]) / subdivide(c[0], c[1]) : TICK;
    const last =
      c.length > 1
        ? (c[c.length - 1] - c[c.length - 2]) /
          subdivide(c[c.length - 2], c[c.length - 1])
        : TICK;
    for (let x = c[0] - first; x > -1; x -= first)
      marks.push({ x, major: false });
    c.forEach((x, i) => {
      marks.push({ x, major: true });
      if (i < c.length - 1) {
        const n = subdivide(x, c[i + 1]);
        between.push(n);
        for (let k = 1; k < n; k++)
          marks.push({ x: x + ((c[i + 1] - x) * k) / n, major: false });
      }
    });
    for (let x = c[c.length - 1] + last; x < width + 1; x += last)
      marks.push({ x, major: false });
    return { marks, between };
  }, [geo]);

  const marksBetween = useCallback(
    (from: number, to: number) =>
      ruler.between
        .slice(Math.min(from, to), Math.max(from, to))
        .reduce((sum, n) => sum + n, 0),
    [ruler],
  );

  /** Scroll position (px from page top) where project `i` is showing in scroll mode. */
  const scrollFor = useCallback(
    (i: number) => {
      const t = trackRef.current;
      if (!t) return 0;
      return (
        window.scrollY +
        t.getBoundingClientRect().top -
        pin.top +
        i * pin.step +
        2
      );
    },
    [pin],
  );

  const go = useCallback(
    (i: number, user = true) => {
      if (!count) return;
      const next = ((i % count) + count) % count;
      if (pin.on) {
        // In scroll mode a click scrolls to that project; the scroll does the rest.
        smoothScrollTo(scrollFor(next));
        return;
      }
      if (user) {
        setAuto(false);
        playTicks(marksBetween(active, next));
      }
      setActive(next);
    },
    [count, active, pin.on, scrollFor, marksBetween],
  );

  const measure = useCallback(() => {
    const r = rulerRef.current;
    if (!r) return;
    const centers = tabRefs.current
      .slice(0, count)
      .map((t) =>
        t ? Math.round(t.offsetLeft + t.offsetWidth / 2 - r.offsetLeft) : 0,
      );
    const width = r.offsetWidth;
    setGeo((g) =>
      g.width === width && g.centers.join() === centers.join()
        ? g
        : { centers, width },
    );
  }, [count]);

  useLayoutEffect(() => {
    measure();
    const id = requestAnimationFrame(() => setReady(true));
    const ro = new ResizeObserver(measure);
    if (scrollerRef.current) ro.observe(scrollerRef.current);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(id);
    };
  }, [measure]);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  // Decide whether scroll mode fits: wide screen, no reduced motion, and the
  // tabs + card fit in the window below the navbar.
  useLayoutEffect(() => {
    const el = stickyRef.current;
    if (!el || count < 2) return;
    const NAV = 84;
    const decide = () => {
      const h = el.offsetHeight;
      const vh = window.innerHeight;
      const on =
        window.matchMedia("(min-width: 1024px)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
        h + NAV + 16 <= vh;
      const top = Math.max(NAV, Math.round((vh - h) / 2 + NAV / 3));
      const step = Math.round(Math.max(360, vh * 0.55));
      setPin((p) =>
        p.on === on && p.top === top && p.h === h && p.step === step
          ? p
          : { on, top, h, step },
      );
    };
    decide();
    const ro = new ResizeObserver(decide);
    ro.observe(el);
    window.addEventListener("resize", decide);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", decide);
    };
  }, [count]);

  useEffect(() => {
    if (!pin.on) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const t = trackRef.current;
      if (!t) return;
      const scrolled = pin.top - t.getBoundingClientRect().top;
      const next = Math.min(
        count - 1,
        Math.max(0, Math.floor(scrolled / pin.step + 0.35)),
      );
      if (next !== activeRef.current) {
        playTicks(marksBetween(activeRef.current, next), 450);
        activeRef.current = next;
        setActive(next);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pin, count, marksBetween]);

  // Browsers only allow sound after the visitor clicks, taps or types somewhere,
  // so unlock the tick on the first such gesture anywhere on the page.
  useEffect(() => {
    const unlock = () => prepareTick();
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  // On small screens the tab row scrolls; keep the active tab in view.
  useEffect(() => {
    const sc = scrollerRef.current;
    const tab = tabRefs.current[active];
    if (!sc || !tab || sc.scrollWidth <= sc.clientWidth) return;
    sc.scrollTo({
      left: tab.offsetLeft - (sc.clientWidth - tab.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, [active]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.35,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Gentle autoplay: only while on screen, never while hovered or focused,
  // and not at all for reduced-motion visitors.
  useEffect(() => {
    if (pin.on || !auto || paused || !inView || count < 2 || !autoplayMs)
      return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => go(active + 1, false), autoplayMs);
    return () => window.clearTimeout(t);
  }, [pin.on, auto, paused, inView, active, count, autoplayMs, go]);

  if (!count) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    const k = e.key;
    const next =
      k === "ArrowRight"
        ? active + 1
        : k === "ArrowLeft"
          ? active - 1
          : k === "Home"
            ? 0
            : k === "End"
              ? count - 1
              : null;
    if (next === null) return;
    e.preventDefault();
    go(next);
    tabRefs.current[((next % count) + count) % count]?.focus();
  };

  return (
    <div
      ref={rootRef}
      className="w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        ref={trackRef}
        style={pin.on ? { height: pin.h + (count - 1) * pin.step } : undefined}
      >
        <div
          ref={stickyRef}
          className={clsx("flex flex-col gap-6 lg:gap-8", pin.on && "sticky")}
          style={pin.on ? { top: pin.top } : undefined}
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
                onKeyDown={(e) => {
                  prepareTick();
                  onKeyDown(e);
                }}
                onPointerDown={prepareTick}
                className="flex lg:grid gap-1 lg:gap-0"
                style={{
                  gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
                }}
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
                        on
                          ? "text-text-heading"
                          : "text-text-heading/40 hover:text-text-heading/75",
                      )}
                    >
                      {x.name}
                    </button>
                  );
                })}
              </div>

              {/* Ruler: the blue marker glides from one dark mark to the next. */}
              {/* Clicking the ruler jumps to the project whose mark is nearest. */}
              <div
                ref={rulerRef}
                aria-hidden
                onClick={(e) => {
                  if (!geo.centers.length) return;
                  const x =
                    e.clientX - e.currentTarget.getBoundingClientRect().left;
                  let nearest = 0;
                  geo.centers.forEach((c, i) => {
                    if (Math.abs(c - x) < Math.abs(geo.centers[nearest] - x))
                      nearest = i;
                  });
                  go(nearest);
                }}
                className="group/ruler relative mt-3 h-7 overflow-hidden cursor-pointer [mask-image:linear-gradient(to_right,transparent,#000_4%,#000_96%,transparent)]"
              >
                {ruler.marks.map((m, i) => (
                  <span
                    key={i}
                    className={clsx(
                      "absolute bottom-0 w-px -translate-x-1/2",
                      m.major
                        ? "h-5 bg-text-heading/55 group-hover/ruler:bg-text-heading/80"
                        : "h-[11px] bg-text-inactive group-hover/ruler:bg-text-description",
                    )}
                    style={{ left: `${Math.round(m.x)}px` }}
                  />
                ))}
                {geo.centers.length > 0 && (
                  <span
                    className={clsx(
                      "absolute bottom-0 left-0 h-7 w-0.5 -ml-px rounded-full bg-primary-light shadow-[0_0_12px_rgba(33,118,255,0.55)]",
                      ready &&
                        "transition-transform duration-500 motion-reduce:transition-none",
                      EASE,
                    )}
                    style={{
                      transform: `translateX(${geo.centers[active] ?? 0}px)`,
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Card stack: every project sits in the same cell, so the height never jumps. */}
          <div
            className="grid touch-pan-y"
            onPointerDown={(e) => {
              if (e.pointerType === "mouse") return;
              prepareTick();
              swipe.current = { x: e.clientX, y: e.clientY };
            }}
            onPointerUp={(e) => {
              const s = swipe.current;
              swipe.current = null;
              if (!s) return;
              const dx = e.clientX - s.x;
              if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - s.y))
                go(active + (dx < 0 ? 1 : -1));
            }}
          >
            {items.map((p, i) => (
              <ProjectCard key={p.name + i} p={p} i={i} on={i === active} />
            ))}
          </div>
        </div>
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
                <PrismicNextImage
                  field={p.logo.field}
                  className="h-7 sm:h-9 lg:h-12 w-auto"
                />
              ) : (
                <>
                  <Image
                    src={p.logo.src}
                    alt={`${p.name} logo`}
                    width={p.logo.width}
                    height={p.logo.height}
                    className="h-7 sm:h-9 lg:h-12 w-auto dark:hidden"
                  />
                  <Image
                    src={p.logo.darkSrc}
                    alt={`${p.name} logo`}
                    width={p.logo.width}
                    height={p.logo.height}
                    className="h-7 sm:h-9 lg:h-12 w-auto hidden dark:block"
                  />
                </>
              )}
            </div>
          )}
          <p
            className={clsx(
              rise(140).className,
              "text-title-base text-text-heading text-balance",
            )}
            style={rise(140).style}
          >
            {p.headline}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <p
            className={clsx(
              rise(200).className,
              "text-body-small text-text-heading",
            )}
            style={rise(200).style}
          >
            {p.summary}
          </p>
          <ul
            className={clsx(rise(260).className, "flex flex-wrap gap-1.5")}
            style={rise(260).style}
          >
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
                className="px-2.5 py-1 rounded-full bg-surface border border-border-primary text-xs leading-4 font-medium text-text-description"
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
                <StyledButton
                  link={p.link.href}
                  target={p.link.href.startsWith("http") ? "_blank" : undefined}
                  label="View the project"
                  variant="Link with Arrow"
                />
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
