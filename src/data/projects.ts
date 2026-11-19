export interface Project {
  slug: string;
  name: string;
  /** Only projects with `featured` content can be selected in the Recent build tabs. */
  featured?: {
    logo: { src: string; width: number; height: number };
    headline: string;
    summary: string;
    tags: string[];
    live?: boolean;
    image: { src: string; width: number; height: number; alt: string };
    href: string;
  };
}

export const projects: Project[] = [
  {
    slug: "absoliq",
    name: "Absoliq",
    featured: {
      logo: { src: "/images/clients/absoliq.png", width: 152, height: 30 },
      headline:
        "Turn every ad click into a qualified lead with one clear agency website.",
      summary:
        "Absoliq, Colombo. A lead-generating website for a growth marketing agency, designed, built and launched in about 5 weeks. Clear service pages, a strong audit offer and a call to action on every screen. Fast on mobile and ready for Google from day one.",
      live: true,
      tags: [
        "Colombo, Sri Lanka",
        "Agency Website",
        "Landing Pages",
        "SEO-ready",
        "UX/UI Design",
        "Website Development",
      ],
      image: {
        src: "/images/home/project-absoliq.png",
        width: 771,
        height: 609,
        alt: "Absoliq homepage in a browser window",
      },
      href: "/work/absoliq",
    },
  },
  // Case-study content for these still needs to be designed in Figma.
  { slug: "matara-bodhiya", name: "Matara Bodhiya" },
  { slug: "enjoy-sri-lanka", name: "Enjoy Sri Lanka" },
  { slug: "janangana", name: "Janangana" },
  { slug: "ceylon-track", name: "Ceylon Track" },
  { slug: "somerset-mirissa-blue", name: "Somerset Mirissa Blue" },
];
