import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import StyledContainer from "@/components/ui/StyledContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import PrismicButtons from "@/components/ui/PrismicButtons";
import ArrowUpRight from "@/components/ui/ArrowUpRight";

export type ServicesGridProps = SliceComponentProps<Content.ServicesGridSlice>;

/** Figma: 📦 Components › Content Section Variants › content_services_variants1 (19343:4324) */
const ServicesGrid = ({ slice }: ServicesGridProps) => {
  const { title, intro, services, buttons } = slice.primary;
  return (
    <StyledContainer
      as="section"
      slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }}
      parentClassName="bg-offwhite-2"
      className="flex flex-col gap-(--spacing-space-1) items-center"
    >
      <SectionHeading title={title} intro={intro} />
      <ul className="w-full grid sm:grid-cols-2 lg:grid-cols-3 bg-surface border border-border-primary rounded-lg overflow-hidden shadow-[0_12px_40px_0_rgba(10,18,33,0.05)]">
        {services.map((s, i) => (
          <li
            key={i}
            className="border-border-secondary border-b sm:[&:nth-child(odd)]:border-r lg:[&:nth-child(odd)]:border-r-0 lg:[&:not(:nth-child(3n))]:border-r lg:[&:nth-last-child(-n+3)]:border-b-0"
          >
            <PrismicNextLink
              field={s.link}
              className="group flex flex-col gap-2.5 h-full min-h-[240px] lg:h-[280px] p-6 lg:p-8 hover:bg-offwhite-2 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-[0.14em] text-text-inactive">
                  {s.label}
                </span>
                <span className="size-10 rounded-full border border-border-primary bg-surface flex items-center justify-center text-primary-light transition-colors group-hover:bg-primary-light group-hover:border-primary-light group-hover:text-white">
                  <ArrowUpRight size={18} />
                </span>
              </div>
              <div className="grow" />
              <h3 className="text-title-base text-text-heading">{s.title}</h3>
              <p className="text-body-small text-text-description">{s.description}</p>
            </PrismicNextLink>
          </li>
        ))}
      </ul>
      <PrismicButtons buttons={buttons} />
    </StyledContainer>
  );
};

export default ServicesGrid;
