"use client";
import clsx from "clsx";
import CloseFill from "atd-icons/dist/CloseFill";
import { useState } from "react";
import MenuItem from "./MenuItem";
import { MenuProps } from "./DesktopMenu";
import { MenuFill } from "atd-icons";
import { isBreakpoint } from "./breakpoint";
import StyledButton from "../StyledButton";
import type { HeaderCta } from "@/lib/layoutData";

const MobileMenu = ({
  mainMenu,
  visibility,
  headerCta,
}: MenuProps & { headerCta: HeaderCta }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  const closeMobileMenu = () => setMobileMenuOpen(false);

  /**
   * DO NOT ADD ANY STYLES THAT CHANGE THE HEIGHT OF THIS HEADER TAG
   * CHANGING THE HEIGHT DURING STICKY HAS A BUG THAT MAKE THE PAGE SCROLL BACK AND FORTH !!!
   */
  return (
    <div className={clsx({ [visibility]: true, "flex items-center": true })}>
      <button
        className={clsx({
          "flex items-center": true,
          "xl:hidden": isBreakpoint("xl"),
          "lg:hidden": isBreakpoint("lg"),
        })}
        aria-label="Open mobile menu"
        onClick={toggleMenu}
      >
        <MenuFill size={32} className="text-2xl cursor-pointer" />
      </button>

      <div
        className={clsx({
          [visibility]: true,
          "fixed h-screen w-screen ms-auto z-100 top-0 right-0 bg-[rgba(0,0,0,0.5)] transition-all ease-linear overflow-hidden": true,
          "xl:transition-none xl:static xl:opacity-100 xl:bg-transparent xl:block xl:w-auto xl:h-auto":
            isBreakpoint("xl"),
          "lg:transition-none lg:static lg:opacity-100 lg:bg-transparent lg:block lg:w-auto lg:h-auto":
            isBreakpoint("lg"),
          "opacity-100": mobileMenuOpen,
          "pointer-events-none": !mobileMenuOpen,
          "opacity-0 xl:pointer-events-auto":
            isBreakpoint("xl") && !mobileMenuOpen,
          "opacity-0 lg:pointer-events-auto":
            isBreakpoint("lg") && !mobileMenuOpen,
        })}
        onClick={closeMobileMenu}
      >
        <nav
          className={clsx({
            "bg-white h-screen overflow-y-auto w-80 md:w-110 ms-auto transition-transform ease-linear pointer-events-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden": true,
            "xl:transition-none! xl:translate-x-0! xl:w-auto xl:h-auto xl:overflow-visible":
              isBreakpoint("xl"),
            "lg:transition-none! lg:translate-x-0! lg:w-auto lg:h-auto lg:overflow-visible":
              isBreakpoint("lg"),
            "translate-x-0 delay-200 px-4 pt-4.5 pb-6 md:px-10": mobileMenuOpen,
            "translate-x-full": !mobileMenuOpen,
          })}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={clsx({
              "text-right h-8 mb-4": true,
              "xl:hidden xl:none": isBreakpoint("xl"),
              "lg:hidden lg:none": isBreakpoint("lg"),
            })}
          >
            <button
              onClick={closeMobileMenu}
              // className={clsx({
              //   "p-4 md:me-6": true,
              // })}
            >
              <CloseFill size={32} />
            </button>
          </div>
          <ul
            className={clsx({
              "bg-amber-150 gap-6 md:gap-10 ": true,
              "xl:flex 2xl:flex-wrap xl:p-0": isBreakpoint("xl"),
              "lg:flex xl:flex-wrap lg:p-0": isBreakpoint("lg"),
            })}
          >
            {mainMenu?.map((item, idx) => {
              return (
                <MenuItem
                  key={idx}
                  item={item}
                  setMobileMenuOpen={setMobileMenuOpen}
                  isLast={false}
                  isBreakPointLg={isBreakpoint("lg")}
                  isBreakPointXl={isBreakpoint("xl")}
                />
              );
            })}
          </ul>
          <div className="mt-6 lg:hidden">
            <StyledButton
              label={headerCta.label}
              link={headerCta.href}
              variant="Secondary"
              className="w-full"
            />
          </div>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
