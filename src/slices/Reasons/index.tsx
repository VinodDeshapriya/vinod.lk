import StyledContainer from "@/components/ui/StyledContainer";
import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import PrismicButtons from "@/components/ui/PrismicButtons";
import SectionHeading from "@/components/ui/SectionHeading";

export type ReasonsProps = SliceComponentProps<Content.ReasonsSlice>;

/** Figma: 📦 Components › Content Section Variants › content_reasons_variants1 (19343:4536) */
const Reasons = ({ slice }: ReasonsProps) => {
  const { title, reasons, buttons } = slice.primary;
  return (
    <StyledContainer
      as="section"
      slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }}
      parentClassName="bg-offwhite-2"
      className="flex flex-col gap-10 items-center"
    >
      <SectionHeading title={title} />
      <ol className="w-full grid sm:grid-cols-2 lg:grid-cols-4 bg-surface border border-border-primary rounded-lg overflow-hidden shadow-[0_12px_40px_0_rgba(10,18,33,0.05)]">
        {reasons.map((r, i) => (
          <li
            key={i}
            className="flex flex-col gap-3 p-8 border-border-secondary border-b sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0 sm:[&:nth-last-child(-n+2)]:border-b-0"
          >
            <span className="pb-5 font-title font-medium text-[48px] leading-[56px] tracking-[-0.03em] text-primary-light">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="text-title-base text-text-heading">{r.title}</h3>
            <p className="text-body-small text-text-description">{r.text}</p>
          </li>
        ))}
      </ol>
      <PrismicButtons buttons={buttons} />
    </StyledContainer>
  );
};

export default Reasons;
