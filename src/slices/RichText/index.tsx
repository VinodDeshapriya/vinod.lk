import type { Content } from "@prismicio/client";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";
import StyledContainer from "@/components/ui/StyledContainer";
import { articleProse } from "@/components/blog/articleStyles";
import { slugify } from "@/lib/blog";
import type { SliceContext } from "@/lib/sliceContext";

export type RichTextProps = SliceComponentProps<Content.RichTextSlice, SliceContext>;

/** Long-form content (blog posts, legal pages). Headings get ids for the article's contents list. */
const RichText = ({ slice, context }: RichTextProps) => {
  const content = (
    <PrismicRichText
      field={slice.primary.content}
      components={{
        heading2: ({ children, text }) => <h2 id={slugify(text ?? "")}>{children}</h2>,
      }}
    />
  );
  if (context?.inArticle) return <div className={articleProse}>{content}</div>;
  return (
    <StyledContainer
      as="section"
      slice={{ primary: { top_padding: "Half", bottom_padding: "Half" } }}
      className={`max-w-[760px]! ${articleProse}`}
    >
      {content}
    </StyledContainer>
  );
};

export default RichText;
