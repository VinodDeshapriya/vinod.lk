import { type Content, isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import Image from "next/image";
import { PrismicNextImage } from "@prismicio/next";
import PrismicTitle from "@/components/ui/PrismicTitle";
import PrismicButtons from "@/components/ui/PrismicButtons";

export type CallToActionProps = SliceComponentProps<Content.CallToActionSlice>;

/** Shipped default for the Figma background (cta_variants1 image fill), used when Prismic has none. */
const DEFAULT_BG = "/images/cta-background.webp";

/**
 * Figma: 📦 Components › CTA Section Variants › cta_variants1
 * 1440 (19336:3393) · 768 (19336:3394) · 375 (19336:3407)
 */
const CallToAction = ({ slice }: CallToActionProps) => {
  const { title, intro, background_image, buttons } = slice.primary;
  return (
    <section
      data-slice-type={slice.slice_type}
      className="px-6 py-4 md:py-10 xl:py-20"
    >
      <div className="relative isolate overflow-hidden rounded-[24px] bg-[#05070c] px-4 py-10 md:px-8 md:py-[113px] lg:px-[55px] lg:py-[150px]">
        {isFilled.image(background_image) ? (
          <PrismicNextImage
            field={background_image}
            fill
            sizes="100vw"
            className="-z-10 object-cover"
            fallbackAlt=""
          />
        ) : (
          <Image src={DEFAULT_BG} alt="" fill sizes="100vw" className="-z-10 object-cover" />
        )}
        <div className="mx-auto max-w-320 flex flex-col items-center gap-6 md:gap-10 text-center text-white">
          <div className="flex flex-col gap-2.5 w-full px-5 md:px-8 lg:px-[120px] max-md:[&>h2]:-mx-1.5">
            <PrismicTitle
              field={title}
              className="font-title font-medium text-[32px] leading-[38px] md:text-[48px] md:leading-[56px]"
              emClassName=""
            />
            {intro && (
              <p className="text-[16px] leading-[26px] md:text-[18px] md:leading-[30px]">{intro}</p>
            )}
          </div>
          <PrismicButtons
            buttons={buttons}
            className="max-sm:[&_.btn]:w-full max-sm:[&_.btn]:h-[46px]! max-sm:[&_.btn]:text-[16px]! max-sm:[&_.btn]:leading-[26px]!"
          />
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
