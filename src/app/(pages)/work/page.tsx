import type { Metadata } from "next";
import { SliceZone } from "@prismicio/react";
import { asImageSrc } from "@prismicio/client";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { getLayoutData } from "@/lib/layoutData";
import StyledContainer from "@/components/ui/StyledContainer";
import { caseStudies, toCard } from "@/data/caseStudies";
import ProjectCard from "@/components/work/ProjectCard";
import CaseStudyCta from "@/components/work/CaseStudyCta";

/** The Work page is the Prismic page "work"; the local version shows until it exists. */
const getPage = () =>
  createClient()
    .getByUID("page", "work")
    .catch(() => null);

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage();
  const image = page ? asImageSrc(page.data.meta_image) : null;
  return {
    title: page?.data.meta_title || "Work: Website Design Case Studies",
    description:
      page?.data.meta_description ||
      "Website design and build case studies from vinod.lk: consultancies, hotels, tour companies, temples and engineering firms across Sri Lanka.",
    alternates: { canonical: "/work" },
    openGraph: image ? { images: [{ url: image }] } : undefined,
  };
}

export default async function WorkPage() {
  const page = await getPage();
  if (page) {
    const { settings } = await getLayoutData();
    return <SliceZone slices={page.data.slices} components={components} context={{ settings }} />;
  }

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
              <ProjectCard c={toCard(c)} headingLevel="h2" />
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
