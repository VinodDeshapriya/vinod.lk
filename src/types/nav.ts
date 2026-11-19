import { Url } from "next/dist/shared/lib/router/router";

export type NavLink = {
  href?: string | null | Url;
  label?: string;
  target?: string;
};

export type DropColumn = NavLink & {
  links?: NavLink[];
  parentHref?: string | null | Url;
  parentLabel?: string;
  parentTarget?: string;
};

export type NavItem = NavLink & {
  drop?: DropColumn[];
};
