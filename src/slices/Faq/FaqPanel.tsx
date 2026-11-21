"use client";
import { useState } from "react";
import clsx from "clsx";
import ArrowForward from "atd-icons/dist/ArrowForward";
import StyledContainer from "@/components/ui/StyledContainer";
import type { Content } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import PrismicTitle from "@/components/ui/PrismicTitle";

type Primary = Content.FaqSliceDefaultPrimary;

/**
 * Client part of the Faq slice (accordion).
 * Figma faq_variants1: 1440 (19338:3456), 768 (19338:3457), 375 (19338:3517).
 * Row: number (18px) · gap 12/20/28 · question + answer · toggle (28/30px).
 */
export default function FaqPanel({ primary }: { primary: Primary }) {
  const [open, setOpen] = useState<number | null>(0);
  const faqs = primary.faqs;

  return (
    <StyledContainer as="section" parentClassName="max-md:py-4 md:py-10 xl:py-20">
      <div
        className={clsx(
          "relative overflow-hidden rounded-[28px] border border-white/8 text-white",
          "bg-[linear-gradient(152deg,#080d1a_0%,#0a142b_70%,#0d3373_100%)]",
          "flex flex-col gap-4 px-5 py-7 md:gap-8 md:px-8 md:py-14 lg:flex-row lg:gap-10 lg:p-14",
        )}
      >
        {/* film grain, as in the design (image fill at 11%) */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.11] bg-[url(/images/noise.webp)] bg-repeat [background-size:256px]"
        />
        <div
          aria-hidden
          className="absolute -left-[120px] top-[420px] w-[303px] h-[221px] md:w-[520px] md:h-[380px] rounded-full bg-primary-light/40 blur-[75px]"
        />

        <div className="relative lg:w-[400px] shrink-0 flex flex-col gap-6 items-start">
          {primary.eyebrow && (
            <p className="flex items-center gap-2.5 text-[13px] leading-[17px] font-medium uppercase tracking-[0.14em] text-secondary-light">
              <span className="size-2 rounded-full bg-secondary-light" />
              {primary.eyebrow}
            </p>
          )}
          <PrismicTitle
            field={primary.title}
            className="font-title font-medium text-[32px] leading-9 tracking-[-0.5px] md:text-[52px] md:leading-[58px] md:tracking-[-1.5px]"
            emClassName="text-secondary-light"
          />
          {primary.intro && (
            <p className="text-[16px] leading-[26px] md:text-[18px] md:leading-[30px] text-white/65">
              {primary.intro}
            </p>
          )}
          <PrismicNextLink
            field={primary.contact_link}
            className={clsx(
              "flex items-center gap-2 h-[52px] md:h-14 px-5 rounded-full bg-white/8 border border-white/18",
              "font-medium text-[16px] leading-[26px] md:text-[18px] md:leading-[30px]",
              "transition-colors hover:bg-surface hover:text-text-heading",
            )}
          >
            {primary.contact_link.text || "Ask on WhatsApp"}
            <ArrowForward size={16} />
          </PrismicNextLink>
        </div>

        <ul data-reveal-stagger className="relative flex-1 min-w-0">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            const id = `faq-${i}`;
            return (
              <li key={i} className={clsx(i > 0 && "border-t border-white/10")}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={id}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group w-full flex items-start gap-3 md:gap-5 lg:gap-7 pt-[26px] text-left outline-none focus-visible:ring-2 focus-visible:ring-secondary-light/60 rounded-sm"
                >
                  <span
                    className={clsx(
                      "w-[18px] shrink-0 font-title font-medium text-[15px] leading-[30px] transition-colors",
                      isOpen ? "text-secondary-light" : "text-white/45",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={clsx(
                      "flex-1 font-title font-medium text-[20px] leading-[26px] md:leading-[30px] transition-colors",
                      isOpen ? "text-white" : "text-white/90 group-hover:text-white",
                    )}
                  >
                    {faq.question}
                  </span>
                  <span
                    aria-hidden
                    className={clsx(
                      "relative size-7 md:size-[30px] shrink-0 rounded-full transition-colors duration-300",
                      isOpen
                        ? "bg-primary-light"
                        : "border-[0.9px] border-white/25 group-hover:border-white/50",
                    )}
                  >
                    <span className="absolute left-1/2 top-1/2 w-2 md:w-[9px] h-[1.7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-surface" />
                    <span
                      className={clsx(
                        "absolute left-1/2 top-1/2 h-2 md:h-[9px] w-[1.7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-surface transition-transform duration-300",
                        isOpen && "scale-y-0",
                      )}
                    />
                  </span>
                </button>
                <div
                  id={id}
                  role="region"
                  className={clsx(
                    "grid transition-[grid-template-rows] duration-300 ease-out",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <div
                      className={clsx(
                        "pt-3 pl-[30px] pr-10 md:pl-[38px] md:pr-[50px] lg:pl-[46px] lg:pr-[58px]",
                        "text-[16px] leading-[26px] md:text-[18px] md:leading-[30px] text-white/70",
                        "[&_strong]:font-medium [&_strong]:text-white [&_a]:underline",
                      )}
                    >
                      <PrismicRichText field={faq.answer} />
                    </div>
                  </div>
                </div>
                <div className="h-[26px]" />
              </li>
            );
          })}
        </ul>
      </div>
    </StyledContainer>
  );
}
