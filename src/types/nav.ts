import { Url } from "next/dist/shared/lib/router/router";

export type NavLink = {
  href?: string | null | Url;
  label?: string;
  target?: string;
  /** Dropdown cards only: short line under the title. */
  description?: string;
  /** Dropdown cards only: a key of src/components/ui/SliceIcon.tsx. */
  icon?: string;
  /** Dropdown cards only: thumbnail shown on desktop. */
  image?: { src: string; alt?: string };
  /** Dropdown cards only: column heading; items sharing it share a column. */
  group?: string;
};

export type DropColumn = NavLink & {
  links?: NavLink[];
  parentHref?: string | null | Url;
  parentLabel?: string;
  parentTarget?: string;
};

export type NavFeature = { title: string; href: string; image?: { src: string; alt?: string } };

export type NavItem = NavLink & {
  drop?: DropColumn[];
  /** Right-hand card in the desktop dropdown. */
  feature?: NavFeature;
};
