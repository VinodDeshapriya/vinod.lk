import type { Content } from "@prismicio/client";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";
import StyledContainer from "@/components/ui/StyledContainer";
import PrismicTitle from "@/components/ui/PrismicTitle";

export type CaseAboutProps = SliceComponentProps<Content.CaseAboutSlice>;

/** Heading on the left, paragraphs on the right. */
const CaseAbout = ({ slice }: CaseAboutProps) => (
  <StyledContainer
    data-slice-type={slice.slice_type}
    slice={{ primary: { top_padding: "Full", bottom_padding: "None" } }}
    className="flex flex-col lg:flex-row gap-6 lg:gap-20"
  >
    <div className="lg:w-[420px] shrink-0">
      <PrismicTitle field={slice.primary.title} className="text-title-x-large text-text-heading" emClassName="text-primary-light" />
    </div>
    <div className="flex-1 flex flex-col gap-5 text-body-base text-text-description [&_a]:text-primary-light [&_a]:underline [&_strong]:text-text-heading">
      <PrismicRichText
        field={slice.primary.text}
        components={{ paragraph: ({ children }) => <p data-reveal>{children}</p> }}
      />
    </div>
  </StyledContainer>
);

export default CaseAbout;
