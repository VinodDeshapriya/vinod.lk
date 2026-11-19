import { type Content, isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import StyledContainer from "@/components/ui/StyledContainer";
import PrismicTitle from "@/components/ui/PrismicTitle";
import Eyebrow from "@/components/ui/Eyebrow";
import SliceIcon from "@/components/ui/SliceIcon";
import ArrowUpRight from "@/components/ui/ArrowUpRight";

export type SkillsServicesProps = SliceComponentProps<Content.SkillsServicesSlice>;

/** Figma: About › "Section 5 — What I do" (19268:9336) */
const SkillsServices = ({ slice }: SkillsServicesProps) => {
  const { eyebrow, title, intro, skills_label, skills, services } = slice.primary;
  const tags = (skills ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return (
    <StyledContainer
      as="section"
      slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }}
      className="flex flex-col lg:flex-row gap-12 lg:gap-20"
    >
      <div className="lg:w-[460px] shrink-0 flex flex-col items-start gap-5">
        <Eyebrow>{eyebrow}</Eyebrow>
        <PrismicTitle field={title} className="text-title-2x-large text-text-heading" />
        {intro && <p className="text-body-base text-text-description">{intro}</p>}
        {tags.length > 0 && (
          <>
            <p className="mt-5 text-[13px] font-medium uppercase tracking-[0.14em] text-text-inactive">{skills_label}</p>
            <ul className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <li key={t} className="px-3 py-[7px] rounded-full border border-border-primary text-body-small text-text-heading">
                  {t}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <ul className="flex-1 min-w-0">
        {services.map((s, i) => {
          const linked = isFilled.link(s.link);
          const inner = (
            <>
              <span className="p-3 shrink-0 rounded-[14px] bg-info-bg text-primary-light">
                <SliceIcon name={s.icon} />
              </span>
              <span className="flex-1 min-w-0 flex flex-col gap-1">
                <span className="text-[20px] leading-[30px] font-title font-medium text-text-heading group-hover:text-primary-light transition-colors">
                  {s.title}
                </span>
                <span className="text-body-small text-text-description">{s.text}</span>
              </span>
              {linked && (
                <span className="size-[38px] shrink-0 rounded-full border border-border-primary flex items-center justify-center text-primary-light transition-colors group-hover:bg-primary-light group-hover:border-primary-light group-hover:text-white">
                  <ArrowUpRight size={16} />
                </span>
              )}
            </>
          );
          return (
            <li key={i} className="border-b border-border-secondary first:pt-0">
              {linked ? (
                <PrismicNextLink field={s.link} className="group flex items-center gap-5 py-6">
                  {inner}
                </PrismicNextLink>
              ) : (
                <div className="flex items-center gap-5 py-6">{inner}</div>
              )}
            </li>
          );
        })}
      </ul>
    </StyledContainer>
  );
};

export default SkillsServices;
