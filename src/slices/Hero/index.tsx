import { type Content, isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import PrismicTitle from "@/components/ui/PrismicTitle";
import PrismicButtons from "@/components/ui/PrismicButtons";
import LogoMarquee from "@/components/ui/LogoMarquee";

export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/** Figma: 📦 Components › Hero Section Variants › hero_variants4 (19350:5778) */
const Hero = ({ slice }: HeroProps) => {
  const { eyebrow, title, description, buttons, showcase_image, logos_label, logos } =
    slice.primary;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="pt-10 lg:pt-[58px] pb-10 overflow-hidden"
    >
      <div className="px-4 md:px-10 xl:px-20">
        <div className="mx-auto max-w-[1026px] flex flex-col items-center gap-6 text-center">
          <div className="flex flex-col items-center gap-3.5">
            {eyebrow && (
              <p className="text-title-base-blog text-text-heading">{eyebrow}</p>
            )}
            <PrismicTitle field={title} className="text-title-3x-large text-text-heading" />
            {description && (
              <p className="text-body-base text-text-description">{description}</p>
            )}
          </div>
          <PrismicButtons buttons={buttons} />
        </div>
      </div>

      {isFilled.image(showcase_image) && (
        <div className="mt-10 px-4 lg:px-[25px]">
          <div className="mx-auto max-w-[1390px] rounded-md lg:rounded-lg overflow-hidden bg-primary-dark">
            <PrismicNextImage
              field={showcase_image}
              priority
              sizes="(min-width: 1440px) 1390px, 100vw"
              className="w-full h-auto"
            />
          </div>
        </div>
      )}

      {logos?.length > 0 && (
        <div className="mt-10 flex flex-col gap-[7px]">
          {logos_label && (
            <p className="text-body-x-small text-text-heading text-center px-4">
              {logos_label}
            </p>
          )}
          <LogoMarquee logos={logos} />
        </div>
      )}
    </section>
  );
};

export default Hero;
