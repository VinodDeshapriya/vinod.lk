import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import { isFilled } from "@prismicio/client";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { getLayoutData } from "@/lib/layoutData";

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
  return {
    title: uidFrom(await params) === "home" ? undefined : meta_title || title,
    description: meta_description,
    openGraph: isFilled.image(meta_image)
      ? { images: [{ url: meta_image.url }] }
      : undefined,
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const page = await getPage(uidFrom(await params));
  if (!page) notFound();
  const { settings } = await getLayoutData();

  return (
    <SliceZone
      slices={page.data.slices}
      components={components}
      context={{ settings }}
    />
  );
}

export async function generateStaticParams() {
  const pages = await createClient()
    .getAllByType("page")
    .catch(() => []);
  return pages.map((p) => ({ uid: p.uid === "home" ? [] : [p.uid] }));
}
