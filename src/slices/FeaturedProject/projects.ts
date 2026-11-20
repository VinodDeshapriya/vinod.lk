/**
 * Fallback content for the "Recent build" carousel, taken from Figma
 * (Component 1, 19321:3317). A project filled in Prismic always wins;
 * these fill any project that is still empty in the CMS.
 */
export type ProjectStatus = "live" | "progress";

export type FallbackProject = {
  name: string;
  logo: { src: string; width: number; height: number };
  headline: string;
  summary: string;
  status: ProjectStatus;
  tags: string[];
  image: string;
  url: string;
};

const dir = "/images/home/projects";

export const fallbackProjects: FallbackProject[] = [
  {
    name: "Absoliq",
    logo: { src: `${dir}/absoliq-logo.png`, width: 152, height: 48 },
    headline:
      "Turn every ad click into a qualified lead with one clear agency website.",
    summary:
      "Absoliq, Colombo. A lead-generating website for a growth marketing agency, designed, built and launched in about 5 weeks. Clear service pages, a strong audit offer and a call to action on every screen. Fast on mobile and ready for Google from day one.",
    status: "live",
    tags: ["Colombo, Sri Lanka", "Agency Website", "Landing Pages", "SEO-ready", "UX/UI Design", "Website Development"],
    image: `${dir}/absoliq.webp`,
    url: "/work/absoliq",
  },
  {
    name: "Matara Bodhiya",
    logo: { src: `${dir}/matara-bodhiya-logo.png`, width: 174, height: 48 },
    headline:
      "A calm website that brings a sacred Matara landmark closer to every devotee.",
    summary:
      "Matara Bodhiya, Matara. A bilingual website for one of the Matara district's most important Buddhist sites, designed, built and launched in 4 weeks. Calm, easy-to-read pages in English and Sinhala, with a Prismic CMS so the temple team can add new projects themselves.",
    status: "live",
    tags: ["Matara, Sri Lanka", "Religious & Community", "UX/UI Design", "English & Sinhala", "Prismic CMS", "Mobile-first", "Website Development"],
    image: `${dir}/matara-bodhiya.webp`,
    url: "/work/matara-bodhiya",
  },
  {
    name: "Enjoy Sri Lanka",
    logo: { src: `${dir}/enjoy-sri-lanka-logo.png`, width: 156, height: 48 },
    headline:
      "A travel website that makes planning a Sri Lanka trip feel as easy as the holiday.",
    summary:
      "Enjoy Sri Lanka, Nugegoda. An inbound tourism website for international travellers, offering tailor-made tours, travel packages, day tours and things to do across Sri Lanka, designed, built and launched in 5 weeks. Clear tour pages and an easy enquiry flow on every screen.",
    status: "live",
    tags: ["Nugegoda, Sri Lanka", "Inbound Tourism", "Tours & Travel Packages", "UX/UI Design", "Mobile-first", "Website Development", "English & Spanish"],
    image: `${dir}/enjoy-sri-lanka.webp`,
    url: "/work/enjoy-sri-lanka",
  },
  {
    name: "Janangana",
    logo: { src: `${dir}/janangana-logo.png`, width: 213, height: 48 },
    headline:
      "A clear website that turns a full design-build firm into one easy story.",
    summary:
      "Janangana (Pvt) Ltd, Matale. A corporate website for an integrated design-build firm, currently in progress. Eight services, from architecture and engineering to interiors and project management, laid out so clients find the right expert fast.",
    status: "progress",
    tags: ["Matale, Sri Lanka", "Engineering & Architecture", "Corporate Website", "UX/UI Design", "Mobile-first", "Website Development"],
    image: `${dir}/janangana.webp`,
    url: "/work/janangana",
  },
  {
    name: "Ceylon Tracks",
    logo: { src: `${dir}/ceylon-tracks-logo.png`, width: 36, height: 48 },
    headline:
      "A travel website that lets every guest shape their own Sri Lanka story.",
    summary:
      "Ceylon Tracks, Colombo. A tour company website for tailor-made Sri Lanka journeys, where I designed the full UX and UI. Curated itineraries, a custom-journey builder and an enquiry button on every screen.",
    status: "live",
    tags: ["Colombo, Sri Lanka", "Inbound Tourism", "Tours & Travel Packages", "UX/UI Design", "Mobile-first"],
    image: `${dir}/ceylon-tracks.webp`,
    url: "https://www.ceylontracks.com/",
  },
  {
    name: "Somerset Mirissa Blue",
    logo: { src: `${dir}/somerset-mirissa-blue-logo.png`, width: 107, height: 48 },
    headline:
      "A hotel website that makes a sea-view stay in Mirissa easy to book.",
    summary:
      "Somerset Mirissa Blue, Mirissa. A booking-led website for a boutique hilltop hotel facing Mirissa Beach, designed, built and launched in 6 weeks. Rooms, dining and spa pages, with a date picker and Book Now button always in reach.",
    status: "live",
    tags: ["Mirissa, Sri Lanka", "Hospitality", "Boutique Hotel", "UX/UI Design", "Mobile-first", "Website Development"],
    image: `${dir}/somerset-mirissa-blue.webp`,
    url: "/work/somerset-mirissa-blue",
  },
];

const key = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "").replace(/s$/, "");

export const findFallback = (name: string | null | undefined) =>
  name ? fallbackProjects.find((p) => key(p.name) === key(name)) : undefined;
