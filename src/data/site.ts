/**
 * FALLBACK site-wide content, used when the Prismic Settings / Main Menu /
 * Footer Menu documents are empty. Edit those in Prismic instead.
 *
 * Site-wide content: navigation, footer and contact details.
 * This replaces the Prismic `settings`, `main_menu` and `menu` documents
 * used in the reference setup — edit here instead of in a CMS.
 */
import { type NavItem } from "@/types/nav";
import { services } from "./services";

export const siteSettings = {
  name: "Vinod.lk",
  description:
    "Websites, brands and systems that help Sri Lankan businesses grow.",
  logo: { src: "/logo.svg", alt: "Vinod.lk", width: 1408, height: 478 },
  logoWhite: { src: "/logo-white.svg", alt: "Vinod.lk", width: 1408, height: 478 },
  email: "info@vinod.lk",
  phone: "+94 77 50 377 38",
  phones: ["+94 77 50 377 38", "+94 70 50 877 38"],
  location: "Matara, Sri Lanka",
  /** TODO: real profile URLs (Figma: "Social links [ADD: URLs]") */
  social: [
    { label: "Facebook", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "TikTok", href: "#" },
    { label: "YouTube", href: "#" },
  ] as { label: string; href: string }[],
};

/** Main navigation (centre of the header). */
export const mainMenu: NavItem[] = [
  {
    href: "/services",
    label: "Services",
    drop: [
      {
        links: services.map(({ title, href }) => ({ href, label: title })),
      },
    ],
  },
  { href: "/work", label: "Work" },
  { href: "/#process", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

/** Header call-to-action button (right side of the header). */
export const headerCta = {
  label: "Call +94 77 50 377 38",
  href: "tel:+94775037738",
};

export const footerMenus: { title: string; links: NavItem[] }[] = [
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/work", label: "Work" },
      { href: "/pricing", label: "Pricing" },
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { href: "/web-design-sri-lanka", label: "Web Design" },
      { href: "/ecommerce-website-sri-lanka", label: "Ecommerce Websites" },
      { href: "/logo-design-sri-lanka", label: "Logo & Branding" },
      { href: "/social-media-marketing-sri-lanka", label: "Social Media Marketing" },
      { href: "/custom-software-sri-lanka", label: "Custom Software" },
      { href: "/ai-for-business-sri-lanka", label: "AI Solutions" },
    ],
  },
  {
    title: "Industries",
    links: [
      { href: "/industries/hotels-tourism", label: "Hotels & Tourism" },
      { href: "/industries/restaurants", label: "Restaurants" },
      { href: "/industries/retail-fashion", label: "Retail & Fashion" },
      { href: "/industries/clinics-healthcare", label: "Clinics & Healthcare" },
      { href: "/industries/construction", label: "Construction" },
      { href: "/industries/education", label: "Education" },
    ],
  },
];

export const legalLinks: NavItem[] = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
];
