"use client";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { type NavItem } from "@/types/nav";
import { siteSettings } from "@/data/site";
import StyledContainer from "../StyledContainer";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import { isBreakpoint } from "./breakpoint";

export { isBreakpoint };

interface StyledHeaderProps {
  mainMenu?: NavItem[];
}

const StyledHeader = ({ mainMenu }: StyledHeaderProps) => {
  const [stickyMenu, setStickyMenu] = useState(true);
  const lastScrollY = useRef(0);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const headerHeight = headerRef.current?.offsetHeight ?? 0;
      if (currentScrollY <= headerHeight) {
        setStickyMenu(true);
      } else if (currentScrollY < lastScrollY.current) {
        setStickyMenu(true);
      } else if (currentScrollY > lastScrollY.current) {
        setStickyMenu(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { logo } = siteSettings;

  return (
    <header
      ref={headerRef}
      className={clsx({
        "sticky z-50 bg-white transition-[top] duration-300 shadow-[0_10px_60px_-10px_rgba(0,0,0,0.2)]": true,
        "-top-40": !stickyMenu,
        "top-0": stickyMenu,
      })}
    >
      <StyledContainer className="flex! items-center! justify-between!">
        <Link href="/" className="flex items-center">
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            priority
            className="h-10 lg:h-13 w-auto my-[13px] lg:my-0"
          />
        </Link>

        <DesktopMenu
          mainMenu={mainMenu}
          visibility={clsx({
            hidden: true,
            "xl:block": isBreakpoint("xl"),
            "lg:block": isBreakpoint("lg"),
          })}
        />

        <MobileMenu
          mainMenu={mainMenu}
          visibility={clsx({
            "xl:hidden": isBreakpoint("xl"),
            "lg:hidden": isBreakpoint("lg"),
          })}
        />
      </StyledContainer>
    </header>
  );
};

export default StyledHeader;
