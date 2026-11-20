import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import { asImageSrc, asLink, type Content } from "@prismicio/client";
import projectConfig from "../../../../../project.config";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { getLayoutData } from "@/lib/layoutData";
import { getCaseStudyDocs } from "@/lib/caseStudies";
import { caseStudies, getCaseStudy } from "@/data/caseStudies";
import CaseStudyView from "@/components/work/CaseStudyView";

type Params = { slug: string };

const getDoc = (uid: string) =>
  createClient()
    .getByUID("case_study", uid)
    .catch(() => null);

export async function generateStaticParams() {
  const docs = await getCaseStudyDocs();
  const slugs = new Set([...docs.map((d) => d.uid), ...caseStudies.map((c) => c.slug)]);
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getDoc(slug);
  if (doc) {
    const d = doc.data;
    const image = asImageSrc(d.meta_image) ?? asImageSrc(d.thumbnail);
    return {
      title: d.meta_title || `${d.name} Case Study`,
      description: d.meta_description ?? undefined,
      keywords: d.meta_keywords?.split(",").map((k) => k.trim()).filter(Boolean),
      alternates: { canonical: `/work/${doc.uid}` },
      openGraph: {
        title: d.meta_title || d.name || undefined,
        description: d.meta_description ?? undefined,
        type: "article",
        images: image ? [{ url: image }] : undefined,
      },
    };
  }
  const c = getCaseStudy(slug);
  if (!c) return {};
  const image = c.highlights.items[0]?.shot.src;
  return {
    title: c.meta.title,
    description: c.meta.description,
    keywords: c.meta.keywords,
    alternates: { canonical: `/work/${c.slug}` },
    openGraph: { title: c.meta.ogTitle, description: c.meta.ogDescription, type: "article", images: image ? [{ url: image }] : undefined },
  };
}

function jsonLd(name: string, slug: string, liveUrl?: string, keywords?: string) {
  const base = projectConfig.baseUrl.replace(/\/$/, "");
  const url = `${base}/work/${slug}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: `${name} website case study`,
      url,
      about: { "@type": "Organization", name, ...(liveUrl ? { url: liveUrl } : {}) },
      creator: [
        { "@type": "Organization", name: "vinod.lk", url: "https://vinod.lk" },
        { "@type": "Organization", name: "asi.lk", url: "https://asi.lk" },
      ],
      ...(keywords ? { keywords } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: base },
        { "@type": "ListItem", position: 2, name: "Work", item: `${base}/work` },
        { "@type": "ListItem", position: 3, name, item: url },
      ],
    },
  ];
}

const LdScript = ({ data }: { data: unknown }) => (
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
);

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const doc: Content.CaseStudyDocument | null = await getDoc(slug);

  if (doc) {
    const { settings } = await getLayoutData();
    const d = doc.data;
    return (
      <article>
        <LdScript data={jsonLd(d.name || doc.uid, doc.uid, asLink(d.live_url) ?? undefined, d.meta_keywords ?? undefined)} />
        <SliceZone slices={d.slices} components={components} context={{ settings, caseStudy: doc }} />
      </article>
    );
  }

  // Local content, until the Prismic page is published.
  const c = getCaseStudy(slug);
  if (!c) notFound();
  return (
    <>
      <LdScript data={jsonLd(c.name, c.slug, c.liveUrl, c.meta.keywords.join(", "))} />
      <CaseStudyView c={c} />
    </>
  );
}
