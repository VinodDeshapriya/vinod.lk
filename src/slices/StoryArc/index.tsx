import clsx from "clsx";
import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import ArrowForward from "atd-icons/dist/ArrowForward";
import StyledContainer from "@/components/ui/StyledContainer";
import SplitHeading from "@/components/ui/SplitHeading";
import PrismicTitle from "@/components/ui/PrismicTitle";
import SliceIcon from "@/components/ui/SliceIcon";
import Location from "atd-icons/dist/Location";

export type StoryArcProps = SliceComponentProps<Content.StoryArcSlice>;

/** Figma: About › "Section 2 — My story (story arc)" (19295:1064) */
const StoryArc = ({ slice }: StoryArcProps) => {
  const { eyebrow, title, intro, acts, quote, location } = slice.primary;
  return (
    <StyledContainer
      as="section"
      slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }}
      parentClassName="bg-offwhite-2"
      className="flex flex-col gap-14"
    >
      <SplitHeading eyebrow={eyebrow} title={title} intro={intro} />

      <ol className="flex flex-col lg:flex-row lg:items-center">
        {acts.map((act, i) => {
          const dark = act.highlight;
          const chips = (act.chips ?? "").split(",").map((c) => c.trim()).filter(Boolean);
          return (
            <li key={i} className="contents">
              {i > 0 && (
                <span aria-hidden className="self-center p-2 my-3 lg:my-0 lg:mx-2 rounded-full bg-surface border border-border-primary text-primary-light rotate-90 lg:rotate-0">
                  <ArrowForward size={16} />
                </span>
              )}
              <article
                className={clsx(
                  "relative overflow-hidden flex-1 min-w-0 flex flex-col gap-4 rounded-[28px]",
                  dark
                    ? "px-9 py-12 lg:min-h-[571px] text-white bg-[linear-gradient(124deg,#080d1a_0%,#0a1733_43%,#0f4da8_71%)] shadow-[0_24px_60px_0_rgba(10,51,128,0.25)]"
                    : "p-9 lg:min-h-[523px] bg-surface border border-border-primary shadow-[0_16px_24px_0_rgba(10,18,33,0.05)]",
                )}
              >
                {dark && (
                  <span aria-hidden className="absolute left-[120px] -top-[120px] w-[360px] h-[260px] rounded-full bg-primary-light/40 blur-[80px]" />
                )}
                <div className="relative flex items-center justify-between mb-2">
                  <span className={clsx("p-3 rounded-[14px]", dark ? "bg-primary-light text-white" : "bg-info-bg text-primary-light")}>
                    <SliceIcon name={act.icon} />
                  </span>
                  <span className={clsx("font-title font-medium text-[15px]", dark ? "text-secondary-light" : "text-text-inactive")}>
                    {String(i + 1).padStart(2, "0")} / {String(acts.length).padStart(2, "0")}
                  </span>
                </div>
                <p className={clsx("relative text-[13px] font-medium uppercase tracking-[0.14em]", dark ? "text-secondary-light" : "text-primary-light")}>
                  {act.label}
                </p>
                <PrismicTitle
                  field={act.title}
                  className={clsx(
                    "relative font-title font-medium",
                    dark ? "text-[32px] leading-[40px]" : "text-title-base",
                  )}
                  emClassName={dark ? "text-secondary-light" : undefined}
                />
                <p className={clsx("relative text-body-small", dark ? "text-white/75" : "text-text-description")}>{act.text}</p>
                {chips.length > 0 && (
                  <ul className="relative mt-1 flex flex-wrap gap-2">
                    {chips.map((c) => (
                      <li key={c} className="px-3 py-[7px] rounded-full bg-offwhite-2 border border-border-secondary text-[14px] leading-5 text-text-heading">
                        {c}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </li>
          );
        })}
      </ol>

      <div className="pt-10 border-t border-border-primary flex flex-col items-center gap-[18px] text-center">
        <div className="flex items-center gap-5">
          <span aria-hidden className="font-title italic font-medium text-[72px] leading-[56px] text-primary-light">“</span>
          <PrismicTitle
            field={quote}
            className="max-w-[480px] font-title italic font-medium text-title-base text-text-heading"
          />
        </div>
        {location && (
          <p className="flex items-center gap-2.5 px-[18px] py-3 rounded-full bg-surface border border-border-primary text-body-small text-text-heading">
            <Location size={18} className="text-primary-light" aria-hidden />
            {location}
          </p>
        )}
      </div>
    </StyledContainer>
  );
};

export default StoryArc;
