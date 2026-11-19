import StyledContainer from "@/components/ui/StyledContainer";
import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import { createClient } from "@/prismicio";
import PrismicButtons from "@/components/ui/PrismicButtons";
import SectionHeading from "@/components/ui/SectionHeading";
import PostCard from "@/components/blog/PostCard";
import { blogOrderings, toPostSummary } from "@/lib/blog";

export type BlogPreviewProps = SliceComponentProps<Content.BlogPreviewSlice>;

/** Figma: 📦 Components › Blog Section Variants › blog_variants1 (19345:3779). Shows the latest blog documents. */
const BlogPreview = async ({ slice }: BlogPreviewProps) => {
  const { title, number_of_posts, buttons } = slice.primary;
  const posts = await createClient()
    .getAllByType("blog", {
      limit: number_of_posts || 3,
      orderings: blogOrderings,
    })
    .catch(() => [] as Content.BlogDocument[]);
  if (!posts.length) return null;

  return (
    <StyledContainer
      as="section"
      slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }}
      parentClassName="bg-offwhite-2"
      className="flex flex-col gap-10 items-center"
    >
      <SectionHeading title={title} />
      <ul className="w-full grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={toPostSummary(post)} />
        ))}
      </ul>
      <PrismicButtons buttons={buttons} />
    </StyledContainer>
  );
};

export default BlogPreview;
