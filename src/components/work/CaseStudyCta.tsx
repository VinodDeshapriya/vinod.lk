import Image from "next/image";
import StyledButton from "@/components/ui/StyledButton";

/** Closing call to action, same look as the CTA slice (cta_variants1). */
export default function CaseStudyCta({ title, text }: { title: string; text: string }) {
  return (
    <section className="px-6 py-4 md:py-10 xl:py-20">
      <div className="relative isolate overflow-hidden rounded-[24px] bg-[#05070c] px-4 py-10 md:px-8 md:py-[113px] lg:px-[55px] lg:py-[150px]">
        <Image src="/images/cta-background.webp" alt="" fill sizes="100vw" className="-z-10 object-cover" />
        <div className="mx-auto max-w-320 flex flex-col items-center gap-6 md:gap-10 text-center text-white">
          <div className="flex flex-col gap-2.5 w-full px-5 md:px-8 lg:px-[120px]">
            <h2 className="font-title font-medium text-[32px] leading-[38px] md:text-[48px] md:leading-[56px]">{title}</h2>
            <p className="text-[16px] leading-[26px] md:text-[18px] md:leading-[30px]">{text}</p>
          </div>
          <div data-reveal className="flex flex-col sm:flex-row gap-[18px] w-full sm:w-auto max-sm:[&_.btn]:w-full">
            <StyledButton link="/contact" label="Start your project" variant="Primary" />
            <StyledButton link="/work" label="See more work" variant="Secondary" />
          </div>
        </div>
      </div>
    </section>
  );
}
