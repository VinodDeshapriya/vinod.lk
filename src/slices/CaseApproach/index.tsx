import { isFilled, type Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import StyledContainer from "@/components/ui/StyledContainer";
import PrismicTitle from "@/components/ui/PrismicTitle";
import ApproachSteps from "@/components/work/ApproachSteps";

export type CaseApproachProps = SliceComponentProps<Content.CaseApproachSlice>;

/** Dark band: pinned heading with a rolling step counter, steps on a scroll timeline. */
const CaseApproach = ({ slice }: CaseApproachProps) => {
  const { title, intro, steps } = slice.primary;
  return (
    <StyledContainer
      as="section"
      data-slice-type={slice.slice_type}
      slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }}
      parentClassName="grain relative overflow-clip bg-[linear-gradient(to_bottom,#080d1a,#0a1733)] text-white"
      className="relative"
    >
      <div aria-hidden className="absolute -right-40 top-1/3 w-[520px] h-[420px] rounded-full bg-primary-light/30 blur-[90px]" />
      <ApproachSteps
        heading={isFilled.richText(title) ? <PrismicTitle field={title} className="text-title-2x-large text-white" emClassName="text-secondary-light" /> : undefined}
        intro={intro ?? ""}
        steps={steps.map((s) => ({ title: s.title ?? "", text: s.text ?? "" }))}
      />
    </StyledContainer>
  );
};

export default CaseApproach;
