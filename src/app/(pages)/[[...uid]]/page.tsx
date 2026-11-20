import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import { isFilled } from "@prismicio/client";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { getLayoutData } from "@/lib/layoutData";
import { pagePath, pageSchema, pageTitle } from "@/lib/seo";

type Params = { uid?: string[] };

const uidFrom = (params: Params) => params.uid?.at(-1) ?? "home";

async function getPage(uid: string) {
  return createClient()
    .getByUID("page", uid)
    .catch(() => null);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const page = await getPage(uidFrom(await params));
  if (!page) return {};
  const { meta_title, meta_description, meta_image, title } = page.data;
  const ogTitle = meta_title || title || undefined;
  const images = isFilled.image(meta_image)
    ? [{ url: meta_image.url }]
    : undefined;
  return {
    title: pageTitle(page),
    description: meta_description,
    alternates: { canonical: pagePath(page) },
    openGraph: {
      type: "website",
      siteName: "Vinod.lk",
      locale: "en_LK",
      url: pagePath(page),
      title: ogTitle,
      description: meta_description || undefined,
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: ogTitle,
      description: meta_description || undefined,
      images,
    },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const page = await getPage(uidFrom(await params));
  if (!page) notFound();
  const { settings, site } = await getLayoutData();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pageSchema(page, site)),
        }}
      />
      <SliceZone
        slices={page.data.slices}
        components={components}
        context={{ settings }}
      />
    </>
  );
}

export async function generateStaticParams() {
  const pages = await createClient()
    .getAllByType("page")
    .catch(() => []);
  return pages.map((p) => ({ uid: p.uid === "home" ? [] : [p.uid] }));
}
