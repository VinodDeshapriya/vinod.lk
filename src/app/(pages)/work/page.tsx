import type { Metadata } from "next";
import StyledContainer from "@/components/ui/StyledContainer";
import { caseStudies } from "@/data/caseStudies";
import ProjectCard from "@/components/work/ProjectCard";
import CaseStudyCta from "@/components/work/CaseStudyCta";

export const metadata: Metadata = {
  title: "Work: Website Design Case Studies",
  description:
    "Website design and build case studies from vinod.lk: consultancies, hotels, tour companies, temples and engineering firms across Sri Lanka.",
  alternates: { canonical: "/work" },
};

/** Work index: every case study as a card. */
export default function WorkPage() {
  return (
    <>
      <StyledContainer slice={{ primary: { top_padding: "Half", bottom_padding: "Full" } }} className="flex flex-col gap-12 md:gap-16">
        <div className="flex flex-col items-center text-center gap-4 max-w-[860px] mx-auto pt-6">
          <p className="inline-flex items-center gap-2.5 text-[13px] font-medium uppercase tracking-[0.14em] text-primary-light">
            <span className="size-2 rounded-full bg-primary-light" /> Selected work
          </p>
          <h1 className="text-title-2x-large text-text-heading">
            Websites that <span className="italic text-primary-light">do a job.</span>
          </h1>
          <p className="text-body-base text-text-description">
            Real projects for real businesses across Sri Lanka: what each one needed, how we approached it, and what we built.
          </p>
        </div>
        <ul data-reveal-stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {caseStudies.map((c) => (
            <li key={c.slug}>
              <ProjectCard c={c} headingLevel="h2" />
            </li>
          ))}
        </ul>
      </StyledContainer>
      <CaseStudyCta
        title="Want results like these?"
        text="Tell me about your business and what your website needs to do. You'll get a clear plan, timeline and price."
      />
    </>
  );
}
