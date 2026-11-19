"use client";
import clsx from "clsx";
import { type NavItem } from "@/types/nav";
import CloseFill from "atd-icons/dist/CloseFill";
import { useState } from "react";
import MenuItem from "./MenuItem";
import { isBreakpoint } from "./breakpoint";

export interface MenuProps {
  mainMenu?: NavItem[];
  visibility: string;
}

const DesktopMenu = ({ mainMenu, visibility }: MenuProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div
      onClick={closeMobileMenu}
      className={clsx({
        [visibility]: true,
        "fixed h-screen w-screen ms-auto z-100 top-0 right-0 bg-[rgba(0,0,0,0.5)] transition-all ease-linear": true,
        "xl:transition-none xl:static xl:opacity-100 xl:bg-transparent xl:block xl:w-auto xl:h-auto":
          isBreakpoint("xl"),
        "lg:transition-none lg:static lg:opacity-100 lg:bg-transparent lg:block lg:w-auto lg:h-auto":
          isBreakpoint("lg"),
        "opacity-100": mobileMenuOpen,
        "opacity-0 pointer-events-none delay-200": !mobileMenuOpen,
        "xl:pointer-events-auto": isBreakpoint("xl") && !mobileMenuOpen,
        "lg:pointer-events-auto": isBreakpoint("lg") && !mobileMenuOpen,
      })}
    >
      <nav onClick={(e) => e.stopPropagation()}>
        <div
          className={clsx({
            "text-right": true,
            "xl:hidden xl:none": isBreakpoint("xl"),
            "lg:hidden lg:none": isBreakpoint("lg"),
          })}
        >
          <button
            onClick={closeMobileMenu}
            className={clsx({
              "p-4 md:me-6": true,
            })}
          >
            <CloseFill size={24} />
          </button>
        </div>
        <ul
          className={clsx({
            "gap-6 p-4": true,
            "xl:flex 2xl:flex-wrap xl:px-0 xl:py-[19px]": isBreakpoint("xl"),
            "lg:flex xl:flex-wrap lg:px-0 lg:py-[19px]": isBreakpoint("lg"),
          })}
        >
          {mainMenu?.map((item, idx) => {
            return (
              <MenuItem
                key={idx}
                item={item}
                setMobileMenuOpen={setMobileMenuOpen}
                isLast={idx === mainMenu?.length - 1}
                isBreakPointLg={isBreakpoint("lg")}
                isBreakPointXl={isBreakpoint("xl")}
              />
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default DesktopMenu;
