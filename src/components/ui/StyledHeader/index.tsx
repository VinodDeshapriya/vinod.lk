"use client";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { type NavItem } from "@/types/nav";
import { siteSettings } from "@/data/site";
import type { HeaderCta } from "@/lib/layoutData";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

interface StyledHeaderProps {
  mainMenu?: NavItem[];
  headerCta: HeaderCta;
}

/** Scroll distance after which the bar turns into the floating, frosted pill. */
const FLOAT_AFTER = 24;

export const ease = "duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

/**
 * Site header, modelled on lev.com:
 * - desktop (lg+): 68px bar, centred menu, dropdown panels, small CTA pill;
 * - phone and tablet: 64px bar with CTA pill and a hamburger that opens a full-screen menu;
 * - after a little scroll the bar eases into a floating, rounded, frosted-glass pill.
 */
const StyledHeader = ({ mainMenu, headerCta }: StyledHeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const floating = scrolled && !mobileOpen;

  // Close the mobile menu when the route changes (render-time reset).
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > FLOAT_AFTER);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const { logo } = siteSettings;

  return (
    <header className="sticky top-0 z-50">
      <div
        className={clsx(
          "relative mx-auto transition-[width,margin,border-radius]",
          ease,
          // Like lev.com: never wider than 1440px; floating, it is an inset pill up to 1440px wide.
          floating ? "w-[min(1440px,calc(100%-16px))] mt-1 rounded-[30px]" : "w-full mt-0 rounded-none",
        )}
      >
        {/* Frosted-glass layer: fades in once the bar floats. */}
        <div
          aria-hidden
          className={clsx(
            "absolute inset-0 rounded-[inherit] border bg-white/75 backdrop-blur-xl backdrop-saturate-150 transition-opacity duration-150 ease-out motion-reduce:transition-none",
            floating
              ? "opacity-100 border-border-primary/70 shadow-[0_12px_40px_0_rgba(10,18,33,0.10)]"
              : mobileOpen
                ? "opacity-100 border-transparent bg-white! backdrop-blur-none"
                : "opacity-0 border-transparent",
          )}
        />
        <div
          className={clsx(
            "relative mx-auto max-w-[1440px] flex items-center h-16 transition-[height,padding]",
            ease,
            floating ? "px-4 lg:h-[60px] lg:px-4" : "px-4 md:px-10 lg:h-[68px] xl:px-20",
          )}
        >
          <Link href="/" className="relative z-10 flex items-center shrink-0" aria-label={`${logo.alt} home`}>
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              priority
              className="h-8 lg:h-9 w-auto"
            />
          </Link>

          <DesktopNav mainMenu={mainMenu} floating={floating} />

          <div className="ml-auto flex items-center gap-2 lg:gap-5">
            <Link
              href={headerCta.href}
              className="inline-flex items-center h-9 lg:h-8 px-3 lg:px-4 rounded-full bg-primary-light text-white text-[13px] leading-none font-medium whitespace-nowrap hover:bg-button-primary-hover transition-colors"
            >
              {headerCta.label}
            </Link>
            <MobileNav mainMenu={mainMenu} headerCta={headerCta} open={mobileOpen} setOpen={setMobileOpen} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default StyledHeader;
