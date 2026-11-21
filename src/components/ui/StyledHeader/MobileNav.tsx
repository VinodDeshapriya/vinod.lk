"use client";
import clsx from "clsx";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import Chevron from "./Chevron";
import type { NavItem, NavLink } from "@/types/nav";
import type { HeaderCta } from "@/lib/layoutData";
import SliceIcon from "../SliceIcon";

const hrefOf = (l: NavLink) => (typeof l.href === "string" ? l.href : "#");

/**
 * Phone and tablet menu (below lg), modelled on lev.com: a hamburger that morphs
 * into a close icon and a full-screen sheet with accordion sections.
 */
export default function MobileNav({
  mainMenu,
  headerCta,
  open,
  setOpen,
}: {
  mainMenu?: NavItem[];
  headerCta: HeaderCta;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const baseId = useId();

  // Lock page scroll and listen for Escape / resize while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.documentElement.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open, setOpen]);

  const close = () => setOpen(false);
  const line = "absolute left-[11px] h-[1.5px] w-[18px] rounded-full bg-text-heading transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]";

  return (
    <>
      <button
        type="button"
        className="lg:hidden relative z-10 size-10 -mr-2 rounded-full hover:bg-text-heading/5 transition-colors"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        aria-controls={`${baseId}-sheet`}
        onClick={() => {
          if (!open) setExpanded(null);
          setOpen(!open);
        }}
      >
        <span aria-hidden className={clsx(line, "top-[15px]", open && "translate-y-[4.5px] rotate-45")} />
        <span aria-hidden className={clsx(line, "top-[24px]", open && "-translate-y-[4.5px] -rotate-45")} />
      </button>

      <div
        data-lenis-prevent
        id={`${baseId}-sheet`}
        className={clsx(
          "lg:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-surface overflow-y-auto overscroll-contain transition-[opacity,visibility] duration-150 ease-out motion-reduce:transition-none",
          open ? "visible opacity-100" : "invisible opacity-0 pointer-events-none",
        )}
      >
        <nav aria-label="Main" className="flex flex-col min-h-full px-4 md:px-10 pb-8 border-t border-border-secondary">
          <ul>
            {mainMenu?.map((item, i) => {
              const links = (item.drop ?? []).flatMap((c) => c.links ?? []);
              const row = "flex w-full items-center justify-between py-3 min-h-14 text-[17px] leading-6 font-medium text-text-heading";
              if (!links.length) {
                return (
                  <li key={i} className="border-b border-border-secondary">
                    <Link href={hrefOf(item)} target={item.target} onClick={close} className={row} tabIndex={open ? 0 : -1}>
                      {item.label}
                    </Link>
                  </li>
                );
              }
              const isOpen = expanded === i;
              const panelId = `${baseId}-group-${i}`;
              return (
                <li key={i} className="border-b border-border-secondary">
                  <button
                    type="button"
                    className={row}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    tabIndex={open ? 0 : -1}
                    onClick={() => setExpanded(isOpen ? null : i)}
                  >
                    {item.label}
                    <Chevron size={18} className={clsx("text-text-description transition-transform duration-200", isOpen && "rotate-180")} />
                  </button>
                  <div
                    id={panelId}
                    className={clsx(
                      "grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <ul className="grid md:grid-cols-2 gap-x-6 gap-y-1 pb-5">
                        {links.map((l, j) => (
                          <li key={j}>
                            <Link
                              href={hrefOf(l)}
                              target={l.target}
                              onClick={close}
                              tabIndex={open && isOpen ? 0 : -1}
                              className="flex items-start gap-3 py-2.5 rounded-lg"
                            >
                              <span className="mt-0.5 shrink-0 text-text-heading">
                                <SliceIcon name={l.icon ?? "check"} size={18} />
                              </span>
                              <span className="flex flex-col gap-0.5">
                                <span className="text-[16px] leading-6 font-medium text-text-heading">{l.label}</span>
                                {l.description && <span className="text-[14px] leading-5 text-text-description">{l.description}</span>}
                              </span>
                            </Link>
                          </li>
                        ))}
                        {hrefOf(item) !== "#" && (
                          <li className="md:col-span-2 pt-1">
                            <Link href={hrefOf(item)} onClick={close} tabIndex={open && isOpen ? 0 : -1} className="inline-flex py-2 text-[15px] font-medium text-primary-light">
                              All {item.label?.toLowerCase()}
                            </Link>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-auto pt-10">
            <Link
              href={headerCta.href}
              onClick={close}
              tabIndex={open ? 0 : -1}
              className="flex items-center justify-center h-12 rounded-full bg-primary-light text-white text-[15px] font-medium"
            >
              {headerCta.label}
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
