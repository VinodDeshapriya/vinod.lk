import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import ArrowForward from "atd-icons/dist/ArrowForward";
import StyledContainer from "@/components/ui/StyledContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import SliceIcon from "@/components/ui/SliceIcon";
import DarkBand from "@/components/ui/DarkBand";
import ArrowUpRight from "@/components/ui/ArrowUpRight";
import Rows from "@/components/ui/CardRows";

export type FeatureCardsProps = SliceComponentProps<Content.FeatureCardsSlice>;

const num = (i: number) => String(i + 1).padStart(2, "0");

/**
 * Figma: light = "Sound familiar" (19268:15520) / "Systems I build" (19268:15556);
 * dark = "Why UX-led" (19268:13964) / About "What I believe" (19268:12411);
 * numbered = Services "Service cards" (19268:13345).
 */
const FeatureCards = ({ slice }: FeatureCardsProps) => {
  const { eyebrow, title, intro } = slice.primary;

  if (slice.variation === "dark") {
    const { cards, show_numbers } = slice.primary;
    return (
      <DarkBand className="flex flex-col gap-14">
        <SectionHeading eyebrow={eyebrow} title={title} intro={intro} inverted className="max-w-[880px]!" />
        {show_numbers ? (
          <ol className="relative w-full grid sm:grid-cols-2 lg:grid-cols-4 rounded-[24px] border border-white/12 bg-white/5 overflow-hidden">
            {cards.map((c, i) => (
              <li
                key={i}
                className="flex flex-col gap-3 p-8 border-white/10 border-b sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0 sm:[&:nth-last-child(-n+2)]:border-b-0"
              >
                <span className="font-title font-medium text-[48px] leading-[60px] tracking-[-0.03em] text-secondary-light pb-10">
                  {num(i)}
                </span>
                <h3 className="text-title-base">{c.title}</h3>
                <p className="text-body-small text-white/80">{c.text}</p>
              </li>
            ))}
          </ol>
        ) : (
          <Rows items={cards} gap="gap-5">
            {(c) => (
              <div className="relative h-full flex flex-col gap-3 p-8 rounded-[24px] bg-white/5 border border-white/12">
                <span className="self-start p-3 rounded-[14px] bg-primary-light text-white mb-5">
                  <SliceIcon name={c.icon} />
                </span>
                <h3 className="text-title-base">{c.title}</h3>
                <p className="text-body-small text-white/80">{c.text}</p>
              </div>
            )}
          </Rows>
        )}
      </DarkBand>
    );
  }

  if (slice.variation === "numbered") {
    const { cards } = slice.primary;
    return (
      <StyledContainer
        as="section"
        slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }}
        parentClassName="bg-offwhite-2"
        className="flex flex-col gap-14"
      >
        <SectionHeading eyebrow={eyebrow} title={title} intro={intro} />
        <Rows items={cards} gap="gap-5">
          {(c, i) => (
            <PrismicNextLink
              field={c.link}
              className="group h-full min-h-[240px] flex flex-col gap-2.5 p-7 rounded-[24px] bg-white border border-border-primary shadow-[0_16px_24px_0_rgba(10,18,33,0.05)] hover:border-primary-light transition-colors"
            >
              <span className="flex items-start justify-between pb-8">
                <span className="font-title font-medium text-[40px] leading-[46px] tracking-[-0.03em] text-primary-light">
                  {num(i)}
                </span>
                <span className="size-9 rounded-full border border-border-primary flex items-center justify-center text-primary-light transition-colors group-hover:bg-primary-light group-hover:border-primary-light group-hover:text-white">
                  <ArrowUpRight size={16} />
                </span>
              </span>
              <h3 className="text-[20px] leading-[28px] font-title font-medium tracking-[-0.01em] text-text-heading">
                {c.title}
              </h3>
              <p className="text-body-small text-text-description">{c.text}</p>
              <span className="grow" />
              <span className="flex items-center gap-1.5 pt-2 text-body-small font-medium text-primary-light">
                {c.link.text || "Learn more"}
                <ArrowForward size={14} />
              </span>
            </PrismicNextLink>
          )}
        </Rows>
      </StyledContainer>
    );
  }

  const { cards } = slice.primary;
  return (
    <StyledContainer
      as="section"
      slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }}
      parentClassName="bg-offwhite-2"
      className="flex flex-col gap-14"
    >
      <SectionHeading eyebrow={eyebrow} title={title} intro={intro} />
      <Rows items={cards} gap="gap-5">
        {(c) => (
          <div className="h-full flex flex-col gap-3 p-7 rounded-[24px] bg-white border border-border-primary shadow-[0_16px_24px_0_rgba(10,18,33,0.05)]">
            <span className="self-start p-3 rounded-[14px] bg-info-bg text-primary-light mb-5">
              <SliceIcon name={c.icon} />
            </span>
            {c.title ? (
              <>
                <h3 className="text-[20px] leading-[28px] font-title font-medium tracking-[-0.01em] text-text-heading">
                  {c.title}
                </h3>
                <p className="text-body-small text-text-description">{c.text}</p>
              </>
            ) : (
              <p className="text-body-base text-text-heading">{c.text}</p>
            )}
          </div>
        )}
      </Rows>
    </StyledContainer>
  );
};

export default FeatureCards;
