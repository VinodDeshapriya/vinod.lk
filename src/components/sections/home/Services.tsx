import Link from "next/link";
import StyledContainer from "@/components/ui/StyledContainer";
import StyledButton from "@/components/ui/StyledButton";
import SectionHeading from "@/components/ui/SectionHeading";
import Highlight from "@/components/ui/Highlight";
import ArrowUpRight from "@/components/ui/ArrowUpRight";
import { services } from "@/data/services";

/** Figma: Home Page › Services (19260:1699) */
export default function Services() {
  return (
    <StyledContainer
      as="section"
      slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }}
      parentClassName="bg-offwhite-2"
      className="flex flex-col gap-(--spacing-space-1) items-center"
    >
      <SectionHeading
        title={
          <>
            Websites, branding and systems,
            <br />
            <Highlight>all under one roof</Highlight>
          </>
        }
        intro="Whether you need your first business website, a full rebrand or a booking system that saves you hours each week, Vinod.lk handles it end to end. One team, one plan, and no passing you between agencies."
      />

      <ul className="w-full grid sm:grid-cols-2 lg:grid-cols-3 bg-white border border-border-primary rounded-lg overflow-hidden shadow-[0_12px_40px_0_rgba(10,18,33,0.05)]">
        {services.map((s) => (
          <li
            key={s.href}
            className="border-border-secondary border-b sm:[&:nth-child(odd)]:border-r lg:[&:nth-child(odd)]:border-r-0 lg:[&:not(:nth-child(3n))]:border-r lg:[&:nth-last-child(-n+3)]:border-b-0"
          >
            <Link
              href={s.href}
              className="group flex flex-col gap-2.5 h-full min-h-[240px] lg:h-[280px] p-6 lg:p-8 hover:bg-offwhite-2 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-[0.14em] text-text-inactive">
                  {s.label}
                </span>
                <span className="size-10 rounded-full border border-border-primary bg-white flex items-center justify-center text-primary-light transition-colors group-hover:bg-primary-light group-hover:border-primary-light group-hover:text-white">
                  <ArrowUpRight size={18} />
                </span>
              </div>
              <div className="grow" />
              <h3 className="text-title-base text-text-heading">{s.title}</h3>
              <p className="text-body-small text-text-description">
                {s.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <StyledButton label="All services" link="/services" variant="Secondary" />
    </StyledContainer>
  );
}
