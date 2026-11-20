import type { Metadata } from "next";
import { notFound } from "next/navigation";
import projectConfig from "../../../../../project.config";
import { caseStudies, getCaseStudy } from "@/data/caseStudies";
import CaseStudyView from "@/components/work/CaseStudyView";

type Params = { slug: string };

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const c = getCaseStudy((await params).slug);
  if (!c) return {};
  const image = c.highlights.items[0]?.shot.src;
  return {
    title: c.meta.title,
    description: c.meta.description,
    keywords: c.meta.keywords,
    alternates: { canonical: `/work/${c.slug}` },
    openGraph: {
      title: c.meta.ogTitle,
      description: c.meta.ogDescription,
      type: "article",
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const c = getCaseStudy((await params).slug);
  if (!c) notFound();
  const base = projectConfig.baseUrl.replace(/\/$/, "");
  const url = `${base}/work/${c.slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: `${c.name} website case study`,
      url,
      about: { "@type": "Organization", name: c.facts[0]?.value ?? c.name, ...(c.liveUrl ? { url: c.liveUrl } : {}) },
      creator: [
        { "@type": "Organization", name: "vinod.lk", url: "https://vinod.lk" },
        { "@type": "Organization", name: "asi.lk", url: "https://asi.lk" },
      ],
      keywords: c.meta.keywords.join(", "),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: base },
        { "@type": "ListItem", position: 2, name: "Work", item: `${base}/work` },
        { "@type": "ListItem", position: 3, name: c.name, item: url },
      ],
    },
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CaseStudyView c={c} />
    </>
  );
}
