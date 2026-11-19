import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import StyledContainer from "@/components/ui/StyledContainer";
import { getLayoutData } from "@/lib/layoutData";

type Params = { uid: string };

const getPost = (uid: string) =>
  createClient()
    .getByUID("blog", uid)
    .catch(() => null);

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const post = await getPost((await params).uid);
  if (!post) return {};
  return {
    title: post.data.meta_title || post.data.title,
    description: post.data.meta_description || post.data.excerpt,
  };
}

export default async function BlogPost({ params }: { params: Promise<Params> }) {
  const post = await getPost((await params).uid);
  if (!post) notFound();
  const { settings } = await getLayoutData();
  const { title, tag, publish_date, read_minutes } = post.data;

  return (
    <article>
      <StyledContainer
        slice={{ primary: { top_padding: "Full", bottom_padding: "None" } }}
        className="max-w-[760px]! flex flex-col gap-4"
      >
        {tag && (
          <span className="self-start px-3 py-1.5 rounded-full bg-info-bg text-xs font-medium uppercase tracking-[0.12em] text-primary-light">
            {tag}
          </span>
        )}
        <h1 className="text-title-x-large text-text-heading">{title}</h1>
        <p className="text-body-small text-text-inactive">
          {publish_date &&
            new Date(publish_date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          {publish_date && read_minutes ? " · " : ""}
          {read_minutes ? `${read_minutes} min read` : ""}
        </p>
      </StyledContainer>
      <SliceZone slices={post.data.slices} components={components} context={{ settings }} />
    </article>
  );
}

export async function generateStaticParams() {
  const posts = await createClient()
    .getAllByType("blog")
    .catch(() => []);
  return posts.map((p) => ({ uid: p.uid }));
}
