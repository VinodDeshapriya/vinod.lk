import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { blogOrderings, toPostSummary } from "@/lib/blog";
import type { SliceContext } from "@/lib/sliceContext";
import BlogBrowser from "./BlogBrowser";

export type BlogIndexProps = SliceComponentProps<Content.BlogIndexSlice, SliceContext>;

/** Figma: Blog › hero, "Featured" and "All articles" (19268:23574, 19268:23592, 19268:23626) */
const BlogIndex = async ({ slice, context }: BlogIndexProps) => {
  const { eyebrow, title, intro, list_title, posts_per_page } = slice.primary;
  const docs = await createClient()
    .getAllByType("blog", { orderings: blogOrderings })
    .catch(() => [] as Content.BlogDocument[]);
  const posts = docs.map(toPostSummary);
  const author = context?.settings?.data.author_name || "Vinod Deshapriya";

  return (
    <div data-slice-type={slice.slice_type}>
      <BlogBrowser
        eyebrow={eyebrow}
        title={title}
        intro={intro}
        listTitle={list_title}
        perPage={posts_per_page || 6}
        posts={posts}
        author={author}
      />
    </div>
  );
};

export default BlogIndex;
