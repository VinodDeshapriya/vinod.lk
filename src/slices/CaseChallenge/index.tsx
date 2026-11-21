import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import StyledContainer from "@/components/ui/StyledContainer";
import PrismicTitle from "@/components/ui/PrismicTitle";

export type CaseChallengeProps = SliceComponentProps<Content.CaseChallengeSlice>;

const pad = (n: number) => String(n).padStart(2, "0");

/** Title and intro, then large numbered cards (2 per row). */
const CaseChallenge = ({ slice }: CaseChallengeProps) => {
  const { title, intro, items } = slice.primary;
  return (
    <StyledContainer
      data-slice-type={slice.slice_type}
      slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }}
      className="flex flex-col gap-10"
    >
      <div className="flex flex-col lg:flex-row lg:items-end gap-5 lg:gap-20">
        <div className="lg:w-[420px] shrink-0">
          <PrismicTitle field={title} className="text-title-2x-large text-text-heading" emClassName="text-primary-light" />
        </div>
        {intro && <p className="flex-1 text-body-base text-text-description">{intro}</p>}
      </div>
      <ul data-reveal-stagger className="grid sm:grid-cols-2 gap-5">
        {items.map((it, i) => (
          <li key={`${it.title}${i}`} className="flex flex-col justify-between gap-12 min-h-[260px] md:min-h-[300px] rounded-[24px] bg-surface border border-border-primary p-7 md:p-9 shadow-[0_16px_24px_0_rgba(10,18,33,0.05)]">
            <span className="font-title font-medium text-[56px] leading-none tracking-[-0.04em] text-primary-light">{pad(i + 1)}</span>
            <div className="flex flex-col gap-2">
              <h3 className="font-title font-medium text-[24px] leading-[30px] text-text-heading">{it.title}</h3>
              <p className="text-body-base text-text-description">{it.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </StyledContainer>
  );
};

export default CaseChallenge;
