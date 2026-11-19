"use client";
import {
  type Dispatch,
  type FC,
  type ReactNode,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type DropColumn, type NavItem } from "@/types/nav";
import clsx from "clsx";
import { isBreakpoint } from "./breakpoint";
import ChevronDown from "atd-icons/dist/ChevronDown";
import StyledContainer from "@/components/ui/StyledContainer";

// Normalizes away a trailing slash (except for the root "/") so
// "/about-us" and "/about-us/" compare as the same page.
const normalizePath = (path: string) =>
  path.length > 1 ? path.replace(/\/+$/, "") : path;

const isActivePath = (pathname: string, href?: string | null) => {
  if (!href || typeof href !== "string") return false;
  return normalizePath(pathname) === normalizePath(href);
};

interface DropGroup {
  parentHref?: DropColumn["parentHref"];
  parentLabel?: string;
  parentTarget?: string;
  columns: DropColumn[];
}

// Columns are grouped by consecutive entries sharing the same parent title
// (e.g. "Residential Electrician"), so content editors group columns simply
// by setting the same Parent Link value on each row that belongs together.
const groupDropColumns = (drop: DropColumn[] = []): DropGroup[] => {
  const groups: DropGroup[] = [];

  for (const column of drop) {
    const last = groups[groups.length - 1];
    if (last && (last.parentLabel ?? "") === (column.parentLabel ?? "")) {
      last.columns.push(column);
      continue;
    }
    groups.push({
      parentHref: column.parentHref,
      parentLabel: column.parentLabel,
      parentTarget: column.parentTarget,
      columns: [column],
    });
  }

  return groups;
};

// Hover-to-open should only apply on the desktop nav (lg breakpoint and up).
// On mobile/tablet the menu is a click-to-expand accordion, so hover must
// never trigger it there.
const HOVER_CAPABLE_QUERY = "(min-width: 1024px)";

const subscribeToHoverCapable = (callback: () => void) => {
  const mql = window.matchMedia(HOVER_CAPABLE_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
};

const getHoverCapableSnapshot = () =>
  window.matchMedia(HOVER_CAPABLE_QUERY).matches;

// No window on the server, so hover-to-open is never assumed there.
const getHoverCapableServerSnapshot = () => false;

interface MenuItemProps {
  item: NavItem;
  setMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
  isLast?: boolean;
  isBreakPointXl?: boolean;
  isBreakPointLg?: boolean;
}

const MenuItem: FC<MenuItemProps> = ({
  item = {},
  setMobileMenuOpen,
  isLast,
  isBreakPointXl = false,
  isBreakPointLg = false,
}) => {
  const { href, target, label, drop } = item;
  const pathname = usePathname();
  const isActive = isActivePath(
    pathname,
    typeof href === "string" ? href : undefined,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set());
  // Reads the media query as an external store instead of useState+useEffect
  // so the server snapshot (false, no window) and the client's first render
  // agree, avoiding a hydration mismatch on hover/click-menu behavior.
  const isHoverCapable = useSyncExternalStore(
    subscribeToHoverCapable,
    getHoverCapableSnapshot,
    getHoverCapableServerSnapshot,
  );
  const liRef = useRef<HTMLLIElement>(null);

  const hasDropdown = !!drop?.length;
  const isMegaMenu = (drop?.length ?? 0) > 1;
  const dropGroups = groupDropColumns(drop);
  // If any group in this dropdown has more than 2 columns, 2-column groups
  // elsewhere in the same dropdown fall back to default left placement
  // instead of being centred, since centring would only highlight the
  // misalignment against that wider group's grid.
  const hasWideGroup = dropGroups.some((g) => g.columns.length > 2);

  const closeMenu = () => {
    setIsOpen(false);
    setOpenKeys(new Set());
  };
  const openMenu = () => setIsOpen(true);
  const toggleDropdownMenu = () => (isOpen ? closeMenu() : openMenu());

  // Navigating via any link should close this dropdown AND the whole mobile
  // menu overlay (via its own slide/opacity transition), instead of leaving
  // the overlay open or having it vanish instantly on route change.
  const handleNavigate = () => {
    closeMenu();
    setMobileMenuOpen(false);
  };

  const handleMouseEnter = () => {
    if (isHoverCapable) openMenu();
  };
  const handleMouseLeave = () => {
    if (isHoverCapable) closeMenu();
  };

  // Nested accordion state (mobile/tablet only) for group and column
  // headings that have sub-links. On desktop everything stays expanded,
  // so isKeyOpen short-circuits to true via isHoverCapable.
  const isKeyOpen = (key: string) => isHoverCapable || openKeys.has(key);

  // Groups behave as an accordion: opening one collapses any other open
  // group (and its nested column state) so only one stays expanded at a time.
  const toggleGroupKey = (groupIdx: number) => {
    const key = `group-${groupIdx}`;
    setOpenKeys((prev) => {
      if (prev.has(key)) {
        const next = new Set<string>();
        prev.forEach((k) => {
          if (k !== key && !k.startsWith(`col-${groupIdx}-`)) next.add(k);
        });
        return next;
      }
      return new Set([key]);
    });
  };

  // Columns within a group also behave as an accordion: opening one
  // collapses any other open column in that same group.
  const toggleColumnKey = (groupIdx: number, colIdx: number) => {
    const key = `col-${groupIdx}-${colIdx}`;
    setOpenKeys((prev) => {
      const next = new Set<string>();
      prev.forEach((k) => {
        if (k.startsWith(`col-${groupIdx}-`)) return;
        next.add(k);
      });
      if (!prev.has(key)) next.add(key);
      return next;
    });
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (!liRef.current?.contains(e.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <li
      ref={liRef}
      className={clsx({
        "text-text-heading pointer-events-auto main-nav-item": true,
        "flex flex-col w-full xl:w-auto items-center justify-center": true,
        "items-center justify-center": !isLast,
        "items-start": isLast,
        "xl:mt-0!": isLast && isBreakpoint("xl"),
        "lg:mt-0!": isLast && isBreakpoint("lg"),
        relative: !isMegaMenu,
      })}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger row */}
      <div
        className={clsx(
          "flex items-center w-full transition-colors duration-300 ease-in-out",
          {
            "py-3.5 lg:py-0 px-3 lg:px-0 border-t border-t-border-primary lg:border-0":
              !isLast,
            "bg-offwhite-2": isOpen && !isHoverCapable,
          },
        )}
      >
        <Link
          href={href ?? "/"}
          target={target}
          className={clsx({
            "btn btn-primary w-full!": isLast,
            "flex-1 flex items-center hover:text-primary-light": !isLast,
            "text-primary-light hover:text-primary-light": !isLast && isActive,
            "text-text-heading": !isLast && !isActive,
            "lg:py-1": isBreakPointLg,
            "xl:py-1": isBreakPointXl,
          })}
          onMouseEnter={handleMouseEnter}
          onClick={handleNavigate}
        >
          <span className="block whitespace-nowrap text-body-small lg:text-body-x-small">
            {label}
          </span>
        </Link>
        {hasDropdown && (
          <button
            className="lg:p-1 lg:ml-0.5"
            onClick={() => {
              toggleDropdownMenu();
            }}
            aria-expanded={isOpen}
            aria-label={`Toggle ${label} submenu`}
          >
            <ChevronDown
              size={16}
              className={clsx("transition-transform duration-200", {
                "rotate-180": isOpen,
              })}
            />
          </button>
        )}
      </div>

      {hasDropdown && (
        <div
          className={clsx({
            "top-full w-full transition-[background-color] duration-300 ease-in-out": true,
            "lg:absolute": isBreakPointLg,
            "xl:absolute": isBreakPointXl,
            "lg:shadow-xl lg:rounded-2xl lg:w-max lg:left-1/2 lg:-translate-x-1/2":
              !isMegaMenu && isBreakPointLg,
            "xl:shadow-xl xl:rounded-2xl xl:w-max xl:left-1/2 xl:-translate-x-1/2":
              !isMegaMenu && isBreakPointXl,
            "lg:shadow-[0_25px_20px_-15px_rgba(0,0,0,0.15)]":
              isMegaMenu && isBreakPointLg,
            "xl:shadow-[0_25px_20px_-15px_rgba(0,0,0,0.15)]":
              isMegaMenu && isBreakPointXl,
            "opacity-0 pointer-events-none -translate-y-2": !isOpen,
            "opacity-100 translate-y-0 pointer-events-auto! z-99": isOpen,
            "left-0 -top-px lg:-mt-5": isMegaMenu,
            "bg-offwhite-2": isOpen && !isHoverCapable,
          })}
          onClick={(e) => e.stopPropagation()}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className={clsx(
              "transition-[max-h] duration-300 ease-in-out",
              {
                "max-h-0": !isOpen,
                "max-h-500": isOpen,
              },
            )}
          >
            <div
              className={clsx(" lg:mt-5", {
                "lg:bg-white lg:shadow-[0px_0px_8px_0px_#00000026] rounded-sm min-w-68 overflow-hidden":
                  !isMegaMenu,
                "lg:bg-offwhite-2": isMegaMenu,
              })}
            >
              <DropDownWrapper isMegaMenu={isMegaMenu}>
                {dropGroups.map((group, gi) => {
                  const groupKey = `group-${gi}`;
                  const groupHasToggle =
                    !isHoverCapable &&
                    !!group.parentLabel &&
                    group.columns.length > 0;
                  return (
                    <div
                      key={gi}
                      className={clsx({
                        "lg:border-t lg:border-border-primary": gi > 0,
                        "lg:py-8": isMegaMenu,
                      })}
                    >
                      {group.parentLabel && (
                        <div
                          className={clsx(
                            "flex items-center justify-between lg:block text-body-small lg:font-bold! text-text-heading lg:text-primary-light lg:underline lg:underline-offset-4 px-3 py-3.5",
                            {
                              "lg:grid lg:grid-cols-4":
                                isMegaMenu &&
                                group.columns.length <= 2 &&
                                !hasWideGroup,
                            },
                            {
                              "lg:mb-5 lg:px-0 lg:py-0": isMegaMenu,
                            },
                            {
                              "lg:mb-0 lg:px-2 lg:py-3.5 hover:bg-offwhite transition-colors duration-200 ease-in-out":
                                !isMegaMenu,
                            },
                          )}
                        >
                          <div
                            className={clsx({
                              "lg:col-start-2":
                                isMegaMenu &&
                                group.columns.length <= 2 &&
                                !hasWideGroup,
                            })}
                          >
                            {group.parentHref ? (
                              <Link
                                href={group.parentHref}
                                target={group.parentTarget}
                                className="inline-block"
                                onClick={handleNavigate}
                              >
                                {group.parentLabel}
                              </Link>
                            ) : (
                              <span className="block">{group.parentLabel}</span>
                            )}
                          </div>
                          {groupHasToggle && (
                            <button
                              type="button"
                              onClick={() => toggleGroupKey(gi)}
                              aria-expanded={isKeyOpen(groupKey)}
                              aria-label={`Toggle ${group.parentLabel} submenu`}
                              className="h-fit-content"
                            >
                              <ChevronDown
                                size={24}
                                className={clsx(
                                  "transition-transform duration-200",
                                  {
                                    "rotate-180": isKeyOpen(groupKey),
                                  },
                                )}
                              />
                            </button>
                          )}
                        </div>
                      )}
                      <div
                        className={clsx(
                          "lg:gap-5 pl-5 overflow-hidden transition-[max-h] duration-300 ease-in-out",
                          {
                            grid: isMegaMenu,
                            "lg:grid-cols-4":
                              isMegaMenu && group.columns.length !== 3,
                            "lg:grid-cols-3":
                              isMegaMenu && group.columns.length === 3,
                            "max-h-0 pointer-events-none":
                              groupHasToggle && !isKeyOpen(groupKey),
                            "max-h-500": !groupHasToggle || isKeyOpen(groupKey),
                          },
                          {
                              "lg:pl-0": isMegaMenu,
                            },
                            {
                              "lg:px-2 lg:py-3.5 hover:bg-offwhite transition-colors duration-200 ease-in-out":
                                !isMegaMenu,
                            },
                        )}
                      >
                        {group.columns.map(
                          ({ href: dropHref, links, label: dropLabel }, i) => {
                            const colKey = `col-${gi}-${i}`;
                            const colHasToggle =
                              !isHoverCapable && !!dropLabel && !!links?.length;
                            return (
                              <div
                                key={i}
                                className={clsx({
                                  "min-w-35": isMegaMenu,
                                  "lg:col-start-2":
                                    isMegaMenu &&
                                    group.columns.length <= 2 &&
                                    !hasWideGroup &&
                                    i === 0,
                                  "lg:col-start-3":
                                    isMegaMenu &&
                                    group.columns.length === 2 &&
                                    !hasWideGroup &&
                                    i === 1,
                                })}
                              >
                                {dropLabel && (
                                  <div className="flex gap-1 justify-between lg:block text-body-small lg:font-bold! text-text-heading lg:underline lg:underline-offset-4 lg:mb-5 px-3 py-3.5 lg:px-0 lg:py-0">
                                    {dropHref ? (
                                      <Link
                                        href={dropHref}
                                        className="block "
                                        onClick={handleNavigate}
                                      >
                                        {dropLabel}
                                      </Link>
                                    ) : (
                                      <span className="block">{dropLabel}</span>
                                    )}
                                    {colHasToggle && (
                                      <button
                                        type="button"
                                        onClick={() => toggleColumnKey(gi, i)}
                                        aria-expanded={isKeyOpen(colKey)}
                                        aria-label={`Toggle ${dropLabel} submenu`}
                                        className="h-fit-content"
                                      >
                                        <ChevronDown
                                          size={24}
                                          className={clsx(
                                            "transition-transform duration-200",
                                            {
                                              "rotate-180": isKeyOpen(colKey),
                                            },
                                          )}
                                        />
                                      </button>
                                    )}
                                  </div>
                                )}
                                <div
                                  className={clsx(
                                    "flex flex-col lg:gap-5 pl-2 lg:pl-0 overflow-hidden transition-[max-h] duration-300 ease-in-out",
                                    {
                                      "max-h-0 pointer-events-none":
                                        colHasToggle && !isKeyOpen(colKey),
                                      "max-h-500":
                                        !colHasToggle || isKeyOpen(colKey),
                                    },
                                  )}
                                >
                                  {links?.map((sub, j) => {
                                    const isSubActive = isActivePath(
                                      pathname,
                                      typeof sub.href === "string"
                                        ? sub.href
                                        : undefined,
                                    );
                                    return (
                                      <Link
                                        key={j}
                                        href={sub.href ?? "/"}
                                        target={sub.target}
                                        className={clsx(
                                          "block py-3.5 lg:py-0 text-body-small transition-colors duration-300 ease-in-out hover:text-primary-dark px-3 lg:px-0",
                                          isSubActive
                                            ? "text-primary-light hover:text-primary-light"
                                            : "text-text-heading",
                                        )}
                                        onClick={handleNavigate}
                                      >
                                        {sub.label}
                                      </Link>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          },
                        )}
                      </div>
                    </div>
                  );
                })}
              </DropDownWrapper>
            </div>
          </div>
        </div>
      )}
    </li>
  );
};

export default MenuItem;

const DropDownWrapper = ({
  isMegaMenu,
  children,
}: {
  isMegaMenu: boolean;
  children: ReactNode;
}) => {
  if (isMegaMenu) {
    return (
      <StyledContainer
        paddingX={false}
        className="pl-5 lg:px-10 xl:px-20 max-w-360!"
      >
        {children}
      </StyledContainer>
    );
  }

  return children;
};
