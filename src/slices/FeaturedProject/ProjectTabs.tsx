"use client";
import { useState } from "react";
import clsx from "clsx";
import type { Content } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import StyledButton from "@/components/ui/StyledButton";

type Project = Content.FeaturedProjectSliceDefaultPrimaryProjectsItem;

export default function ProjectTabs({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const p = projects[active];
  if (!p) return null;
  const tags = (p.tags ?? "").split("|").map((t) => t.trim()).filter(Boolean);
  const hasCard = (x: Project) => !!x.headline;

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex flex-col gap-[18px] -mx-4 md:mx-0">
        <div
          role="tablist"
          className="flex gap-8 lg:gap-[66px] justify-start lg:justify-center overflow-x-auto px-4 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {projects.map((x, i) => (
            <button
              key={i}
              role="tab"
              type="button"
              aria-selected={i === active}
              disabled={!hasCard(x)}
              title={hasCard(x) ? undefined : "Case study coming soon"}
              onClick={() => setActive(i)}
              className={clsx(
                "text-title-base-blog whitespace-nowrap transition-colors",
                i === active
                  ? "text-text-heading"
                  : "text-text-heading/70 hover:text-text-heading disabled:cursor-default disabled:hover:text-text-heading/70",
              )}
            >
              {x.name}
            </button>
          ))}
        </div>
        <div
          aria-hidden
          className="relative h-[31px] hidden lg:block bg-[repeating-linear-gradient(to_right,var(--color-text-inactive)_0_1px,transparent_1px_12px)] [background-size:100%_8px] bg-no-repeat bg-center"
        >
          <span
            className="absolute top-0 h-full w-0.5 bg-primary-light transition-[left] duration-300"
            style={{ left: `${((active + 0.5) / projects.length) * 100}%` }}
          />
        </div>
      </div>

      <article className="relative overflow-hidden rounded-lg border border-secondary-light bg-offwhite flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-[54px] pt-8 lg:pt-0 lg:pl-[60px]">
        <div className="flex flex-col justify-between gap-10 lg:h-[568px] lg:flex-1 px-6 lg:px-0 lg:py-5">
          <div className="flex flex-col gap-[33px]">
            {isFilled.image(p.logo) && (
              <PrismicNextImage field={p.logo} className="h-[30px] w-auto self-start" />
            )}
            <p className="text-title-base text-text-heading">{p.headline}</p>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-body-small text-text-heading">{p.summary}</p>
            <ul className="flex flex-wrap gap-1.5">
              {p.is_live && (
                <li className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-info-bg border border-primary-light text-xs leading-4 font-medium text-primary-light">
                  <span className="size-1.5 rounded-full bg-primary-light" />
                  Live
                </li>
              )}
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="px-2.5 py-1 rounded-full bg-white border border-border-primary text-xs leading-4 font-medium text-text-description"
                >
                  {tag}
                </li>
              ))}
            </ul>
            {isFilled.link(p.link) && (
              <StyledButton
                field={p.link}
                label={p.link.text || "View the project"}
                variant="Link with Arrow"
              />
            )}
          </div>
        </div>
        {isFilled.image(p.image) && (
          <PrismicNextImage
            field={p.image}
            className="w-full lg:w-[770px] h-auto shrink-0"
          />
        )}
      </article>
    </div>
  );
}
