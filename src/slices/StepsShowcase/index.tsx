import clsx from "clsx";
import { type Content, isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import StyledContainer from "@/components/ui/StyledContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import CheckDot from "@/components/ui/CheckDot";

export type StepsShowcaseProps = SliceComponentProps<Content.StepsShowcaseSlice>;

/** Figma: How it works › "Section 2 — The five steps (redesign)" (19268:31656) */
const StepsShowcase = ({ slice }: StepsShowcaseProps) => {
  const { eyebrow, title, intro, steps } = slice.primary;
  return (
    <StyledContainer
      as="section"
      slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }}
      parentClassName="bg-offwhite-2"
      className="flex flex-col gap-14"
    >
      <SectionHeading eyebrow={eyebrow} title={title} intro={intro} />
      <ol className="relative flex flex-col gap-12 lg:gap-0">
        <span aria-hidden className="hidden lg:block absolute left-1/2 top-10 bottom-10 w-0.5 -translate-x-1/2 bg-[linear-gradient(to_bottom,#157ff8,#dde2ea)]" />
        {steps.map((step, i) => {
          const imageFirst = i % 2 === 0;
          const last = i === steps.length - 1;
          return (
            <li key={i} className="relative grid lg:grid-cols-[1fr_56px_1fr] items-center gap-6 lg:gap-12 lg:min-h-[390px]">
              <div className={clsx(imageFirst ? "lg:order-1" : "lg:order-3")}>
                {isFilled.image(step.image) && (
                  <PrismicNextImage
                    field={step.image}
                    sizes="(min-width: 1024px) 680px, 110vw"
                    className="w-full h-auto lg:max-w-none lg:w-[116.5%] lg:-mx-[8.25%]"
                    fallbackAlt=""
                  />
                )}
              </div>
              <span
                className={clsx(
                  "order-first lg:order-2 size-14 rounded-full flex items-center justify-center font-title font-semibold text-[18px] text-white ring-8 ring-offwhite-2",
                  last ? "bg-primary-dark" : "bg-primary-light",
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className={clsx("flex flex-col items-start gap-3", imageFirst ? "lg:order-3" : "lg:order-1")}>
                <p className="flex items-center gap-2.5 text-[13px] font-medium uppercase tracking-[0.14em] text-primary-light">
                  {step.label}
                  {step.timing && (
                    <span className="px-2.5 py-1 rounded-full bg-info-bg normal-case tracking-normal text-[13px]">{step.timing}</span>
                  )}
                </p>
                <h3 className="text-title-medium font-title font-medium text-text-heading">{step.title}</h3>
                <p className="text-body-small text-text-description">{step.text}</p>
                {step.outcome && (
                  <p className="mt-2 w-full flex items-center gap-2.5 px-4 py-3 rounded-[14px] bg-surface border border-border-primary text-body-small text-text-heading">
                    <CheckDot size={20} />
                    <span>
                      <span className="font-medium text-success-primary">You&apos;ll get:</span> {step.outcome}
                    </span>
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </StyledContainer>
  );
};

export default StepsShowcase;
