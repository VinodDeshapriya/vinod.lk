import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isFilled, type Content } from "@prismicio/client";
import { createClient } from "@/prismicio";
import ArticleView from "@/components/blog/ArticleView";
import { getLayoutData } from "@/lib/layoutData";
import { blogOrderings } from "@/lib/blog";

type Params = { uid: string };

const getPost = (uid: string) =>
  createClient()
    .getByUID("blog", uid)
    .catch(() => null);

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const post = await getPost((await params).uid);
  if (!post) return {};
  return {
    title: post.data.meta_title || post.data.title,
    description: post.data.meta_description || post.data.excerpt,
    openGraph: isFilled.image(post.data.meta_image) ? { images: [post.data.meta_image.url] } : undefined,
  };
}

export default async function BlogPost({ params }: { params: Promise<Params> }) {
  const post = await getPost((await params).uid);
  if (!post) notFound();
  const [{ settings }, latest] = await Promise.all([
    getLayoutData(),
    createClient()
      .getAllByType("blog", { limit: 4, orderings: blogOrderings })
      .catch(() => [] as Content.BlogDocument[]),
  ]);
  return <ArticleView post={post} settings={settings} latest={latest} />;
}

export async function generateStaticParams() {
  const posts = await createClient()
    .getAllByType("blog")
    .catch(() => []);
  return posts.map((p) => ({ uid: p.uid }));
}
