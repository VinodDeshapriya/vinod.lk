/**
 * Site-wide content: navigation, footer and contact details.
 * This replaces the Prismic `settings`, `main_menu` and `menu` documents
 * used in the reference setup — edit here instead of in a CMS.
 */
import { type NavItem } from "@/types/nav";

export const siteSettings = {
  name: "Vinod.lk",
  description: "Vinod.lk — personal website.",
  logo: { src: "/logo.svg", alt: "Vinod.lk", width: 1408, height: 478 },
  email: "hello@vinod.lk",
  phone: "",
  location: "Sri Lanka",
  social: [
    // { label: "LinkedIn", href: "https://www.linkedin.com/in/..." },
  ] as { label: string; href: string }[],
};

/** Main navigation. The LAST item renders as the header CTA button. */
export const mainMenu: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export const footerMenus: { title: string; links: NavItem[] }[] = [
  {
    title: "Pages",
    links: [
      { href: "/about", label: "About" },
      { href: "/work", label: "Work" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Get in touch",
    links: [{ href: "/contact", label: "Contact" }],
  },
];

export const legalLinks: NavItem[] = [
  // { href: "/privacy-policy", label: "Privacy Policy" },
];
