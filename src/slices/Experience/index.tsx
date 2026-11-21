import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import StyledContainer from "@/components/ui/StyledContainer";
import SplitHeading from "@/components/ui/SplitHeading";
import SliceIcon from "@/components/ui/SliceIcon";

export type ExperienceProps = SliceComponentProps<Content.ExperienceSlice>;

/** Figma: About › "Section 3 — Experience" (19268:9244) */
const Experience = ({ slice }: ExperienceProps) => {
  const { eyebrow, title, intro, jobs, education_label, education } = slice.primary;
  return (
    <StyledContainer
      as="section"
      slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }}
      className="flex flex-col gap-14"
    >
      <SplitHeading eyebrow={eyebrow} title={title} intro={intro} />

      <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {jobs.map((job, i) => {
          const current = /present/i.test(job.dates ?? "");
          return (
          <li key={i} className="flex flex-col">
            <div aria-hidden className="hidden lg:flex items-center h-[34px]">
              <span className={`size-3.5 shrink-0 rounded-full ${current ? "bg-primary-light ring-4 ring-info-bg" : "bg-surface border-2 border-primary-light"}`} />
              <span className="flex-1 h-0.5 bg-border-primary" />
            </div>
            <article
              className={`flex-1 flex flex-col gap-3 p-7 rounded-[24px] border shadow-[0_16px_24px_0_rgba(10,18,33,0.05)] ${
                current ? "bg-surface border-primary-light ring-1 ring-primary-light/30" : "bg-offwhite-2 border-border-secondary"
              }`}
            >
              <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-primary-light">{job.dates}</p>
              <h3 className="text-[20px] leading-[30px] font-title font-medium text-text-heading">{job.role}</h3>
              <p className="text-body-base text-text-heading">{job.company}</p>
              <p className="text-body-small text-text-description">{job.text}</p>
            </article>
          </li>
          );
        })}
      </ol>

      {education.length > 0 && (
        <div className="flex flex-col lg:flex-row lg:items-center gap-5">
          <p className="lg:w-[200px] shrink-0 text-[13px] font-medium uppercase tracking-[0.14em] text-text-inactive">
            {education_label}
          </p>
          <ul className="flex-1 grid md:grid-cols-2 gap-5">
            {education.map((e, i) => (
              <li key={i} className="flex items-center gap-4 p-6 rounded-[20px] bg-offwhite-2 border border-border-secondary">
                <span className="p-3 rounded-[14px] bg-info-bg text-primary-light">
                  <SliceIcon name={e.icon} size={24} />
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-[18px] leading-[30px] font-title font-medium text-text-heading">{e.title}</span>
                  <span className="text-body-small text-text-description">{e.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </StyledContainer>
  );
};

export default Experience;
