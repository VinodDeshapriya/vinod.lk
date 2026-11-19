import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import LogoMarquee from "@/components/ui/LogoMarquee";

export type LogoBarProps = SliceComponentProps<Content.LogoBarSlice>;

/** Figma: 📦 Components › Social Proof Variants › social-proof_logos_variants1 */
const LogoBar = ({ slice }: LogoBarProps) => (
  <section
    data-slice-type={slice.slice_type}
    data-slice-variation={slice.variation}
    className="py-10 flex flex-col gap-[7px]"
  >
    {slice.primary.label && (
      <p className="text-body-x-small text-text-heading text-center px-4">
        {slice.primary.label}
      </p>
    )}
    <LogoMarquee logos={slice.primary.logos} />
  </section>
);

export default LogoBar;
