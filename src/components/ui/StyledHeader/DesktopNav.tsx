"use client";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import ChevronDown from "atd-icons/dist/ChevronDown";
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
      <ul className="flex items-center gap-1 pointer-events-auto" onMouseLeave={scheduleClose} onMouseEnter={cancelClose}>
        {mainMenu.map((item, i) => {
          const links = (item.drop ?? []).flatMap((c) => c.links ?? []);
          const href = hrefOf(item);
          const active = isActive(pathname, href) || links.some((l) => isActive(pathname, hrefOf(l)));
          const pill = clsx(
            "relative inline-flex h-8 items-center gap-1 px-2 rounded-lg text-[14px] leading-none text-text-heading transition-colors hover:bg-text-heading/5 focus-visible:outline-2 focus-visible:outline-primary-light",
            (active || open === i) && "bg-text-heading/5",
          );
          if (!links.length) {
            return (
              <li key={i}>
                <Link href={href} target={item.target} className={pill} aria-current={isActive(pathname, href) ? "page" : undefined} onMouseEnter={() => setOpen(null)}>
                  {item.label}
                </Link>
              </li>
            );
          }
          const panelId = `${baseId}-panel-${i}`;
          return (
            <li key={i} onMouseEnter={() => { cancelClose(); setOpen(i); }}>
              <button
                type="button"
                data-trigger={i}
                className={pill}
                aria-expanded={open === i}
                aria-controls={panelId}
                onClick={() => setOpen(open === i ? null : i)}
              >
                {item.label}
                <ChevronDown size={12} aria-hidden className={clsx("text-text-inactive transition-transform duration-200", open === i && "rotate-180")} />
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
  const parentHref = hrefOf(item);
  return (
    <div
      id={id}
      className={clsx(
        "fixed inset-x-2 xl:inset-x-10 mx-auto max-w-[1360px] pt-[28px] transition-[opacity,transform,visibility] duration-200 ease-out motion-reduce:transition-none",
        floating ? "top-[46px]" : "top-[50px]",
        open ? "visible opacity-100 translate-y-0" : "invisible opacity-0 -translate-y-1 pointer-events-none",
      )}
    >
      <div className="rounded-[24px] border border-border-primary/70 bg-white/90 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_24px_60px_0_rgba(10,18,33,0.14)] overflow-hidden">
        <ul className="grid grid-cols-3 xl:grid-cols-4 gap-4 px-10 pt-10 pb-7">
          {links.map((l, i) => (
            <li key={i}>
              <Link
                href={hrefOf(l)}
                target={l.target}
                onClick={onNavigate}
                tabIndex={open ? 0 : -1}
                className="group flex flex-col h-full rounded-[18px] p-2 hover:bg-offwhite-2 focus-visible:outline-2 focus-visible:outline-primary-light transition-colors"
              >
                {l.image && (
                  <span className="relative block h-[118px] rounded-[12px] overflow-hidden bg-primary-dark">
                    <Image
                      src={l.image.src}
                      alt={l.image.alt ?? ""}
                      fill
                      sizes="320px"
                      unoptimized={l.image.src.startsWith("http")}
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </span>
                )}
                <span className="flex items-start gap-3 px-2 pt-4 pb-2">
                  {l.icon && (
                    <span className="mt-0.5 p-1.5 rounded-[8px] bg-info-bg text-primary-light shrink-0">
                      <SliceIcon name={l.icon} size={16} />
                    </span>
                  )}
                  <span className="flex flex-col gap-1">
                    <span className="text-[16px] leading-6 font-medium text-text-heading group-hover:text-primary-light transition-colors">
                      {l.label}
                    </span>
                    {l.description && <span className="text-[13px] leading-[19px] text-text-description">{l.description}</span>}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {parentHref !== "#" && (
          <div className="flex items-center justify-between px-10 py-4 border-t border-border-secondary">
            <Link
              href={parentHref}
              onClick={onNavigate}
              tabIndex={open ? 0 : -1}
              className="inline-flex items-center gap-1 text-[14px] text-text-heading hover:text-primary-light transition-colors"
            >
              All {item.label?.toLowerCase()}
              <ChevronForward size={12} aria-hidden />
            </Link>
            <Link
              href="/how-it-works"
              onClick={onNavigate}
              tabIndex={open ? 0 : -1}
              className="inline-flex items-center gap-1 text-[14px] text-text-description hover:text-primary-light transition-colors"
            >
              How a project works
              <ChevronForward size={12} aria-hidden />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
