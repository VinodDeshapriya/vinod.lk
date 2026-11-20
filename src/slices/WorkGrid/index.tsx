import clsx from "clsx";
import { asLink, isFilled, type Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import Link from "next/link";
import StyledContainer from "@/components/ui/StyledContainer";
import PrismicTitle from "@/components/ui/PrismicTitle";
import ArrowUpRight from "@/components/ui/ArrowUpRight";
import ProjectCard from "@/components/work/ProjectCard";
import { getProjectCards } from "@/lib/caseStudies";
import type { SliceContext } from "@/lib/sliceContext";

export type WorkGridProps = SliceComponentProps<Content.WorkGridSlice, SliceContext>;

/** Case study cards, filled from the Case Study pages. */
const WorkGrid = async ({ slice, context }: WorkGridProps) => {
  if (slice.variation === "more") {
    const { title, limit, link } = slice.primary;
    const cards = (await getProjectCards(context?.caseStudy?.uid ?? "")).slice(0, limit || 3);
    const href = asLink(link);
    if (!cards.length) return null;
    return (
      <StyledContainer
        data-slice-type={slice.slice_type}
        slice={{ primary: { top_padding: "Full", bottom_padding: "Half" } }}
        className="flex flex-col gap-10"
      >
        <div className="flex flex-wrap items-end justify-between gap-5">
          <PrismicTitle field={title} className="text-title-2x-large text-text-heading" emClassName="text-primary-light" />
          {href && (
            <Link href={href} className="inline-flex items-center gap-2 text-body-base-bold text-primary-light hover:underline">
              {("text" in link && link.text) || "See all work"} <ArrowUpRight size={14} />
            </Link>
          )}
        </div>
        <ul data-reveal-stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map(({ key, card }) => (
            <li key={key} className={clsx(cards.length === 3 && "last:sm:max-lg:col-span-2")}>
              <ProjectCard c={card} />
            </li>
          ))}
        </ul>
      </StyledContainer>
    );
  }

  const { eyebrow, title, intro } = slice.primary;
  const cards = await getProjectCards();
  const hasHeading = isFilled.richText(title);
  return (
    <StyledContainer
      data-slice-type={slice.slice_type}
      slice={{ primary: { top_padding: "Half", bottom_padding: "Full" } }}
      className="flex flex-col gap-12 md:gap-16"
    >
      {(eyebrow || hasHeading || intro) && (
        <div className="flex flex-col items-center text-center gap-4 max-w-[860px] mx-auto pt-6">
          {eyebrow && (
            <p className="inline-flex items-center gap-2.5 text-[13px] font-medium uppercase tracking-[0.14em] text-primary-light">
              <span className="size-2 rounded-full bg-primary-light" /> {eyebrow}
            </p>
          )}
          <PrismicTitle field={title} className="text-title-2x-large text-text-heading" emClassName="text-primary-light" />
          {intro && <p className="text-body-base text-text-description">{intro}</p>}
        </div>
      )}
      <ul data-reveal-stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map(({ key, card }) => (
          <li key={key}>
            <ProjectCard c={card} headingLevel={hasHeading ? "h2" : "h3"} />
          </li>
        ))}
      </ul>
    </StyledContainer>
  );
};

export default WorkGrid;
