"use client";
import { useState } from "react";
import clsx from "clsx";
import ArrowForward from "atd-icons/dist/ArrowForward";
import StyledContainer from "@/components/ui/StyledContainer";
import { faqs } from "@/data/faqs";
import { siteSettings } from "@/data/site";

/** Renders `**bold**` segments inside an answer. */
function RichAnswer({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") ? (
          <strong key={i} className="font-medium text-white">
            {part.slice(2, -2)}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** Figma: Home Page › FAQ (19275:1800) */
export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  const whatsapp = `https://wa.me/${siteSettings.phone.replace(/\D/g, "")}`;

  return (
    <StyledContainer
      as="section"
      parentClassName="py-10 lg:py-(--spacing-horizontal-padding)"
    >
      <div className="relative overflow-hidden rounded-lg border border-white/8 p-6 md:p-10 lg:p-14 flex flex-col lg:flex-row gap-10 lg:gap-20 text-white bg-[linear-gradient(152deg,#080d1a_0%,#0a142b_50%,#0d3373_71%)]">
        <div
          aria-hidden
          className="absolute -left-32 top-[420px] w-[520px] h-[380px] rounded-full bg-primary-light/35 blur-[100px]"
        />
        <div className="relative lg:w-[400px] shrink-0 flex flex-col gap-6 items-start">
          <p className="flex items-center gap-2.5 text-[13px] font-medium uppercase tracking-[0.14em] text-secondary-light">
            <span className="size-2 rounded-full bg-secondary-light" />
            FAQs
          </p>
          <h2 className="font-title font-medium text-[40px] leading-[46px] lg:text-[52px] lg:leading-[58px] tracking-[-0.03em]">
            Web design questions,{" "}
            <em className="italic text-secondary-light">answered</em>
          </h2>
          <p className="text-body-base text-white/65">
            Can&apos;t find what you&apos;re looking for? Ask me directly and
            you&apos;ll get a real answer.
          </p>
          <a
            href={whatsapp}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/8 border border-white/18 text-body-base-bold hover:bg-white hover:text-text-heading transition-colors"
          >
            Ask on WhatsApp
            <ArrowForward size={16} />
          </a>
        </div>

        <ul className="relative flex-1 min-w-0">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            const id = `faq-${i}`;
            return (
              <li key={faq.question} className={clsx(i > 0 && "border-t border-white/10")}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={id}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className={clsx("w-full flex gap-5 lg:gap-7 items-start pt-[26px] text-left", isOpen ? "pb-3" : "pb-[26px]")}
                >
                  <span
                    className={clsx(
                      "font-title font-medium text-[15px] leading-[30px]",
                      isOpen ? "text-secondary-light" : "text-white/45",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={clsx(
                      "flex-1 font-title font-medium text-xl leading-[30px]",
                      isOpen ? "text-white" : "text-white/90",
                    )}
                  >
                    {faq.question}
                  </span>
                  <span
                    aria-hidden
                    className={clsx(
                      "relative size-[30px] shrink-0 rounded-full transition-colors",
                      isOpen ? "bg-primary-light" : "border border-white/25",
                    )}
                  >
                    <span className="absolute left-1/2 top-1/2 w-2.5 h-[1.5px] -translate-x-1/2 -translate-y-1/2 bg-white" />
                    <span
                      className={clsx(
                        "absolute left-1/2 top-1/2 w-[1.5px] h-2.5 -translate-x-1/2 -translate-y-1/2 bg-white transition-transform",
                        isOpen && "scale-y-0",
                      )}
                    />
                  </span>
                </button>
                <div
                  id={id}
                  className={clsx(
                    "grid transition-[grid-template-rows] duration-300",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="pb-[26px] pl-[39px] lg:pl-[47px] pr-[58px] text-body-base text-white/70">
                      <RichAnswer text={faq.answer} />
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </StyledContainer>
  );
}
