"use client";
import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import StyledContainer from "@/components/ui/StyledContainer";
import StyledButton from "@/components/ui/StyledButton";
import SectionHeading from "@/components/ui/SectionHeading";
import Highlight from "@/components/ui/Highlight";
import { projects } from "@/data/projects";

/** Figma: Home Page › Recent build (19255:49174) */
export default function RecentBuild() {
  const [activeSlug, setActiveSlug] = useState(
    projects.find((p) => p.featured)?.slug,
  );
  const active = projects.find((p) => p.slug === activeSlug);
  const activeIndex = projects.findIndex((p) => p.slug === activeSlug);
  const f = active?.featured;

  return (
    <StyledContainer
      as="section"
      slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }}
      className="flex flex-col gap-10 items-center"
    >
      <SectionHeading
        title={
          <>
            Recent <Highlight>build</Highlight>
          </>
        }
        intro="A real project, from first idea to live site. See how clear UX thinking and a system-led build turned into a fast website that brings in leads, launched in about 5 weeks."
      />

      <div className="w-full flex flex-col gap-8">
        {/* Project tabs + ruler */}
        <div className="flex flex-col gap-[18px] -mx-4 md:mx-0">
          <div
            role="tablist"
            className="flex gap-8 lg:gap-[66px] justify-start lg:justify-center overflow-x-auto px-4 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {projects.map((p) => (
              <button
                key={p.slug}
                role="tab"
                type="button"
                aria-selected={p.slug === activeSlug}
                disabled={!p.featured}
                title={p.featured ? undefined : "Case study coming soon"}
                onClick={() => setActiveSlug(p.slug)}
                className={clsx(
                  "text-title-base-blog whitespace-nowrap transition-colors",
                  p.slug === activeSlug
                    ? "text-text-heading"
                    : "text-text-heading/70 hover:text-text-heading disabled:cursor-default disabled:hover:text-text-heading/70",
                )}
              >
                {p.name}
              </button>
            ))}
          </div>
          <div
            aria-hidden
            className="relative h-[31px] hidden lg:block bg-[repeating-linear-gradient(to_right,var(--color-text-inactive)_0_1px,transparent_1px_12px)] [background-size:100%_8px] bg-no-repeat bg-center"
          >
            <span
              className="absolute top-0 h-full w-0.5 bg-primary-light transition-[left] duration-300"
              style={{
                left: `${((activeIndex + 0.5) / projects.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Project card */}
        {f && (
          <article className="relative overflow-hidden rounded-lg border border-secondary-light bg-offwhite flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-[54px] pt-8 lg:pt-0 lg:pl-[60px]">
            <div className="flex flex-col justify-between gap-10 lg:h-[568px] lg:flex-1 px-6 lg:px-0">
              <div className="flex flex-col gap-[33px]">
                <Image
                  src={f.logo.src}
                  alt={active!.name}
                  width={f.logo.width}
                  height={f.logo.height}
                />
                <p className="text-title-base text-text-heading">
                  {f.headline}
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-body-small text-text-heading">
                  {f.summary}
                </p>
                <ul className="flex flex-wrap gap-1.5">
                  {f.live && (
                    <li className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-info-bg border border-primary-light text-xs leading-4 font-medium text-primary-light">
                      <span className="size-1.5 rounded-full bg-primary-light" />
                      Live
                    </li>
                  )}
                  {f.tags.map((tag) => (
                    <li
                      key={tag}
                      className="px-2.5 py-1 rounded-full bg-white border border-border-primary text-xs leading-4 font-medium text-text-description"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
                <StyledButton
                  label="View the project"
                  link={f.href}
                  variant="Link with Arrow"
                />
              </div>
            </div>
            <Image
              src={f.image.src}
              alt={f.image.alt}
              width={f.image.width}
              height={f.image.height}
              className="w-full lg:w-[770px] h-auto shrink-0"
            />
          </article>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-[18px] w-full sm:w-auto">
        <StyledButton label="Get a Free Quote" link="/contact" />
        <StyledButton label="See all projects" link="/work" variant="Secondary" />
      </div>
    </StyledContainer>
  );
}
