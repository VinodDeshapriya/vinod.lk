import clsx from "clsx";
import { asLink, type Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import StyledContainer from "@/components/ui/StyledContainer";
import ArrowUpRight from "@/components/ui/ArrowUpRight";

export type CaseFactsProps = SliceComponentProps<Content.CaseFactsSlice>;

/** Bordered strip of project facts. */
const CaseFacts = ({ slice }: CaseFactsProps) => {
  const facts = slice.primary.facts.filter((f) => f.label || f.value);
  return (
    <StyledContainer data-slice-type={slice.slice_type} className="pt-8 md:pt-12">
      <dl data-reveal className="grid grid-cols-2 lg:grid-cols-5 gap-px rounded-[24px] bg-border-secondary border border-border-primary shadow-[0_16px_48px_0_rgba(10,18,33,0.06)] overflow-hidden">
        {facts.map((f, i) => {
          const href = asLink(f.link);
          return (
            <div key={`${f.label}${i}`} className={clsx("flex flex-col gap-1.5 p-5 md:p-6 bg-white", i === facts.length - 1 && facts.length % 2 === 1 && "col-span-2 lg:col-span-1")}>
              <dt className="text-[12px] font-medium uppercase tracking-[0.14em] text-text-inactive">{f.label}</dt>
              <dd className="text-body-small font-medium text-text-heading">
                {href ? (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-primary-light hover:underline">
                    {f.value} <ArrowUpRight size={12} />
                  </a>
                ) : (
                  f.value
                )}
              </dd>
            </div>
          );
        })}
      </dl>
    </StyledContainer>
  );
};

export default CaseFacts;
