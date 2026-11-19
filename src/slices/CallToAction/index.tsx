import { type Content, isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import PrismicTitle from "@/components/ui/PrismicTitle";
import PrismicButtons from "@/components/ui/PrismicButtons";

export type CallToActionProps = SliceComponentProps<Content.CallToActionSlice>;

/** Figma: 📦 Components › CTA Section Variants › cta_variants1 (19336:3393) */
const CallToAction = ({ slice }: CallToActionProps) => {
  const { title, intro, background_image, buttons } = slice.primary;
  return (
    <section
      data-slice-type={slice.slice_type}
      className="px-4 lg:px-6 py-10 lg:py-(--spacing-horizontal-padding)"
    >
      <div className="relative overflow-hidden rounded-md lg:rounded-[24px] bg-[#05070c] px-6 py-20 md:px-[55px] lg:py-[150px]">
        {isFilled.image(background_image) ? (
          <PrismicNextImage
            field={background_image}
            fill
            sizes="100vw"
            className="object-cover"
            fallbackAlt=""
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 blur-3xl opacity-90"
            style={{
              background: [
                "radial-gradient(60% 45% at 8% 62%, rgba(110,200,255,.75), transparent 70%)",
                "radial-gradient(55% 35% at 30% 20%, rgba(21,90,248,.7), transparent 70%)",
                "radial-gradient(45% 30% at 70% 85%, rgba(60,170,255,.75), transparent 70%)",
                "radial-gradient(40% 40% at 95% 50%, rgba(21,127,248,.7), transparent 70%)",
              ].join(","),
            }}
          />
        )}
        <div className="relative mx-auto max-w-320 flex flex-col items-center gap-10 text-center text-white">
          <div className="flex flex-col gap-2.5 max-w-260">
            <PrismicTitle field={title} className="text-title-x-large" emClassName="" />
            {intro && <p className="text-body-base">{intro}</p>}
          </div>
          <PrismicButtons buttons={buttons} />
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
