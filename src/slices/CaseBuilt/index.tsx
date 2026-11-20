import { isFilled, type Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import StyledContainer from "@/components/ui/StyledContainer";
import PrismicTitle from "@/components/ui/PrismicTitle";
import CheckDot from "@/components/ui/CheckDot";

export type CaseBuiltProps = SliceComponentProps<Content.CaseBuiltSlice>;

/** Dark band: pinned title with a checklist of what was delivered, then the numbers. */
const CaseBuilt = ({ slice }: CaseBuiltProps) => {
  const { title, intro, items, numbers_title, numbers } = slice.primary;
  const nums = numbers.filter((n) => n.value || n.label);
  return (
    <StyledContainer
      as="section"
      data-slice-type={slice.slice_type}
      slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }}
      parentClassName="grain relative overflow-clip bg-[linear-gradient(to_bottom,#080d1a,#0a1733)] text-white"
      className="relative flex flex-col gap-20 lg:gap-28"
    >
      <div aria-hidden className="absolute left-1/2 -translate-x-1/2 -top-[300px] w-[900px] max-w-[120vw] h-[420px] rounded-full bg-primary-light/35 blur-[90px]" />
      <div className="relative flex flex-col lg:flex-row gap-10 lg:gap-20">
        <div className="lg:w-[420px] shrink-0">
          <div className="lg:sticky lg:top-32 flex flex-col gap-5">
            <PrismicTitle field={title} className="text-title-2x-large text-white" emClassName="text-secondary-light" />
            {intro && <p className="text-body-base text-white/65">{intro}</p>}
          </div>
        </div>
        <ul data-reveal-stagger className="flex-1 rounded-[24px] border border-white/12 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-3 md:p-4">
          {items.filter((d) => d.text).map((d, i) => (
            <li key={`${d.text}${i}`} className="flex items-start gap-3.5 px-4 py-4 border-b border-white/8 last:border-b-0 text-body-base text-white/85">
              <CheckDot size={22} />
              {d.text}
            </li>
          ))}
        </ul>
      </div>

      {nums.length > 0 && (
        <div className="relative flex flex-col gap-10">
          {isFilled.richText(numbers_title) && (
            <PrismicTitle field={numbers_title} className="text-title-2x-large text-white" emClassName="text-secondary-light" />
          )}
          <ul data-reveal-stagger className="grid sm:grid-cols-3 rounded-[24px] border border-white/12 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] overflow-hidden">
            {nums.map((n, i) => (
              <li key={`${n.label}${i}`} className="flex flex-col gap-3 px-8 py-9 border-white/10 border-b sm:border-b-0 sm:border-r last:border-0">
                <span className="font-title font-medium text-[56px] lg:text-[64px] leading-none tracking-[-0.04em] bg-clip-text text-transparent bg-[linear-gradient(to_bottom,#fff,#99c9ff)]">
                  {n.value}
                </span>
                <span className="text-body-small text-white/65">{n.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </StyledContainer>
  );
};

export default CaseBuilt;
