"use client";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import Chevron from "./Chevron";
import ChevronForward from "atd-icons/dist/ChevronForward";
import type { NavItem, NavLink } from "@/types/nav";
import SliceIcon from "../SliceIcon";

const hrefOf = (l: NavLink) => (typeof l.href === "string" ? l.href : "#");
const isActive = (pathname: string, href: string) =>
  href !== "#" && !href.includes("#") && (pathname === href || (href !== "/" && pathname.startsWith(href + "/")));

/** Centred desktop menu (lg+). Items with dropdown links open a Lev-style panel on hover, click or keyboard. */
export default function DesktopNav({ mainMenu, floating }: { mainMenu?: NavItem[]; floating: boolean }) {
  const [open, setOpen] = useState<number | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const baseId = useId();

  // Sliding highlight: glides between links on hover/focus (instant on first appearance).
  const [hl, setHl] = useState<{ left: number; top: number; width: number; instant: boolean } | null>(null);
  const [hlShown, setHlShown] = useState(false);
  const moveHighlight = (el: HTMLElement) => {
    const target = el.firstElementChild as HTMLElement | null;
    if (!target) return;
    setHl({ left: target.offsetLeft, top: target.offsetTop, width: target.offsetWidth, instant: !hlShown && open === null });
    setHlShown(true);
  };

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(null), 140);
  }, []);

  // Close on route change (render-time reset), Escape and outside clicks.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(null);
  }
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        (navRef.current?.querySelector(`[data-trigger="${open}"]`) as HTMLElement | null)?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  if (!mainMenu?.length) return null;

  return (
    <nav ref={navRef} aria-label="Main" className="hidden lg:flex absolute inset-x-0 justify-center pointer-events-none">
      <ul
        className="relative flex items-center gap-2 xl:gap-3 pointer-events-auto"
        onMouseLeave={() => {
          scheduleClose();
          setHlShown(false);
        }}
        onMouseEnter={cancelClose}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setHlShown(false);
        }}
      >
        <li
          aria-hidden
          className={clsx(
            "absolute left-0 top-0 h-8 rounded-full bg-white ring-1 ring-border-primary/70 shadow-[0_1px_2px_rgba(10,18,33,0.06),0_6px_16px_-4px_rgba(10,18,33,0.12)] pointer-events-none motion-reduce:transition-none",
            hl?.instant
              ? "transition-opacity duration-150"
              : "transition-[transform,width,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            hl && (hlShown || open !== null) ? "opacity-100" : "opacity-0",
          )}
          style={hl ? { width: hl.width, transform: `translate(${hl.left}px, ${hl.top}px)` } : undefined}
        />
        {mainMenu.map((item, i) => {
          const links = (item.drop ?? []).flatMap((c) => c.links ?? []);
          const href = hrefOf(item);
          const active = isActive(pathname, href) || links.some((l) => isActive(pathname, hrefOf(l)));
          const pill = clsx(
            "relative z-10 inline-flex h-8 items-center gap-1 px-3 rounded-full text-[14px] leading-none text-text-heading transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-primary-light",
            open === i && "text-primary-light",
          );
          // Small dot under the link for the current page / section.
          const dot = active && (
            <span aria-hidden className="absolute left-1/2 -bottom-1 size-1 -translate-x-1/2 rounded-full bg-primary-light" />
          );
          if (!links.length) {
            return (
              <li key={i} onMouseEnter={(e) => moveHighlight(e.currentTarget)} onFocus={(e) => moveHighlight(e.currentTarget)}>
                <Link href={href} target={item.target} className={pill} aria-current={isActive(pathname, href) ? "page" : undefined} onMouseEnter={() => setOpen(null)}>
                  {item.label}
                  {dot}
                </Link>
              </li>
            );
          }
          const panelId = `${baseId}-panel-${i}`;
          return (
            <li
              key={i}
              onMouseEnter={(e) => {
                cancelClose();
                moveHighlight(e.currentTarget);
                setOpen(i);
              }}
              onFocus={(e) => moveHighlight(e.currentTarget)}
            >
              <button
                type="button"
                data-trigger={i}
                className={pill}
                aria-expanded={open === i}
                aria-controls={panelId}
                onClick={() => setOpen(open === i ? null : i)}
              >
                {item.label}
                <Chevron size={14} className={clsx("-mr-0.5 transition-[transform,color] duration-200", open === i ? "rotate-180 text-primary-light" : "text-text-description")} />
                {dot}
              </button>
              <DropPanel
                id={panelId}
                item={item}
                links={links}
                open={open === i}
                floating={floating}
                onNavigate={() => setOpen(null)}
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Groups dropdown links into columns by their `group` heading, keeping first-seen order. */
function columnsOf(links: NavLink[]) {
  const cols: { heading?: string; links: NavLink[] }[] = [];
  for (const l of links) {
    const col = cols.find((c) => c.heading === l.group);
    if (col) col.links.push(l);
    else cols.push({ heading: l.group, links: [l] });
  }
  return cols;
}

function DropPanel({
  id,
  item,
  links,
  open,
  floating,
  onNavigate,
}: {
  id: string;
  item: NavItem;
  links: NavLink[];
  open: boolean;
  floating: boolean;
  onNavigate: () => void;
}) {
  const cols = columnsOf(links);
  const feature = item.feature;
  const tab = open ? 0 : -1;
  return (
    <div
      id={id}
      className={clsx(
        "fixed inset-x-6 xl:inset-x-[45px] mx-auto max-w-[1300px] pt-[28px] transition-[opacity,transform,visibility] duration-200 ease-out motion-reduce:transition-none",
        floating ? "top-[46px]" : "top-[50px]",
        open ? "visible opacity-100 translate-y-0" : "invisible opacity-0 -translate-y-1 pointer-events-none",
      )}
    >
      <div className="flex rounded-[24px] border border-border-primary/70 bg-white/90 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_24px_60px_0_rgba(10,18,33,0.14)] overflow-hidden">
        <div className={clsx("flex-1 grid gap-x-10 px-9 py-10", cols.length > 1 ? "grid-cols-2" : "grid-cols-1")}>
          {cols.map((col, c) => (
            <div key={c} className="flex flex-col">
              {col.heading && <p className="mb-6 text-[15px] leading-5 text-text-inactive">{col.heading}</p>}
              <ul className="flex flex-col gap-2">
                {col.links.map((l, i) => (
                  <li key={i}>
                    <Link
                      href={hrefOf(l)}
                      target={l.target}
                      onClick={onNavigate}
                      tabIndex={tab}
                      className="group -mx-3 flex items-start gap-4 rounded-[14px] px-3 py-3 hover:bg-offwhite-2 focus-visible:outline-2 focus-visible:outline-primary-light transition-colors"
                    >
                      <span className="mt-[3px] shrink-0 text-text-heading group-hover:text-primary-light transition-colors">
                        <SliceIcon name={l.icon ?? "check"} size={22} />
                      </span>
                      <span className="flex flex-col gap-1">
                        <span className="text-[17px] leading-6 font-medium text-text-heading">{l.label}</span>
                        {l.description && <span className="text-[15px] leading-[22px] text-text-description">{l.description}</span>}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {feature && (
          <div className="hidden xl:flex w-[340px] shrink-0 border-l border-border-secondary p-9">
            <Link
              href={feature.href}
              onClick={onNavigate}
              tabIndex={tab}
              className="group flex flex-col gap-5 w-full focus-visible:outline-2 focus-visible:outline-primary-light rounded-[18px]"
            >
              {feature.image && (
                <span className="relative block aspect-[272/170] rounded-[18px] overflow-hidden border border-border-secondary bg-offwhite-2">
                  <Image
                    src={feature.image.src}
                    alt={feature.image.alt ?? ""}
                    fill
                    sizes="272px"
                    unoptimized={feature.image.src.startsWith("http")}
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </span>
              )}
              <span className="flex items-start justify-between gap-4">
                <span className="text-[17px] leading-6 font-medium text-text-heading group-hover:text-primary-light transition-colors">
                  {feature.title}
                </span>
                <ChevronForward size={14} aria-hidden className="mt-1.5 shrink-0 text-text-inactive group-hover:text-primary-light transition-colors" />
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
