"use client";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { type NavItem } from "@/types/nav";
import { siteSettings } from "@/data/site";
import type { HeaderCta } from "@/lib/layoutData";
import StyledButton from "../StyledButton";
import StyledContainer from "../StyledContainer";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import { isBreakpoint } from "./breakpoint";

export { isBreakpoint };

interface StyledHeaderProps {
  mainMenu?: NavItem[];
  headerCta: HeaderCta;
}

/** Scroll distance after which the bar turns into the floating, frosted pill. */
const FLOAT_AFTER = 24;

/**
 * Site header. At the top of the page it is a plain full-width bar; once the
 * page scrolls it eases into a floating rounded bar with a frosted-glass
 * background (pattern from lev.com).
 */
const StyledHeader = ({ mainMenu, headerCta }: StyledHeaderProps) => {
  const [floating, setFloating] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setFloating(window.scrollY > FLOAT_AFTER);
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
  const ease = "duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

  return (
    <header className="sticky top-0 z-50">
      <div
        className={clsx(
          "relative transition-[margin,border-radius]",
          ease,
          floating ? "mx-2 mt-1 rounded-[30px] lg:mx-3 lg:mt-2" : "mx-0 mt-0 rounded-none",
        )}
      >
        {/* Frosted-glass layer: fades in once the bar floats. */}
        <div
          aria-hidden
          className={clsx(
            "absolute inset-0 rounded-[inherit] border bg-white/75 backdrop-blur-xl backdrop-saturate-150 transition-opacity duration-150 ease-out motion-reduce:transition-none",
            floating
              ? "opacity-100 border-border-primary/70 shadow-[0_12px_40px_0_rgba(10,18,33,0.10)]"
              : "opacity-0 border-transparent",
          )}
        />
        <div className={clsx("relative transition-[padding]", ease, floating && "lg:px-1")}>
      <StyledContainer className="flex! items-center! justify-between!">
        <Link href="/" className="flex items-center">
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            priority
            className={clsx(
              "w-auto transition-[height,margin]",
              ease,
              floating ? "h-9 my-[10px] lg:h-11 lg:my-[9px]" : "h-10 my-[13px] lg:h-[50px] lg:my-4",
            )}
          />
        </Link>

        <DesktopMenu
          mainMenu={mainMenu}
          visibility={clsx({
            hidden: true,
            "xl:block xl:flex-1": isBreakpoint("xl"),
            "lg:block lg:flex-1": isBreakpoint("lg"),
          })}
        />

        <div className="hidden lg:block">
          <StyledButton
            label={headerCta.label}
            link={headerCta.href}
            variant="Secondary"
          />
        </div>

        <MobileMenu
          mainMenu={mainMenu}
          headerCta={headerCta}
          visibility={clsx({
            "xl:hidden": isBreakpoint("xl"),
            "lg:hidden": isBreakpoint("lg"),
          })}
        />
      </StyledContainer>
        </div>
      </div>
    </header>
  );
};

export default StyledHeader;
