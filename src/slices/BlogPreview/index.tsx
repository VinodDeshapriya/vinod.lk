import StyledContainer from "@/components/ui/StyledContainer";
import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import { createClient } from "@/prismicio";
import PrismicButtons from "@/components/ui/PrismicButtons";
import SectionHeading from "@/components/ui/SectionHeading";
import BlogCarousel from "./BlogCarousel";
import { blogOrderings, toPostSummary } from "@/lib/blog";

export type BlogPreviewProps = SliceComponentProps<Content.BlogPreviewSlice>;

/** Figma: 📦 Components › Blog Section Variants › blog_variants1 (19345:3779). Shows the latest blog documents. */
const BlogPreview = async ({ slice }: BlogPreviewProps) => {
  const { title, number_of_posts, buttons } = slice.primary;
  const posts = await createClient()
    .getAllByType("blog", {
      limit: number_of_posts || 6,
      orderings: blogOrderings,
    })
    .catch(() => [] as Content.BlogDocument[]);
  if (!posts.length) return null;

  return (
    <StyledContainer
      as="section"
      slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }}
      parentClassName="bg-offwhite-2"
      className="flex flex-col gap-6 md:gap-10 items-center"
    >
      <SectionHeading
        title={title}
        className="max-md:px-5 max-md:[&>h2]:text-[36px]! max-md:[&>h2]:leading-[42px]! max-md:[&>h2]:tracking-[-0.8px]!"
      />
      <BlogCarousel posts={posts.map(toPostSummary)} />
      <PrismicButtons buttons={buttons} className="max-sm:w-auto! items-center" />
    </StyledContainer>
  );
};

export default BlogPreview;
