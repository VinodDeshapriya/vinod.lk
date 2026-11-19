import clsx from "clsx";
import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import ArrowForward from "atd-icons/dist/ArrowForward";
import StyledContainer from "@/components/ui/StyledContainer";
import PrismicTitle from "@/components/ui/PrismicTitle";
import PrismicButtons from "@/components/ui/PrismicButtons";
import Eyebrow from "@/components/ui/Eyebrow";
import SliceIcon from "@/components/ui/SliceIcon";
import CheckDot from "@/components/ui/CheckDot";

export type SplitListProps = SliceComponentProps<Content.SplitListSlice>;

const cardBase =
  "bg-white border border-border-primary rounded-[24px] shadow-[0_16px_24px_0_rgba(10,18,33,0.05)]";

/**
 * Figma: default = "Is this right for you" (19297:1060); platforms = "Platforms" (19312:1058);
 * grid = "What I'll need" (19268:32392).
 */
const SplitList = ({ slice }: SplitListProps) => {
  const { eyebrow, title, intro, buttons } = slice.primary;

  let list: React.ReactNode;
  if (slice.variation === "platforms") {
    list = (
      <ul className="flex flex-col gap-4">
        {slice.primary.items.map((it, i) => (
          <li
            key={i}
            className={clsx(
              "flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:pl-6 rounded-[20px] border",
              it.highlight
                ? "text-white border-transparent bg-[linear-gradient(120deg,#080d1a,#0a1733_60%,#0f3f8a)] shadow-[0_24px_60px_0_rgba(10,51,128,0.25)]"
                : "bg-white border-border-primary shadow-[0_16px_24px_0_rgba(10,18,33,0.05)]",
            )}
          >
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <span className={clsx("text-[11px] font-medium uppercase tracking-[0.14em]", it.highlight ? "text-secondary-light" : "text-text-inactive")}>
                If you need
              </span>
              <span className={clsx("text-body-small", it.highlight ? "text-white" : "text-text-heading")}>{it.need}</span>
            </div>
            <ArrowForward size={16} className={clsx("hidden sm:block shrink-0", it.highlight ? "text-secondary-light" : "text-primary-light")} />
            <div
              className={clsx(
                "sm:w-[220px] shrink-0 flex items-center gap-3 p-3 rounded-[14px]",
                it.highlight ? "bg-white/8 border border-white/12" : "bg-info-bg border border-primary-light/15",
              )}
            >
              <span
                className={clsx(
                  "size-10 shrink-0 rounded-[10px] flex items-center justify-center font-title font-semibold text-[15px]",
                  "bg-primary-light text-white",
                )}
              >
                {it.monogram}
              </span>
              <span className="flex flex-col">
                <span className={clsx("text-[11px] font-medium uppercase tracking-[0.14em]", it.highlight ? "text-white/60" : "text-text-inactive")}>
                  Choose
                </span>
                <span className="text-body-small font-medium">{it.platform}</span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    );
  } else if (slice.variation === "grid") {
    list = (
      <ul className="grid sm:grid-cols-2 gap-5">
        {slice.primary.items.map((it, i) => (
          <li key={i} className={clsx(cardBase, "flex flex-col gap-2 p-7")}>
            <span className="self-start p-3 rounded-[14px] bg-info-bg text-primary-light mb-4">
              <SliceIcon name={it.icon} size={20} />
            </span>
            <h3 className="text-[20px] leading-[28px] font-title font-medium tracking-[-0.01em] text-text-heading">{it.label}</h3>
            <p className="text-body-small text-text-description">{it.text}</p>
          </li>
        ))}
      </ul>
    );
  } else {
    list = (
      <ul className="flex flex-col gap-4">
        {slice.primary.items.map((it, i) => (
          <li key={i} className={clsx(cardBase, "flex items-center gap-4 sm:gap-6 p-5 sm:p-7")}>
            <span className="size-12 sm:size-16 shrink-0 rounded-[18px] bg-info-bg text-primary-light flex items-center justify-center">
              <SliceIcon name={it.icon} size={26} />
            </span>
            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
              <Eyebrow dot={false}>{it.label}</Eyebrow>
              <p className="text-[18px] leading-[26px] sm:text-[20px] sm:leading-[28px] font-title font-medium tracking-[-0.01em] text-text-heading">
                {it.text}
              </p>
            </div>
            <CheckDot size={32} />
          </li>
        ))}
      </ul>
    );
  }

  const v = slice.variation;
  return (
    <StyledContainer
      as="section"
      slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }}
      parentClassName={v === "default" ? "bg-offwhite-2" : ""}
      className={clsx(
        "flex flex-col lg:flex-row gap-10",
        v === "default" ? "lg:items-center lg:gap-20" : v === "platforms" ? "lg:items-start lg:gap-20" : "lg:items-start lg:gap-16",
      )}
    >
      <div className={clsx("shrink-0 flex flex-col items-start gap-5", v === "default" ? "lg:w-[440px]" : "lg:w-[420px]")}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <PrismicTitle
          field={title}
          className={clsx(
            "text-text-heading",
            v === "grid" ? "font-title font-medium text-[36px] leading-[44px] lg:text-[48px] lg:leading-[56px] tracking-[-0.02em]" : "text-title-2x-large",
          )}
        />
        {intro && <p className="text-body-base text-text-description">{intro}</p>}
        <PrismicButtons buttons={buttons} className="mt-3" />
      </div>
      <div className="flex-1 min-w-0">{list}</div>
    </StyledContainer>
  );
};

export default SplitList;
