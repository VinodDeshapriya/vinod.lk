import type { NavFeature, NavLink } from "@/types/nav";

/**
 * Card details for the header's Services dropdown, by page path. Used when the
 * Main Menu dropdown item in Prismic leaves description / icon / image empty.
 */
export const navDetails: Record<string, Pick<NavLink, "description" | "icon" | "image" | "group">> = {
  "/web-design-sri-lanka": {
    group: "Design & build",
    description: "Custom, mobile-first sites planned around your customers",
    icon: "desktop",
    image: { src: "/images/pages/photos/web-design.jpg" },
  },
  "/website-development-sri-lanka": {
    group: "Design & build",
    description: "Fast, secure builds that match the design exactly",
    icon: "code",
    image: { src: "/images/pages/photos/web-development.jpg" },
  },
  "/logo-design-sri-lanka": {
    group: "Design & build",
    description: "Logos, colours and fonts that look the part",
    icon: "pen",
    image: { src: "/images/pages/photos/logo-design.jpg" },
  },
  "/social-media-marketing-sri-lanka": {
    group: "Design & build",
    description: "On-brand posts, stories and ad creatives every month",
    icon: "phone",
    image: { src: "/images/pages/photos/social-media.jpg" },
  },
  "/custom-software-sri-lanka": {
    group: "Systems & support",
    description: "Booking systems, CRMs and portals your team will use",
    icon: "grid",
    image: { src: "/images/pages/photos/business-systems.jpg" },
  },
  "/ai-solutions-sri-lanka": {
    group: "Systems & support",
    description: "Chatbots and automations that save your team time",
    icon: "sparkles",
    image: { src: "/images/pages/photos/ai.jpg" },
  },
  "/website-care-plans": {
    group: "Systems & support",
    description: "Lifetime support, backups and updates",
    icon: "support",
    image: { src: "/images/pages/photos/website-care.jpg" },
  },
};
// The AI page's older menu URL.
navDetails["/ai-for-business-sri-lanka"] = navDetails["/ai-solutions-sri-lanka"];

/** Fills a link's empty card details from navDetails. */
export function withNavDetails(link: NavLink): NavLink {
  const key = typeof link.href === "string" ? link.href.replace(/\/+$/, "") || "/" : "";
  const d = navDetails[key];
  if (!d) return link;
  return {
    ...link,
    description: link.description || d.description,
    icon: link.icon || d.icon,
    image: link.image || d.image,
    group: link.group || d.group,
  };
}

/** Right-hand dropdown card for a top-level menu item, by its path, when Prismic leaves it empty. */
export const navFeatures: Record<string, NavFeature> = {
  "/services": {
    title: "Recent build: Absoliq, live in about 5 weeks.",
    href: "/#work",
    image: { src: "/images/home/project-absoliq.png", alt: "Absoliq website" },
  },
};
