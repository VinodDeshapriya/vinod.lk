import type { Content } from "@prismicio/client";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";
import StyledContainer from "@/components/ui/StyledContainer";

export type RichTextProps = SliceComponentProps<Content.RichTextSlice>;

/** Long-form content (blog posts, legal pages). */
const RichText = ({ slice }: RichTextProps) => (
  <StyledContainer
    as="section"
    slice={{ primary: { top_padding: "Half", bottom_padding: "Half" } }}
    className="max-w-[760px]! prose-content text-body-base text-text-description [&_h2]:text-title-medium [&_h2]:text-text-heading [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-title-base [&_h3]:text-text-heading [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:mb-5 [&_ul]:list-disc [&_ol]:list-decimal [&_ul,&_ol]:pl-6 [&_ul,&_ol]:mb-5 [&_a]:text-primary-light [&_a]:underline [&_strong]:text-text-heading [&_img]:rounded-md [&_img]:my-6"
  >
    <PrismicRichText field={slice.primary.content} />
  </StyledContainer>
);

export default RichText;
