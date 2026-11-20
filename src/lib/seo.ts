import { asText, isFilled, type Content } from "@prismicio/client";
import getFullUrl from "@/utils/getFullUrl";
import type { SiteData } from "@/lib/layoutData";

type Page = Content.PageDocument;
type Thing = Record<string, unknown>;

const BUSINESS_ID = `${getFullUrl("/")}#business`;
const PERSON_ID = `${getFullUrl("/about")}#vinod`;

/** Page title: titles that already name the site are used as-is, the rest get " | Vinod.lk". */
export const pageTitle = (page: Page) => {
  const t = page.data.meta_title || page.data.title || "";
  if (!t) return undefined;
  return /vinod/i.test(t) ? { absolute: t } : t;
};

export const pagePath = (page: Page) =>
  page.uid === "home" ? "/" : `/${page.uid}`;

const faqSchema = (page: Page): Thing | null => {
  const faqs = page.data.slices
    .flatMap((s) =>
      s.slice_type === "faq" && "faqs" in s.primary ? s.primary.faqs : [],
    )
    .filter((f) => f.question && isFilled.richText(f.answer));
  if (!faqs.length) return null;
  return {
    "@type": "FAQPage",
    "@id": `${getFullUrl(pagePath(page))}#faq`,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: asText(f.answer) },
    })),
  };
};

const realLinks = (site: SiteData) =>
  (site.social ?? []).map((s) => s.href).filter((h) => /^https?:\/\//.test(h));

const business = (site: SiteData): Thing => ({
  "@type": "ProfessionalService",
  "@id": BUSINESS_ID,
  name: site.name,
  url: getFullUrl("/"),
  logo: getFullUrl("/logo.svg"),
  image: getFullUrl("/logo.svg"),
  description:
    "UX-led web design, website development, branding and custom business systems for businesses in Sri Lanka.",
  email: site.email,
  telephone: site.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Matara",
    addressCountry: "LK",
  },
  areaServed: [{ "@type": "Country", name: "Sri Lanka" }],
  founder: { "@id": PERSON_ID },
  priceRange: "LKR 80,000+",
  ...(realLinks(site).length ? { sameAs: realLinks(site) } : {}),
});

const person = (site: SiteData): Thing => ({
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Vinod Deshapriya",
  jobTitle: "UX Engineer",
  url: getFullUrl("/about"),
  worksFor: { "@id": BUSINESS_ID },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Matara",
    addressCountry: "LK",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Sri Jayewardenepura",
  },
  knowsAbout: [
    "User experience design",
    "UI design",
    "Web development",
    "Design systems",
  ],
  ...(realLinks(site).length ? { sameAs: realLinks(site) } : {}),
});

/** JSON-LD for a Prismic page: business on every page, plus page-specific types and FAQs. */
export function pageSchema(page: Page, site: SiteData) {
  const url = getFullUrl(pagePath(page));
  const name = page.data.meta_title || page.data.title || site.name;
  const graph: Thing[] = [business(site)];

  if (page.uid === "home") {
    graph.push({
      "@type": "WebSite",
      "@id": `${getFullUrl("/")}#website`,
      name: site.name,
      url: getFullUrl("/"),
      publisher: { "@id": BUSINESS_ID },
    });
  } else {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: getFullUrl("/"),
        },
        {
          "@type": "ListItem",
          position: 2,
          name: page.data.title || name,
          item: url,
        },
      ],
    });
  }

  if (page.uid === "about") {
    graph.push(person(site), {
      "@type": "ProfilePage",
      url,
      name,
      mainEntity: { "@id": PERSON_ID },
    });
  } else if (page.uid === "contact") {
    graph.push({
      "@type": "ContactPage",
      url,
      name,
      about: { "@id": BUSINESS_ID },
    });
  } else {
    graph.push({
      "@type": "WebPage",
      url,
      name,
      ...(page.data.meta_description
        ? { description: page.data.meta_description }
        : {}),
      isPartOf: { "@id": `${getFullUrl("/")}#website` },
    });
  }

  const faq = faqSchema(page);
  if (faq) graph.push(faq);

  return { "@context": "https://schema.org", "@graph": graph };
}
