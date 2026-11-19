import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import StyledContainer from "@/components/ui/StyledContainer";
import PrismicTitle from "@/components/ui/PrismicTitle";
import Calendar from "atd-icons/dist/Calendar";
import Whatsapp from "atd-icons/dist/Whatsapp";
import ProjectForm from "./ProjectForm";

export type ContactFormProps = SliceComponentProps<Content.ContactFormSlice>;

/** Figma: Contact › "Section 2 — Project form (redesign)" (19268:27892) */
const ContactForm = ({ slice }: ContactFormProps) => {
  const p = slice.primary;
  return (
    <StyledContainer
      as="section"
      slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }}
      parentClassName="bg-offwhite-2"
      className="flex flex-col lg:flex-row lg:justify-center gap-12 lg:gap-10"
    >
      <div className="lg:w-[464px] shrink-0 flex flex-col items-start gap-[18px] lg:pt-10">
        {p.eyebrow && <p className="text-body-base-bold text-primary-light">{p.eyebrow}</p>}
        <PrismicTitle field={p.title} className="font-title font-medium text-[40px] leading-[48px] lg:text-[52px] lg:leading-[60px] tracking-[-0.02em] text-text-heading" />
        <div className="flex flex-col gap-5 text-body-small text-text-description [&_a]:text-primary-light [&_a]:underline">
          <PrismicRichText field={p.text} />
        </div>
        <div className="flex flex-wrap gap-2.5">
          {p.buttons.map(({ link }, i) => (
            <PrismicNextLink
              key={i}
              field={link}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border-primary text-body-small text-text-heading hover:border-primary-light hover:text-primary-light transition-colors"
            >
              {/wa\.me|whatsapp/i.test(("url" in link && link.url) || "") || /whatsapp/i.test(link.text ?? "") ? (
                <Whatsapp size={16} aria-hidden />
              ) : (
                <Calendar size={16} aria-hidden />
              )}
              {link.text}
            </PrismicNextLink>
          ))}
        </div>
      </div>
      <ProjectForm
        services={p.services.map((s) => s.label).filter((s): s is string => !!s)}
        budgets={p.budgets.map((b) => b.label).filter((b): b is string => !!b)}
        submitLabel={p.submit_label || "Send My Project Details"}
        successMessage={p.success_message || "Thanks! I'll reply within one working day."}
        privacyLink={p.privacy_link}
      />
    </StyledContainer>
  );
};

export default ContactForm;
