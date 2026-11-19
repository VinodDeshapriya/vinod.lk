import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import StyledButton from "@/components/ui/StyledButton";
import PrismicTitle from "@/components/ui/PrismicTitle";

export type ArticleCalloutProps = SliceComponentProps<Content.ArticleCalloutSlice>;

/** Figma: Blog article › "Inline CTA" and "Pull quote" (in 19268:24021) */
const ArticleCallout = ({ slice }: ArticleCalloutProps) => {
  if (slice.variation === "quote") {
    return (
      <blockquote data-slice-type={slice.slice_type} className="my-8 pl-6 border-l-[3px] border-primary-light">
        <PrismicTitle field={slice.primary.quote} className="font-title italic font-medium text-[22px] leading-[32px] text-primary-light" emClassName="" />
      </blockquote>
    );
  }
  const { title, text, link } = slice.primary;
  return (
    <aside data-slice-type={slice.slice_type} className="my-10 flex flex-col sm:flex-row sm:items-center gap-5 p-6 sm:p-7 rounded-[20px] bg-info-bg border border-primary-light/20">
      <div className="flex-1 flex flex-col gap-1">
        <p className="font-title font-medium text-[20px] leading-[28px] text-text-heading">{title}</p>
        {text && <p className="text-body-small text-text-description">{text}</p>}
      </div>
      <StyledButton field={link} />
    </aside>
  );
};

export default ArticleCallout;
