import clsx from "clsx";
import { type Content, isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import Link from "next/link";
import PrismicTitle from "@/components/ui/PrismicTitle";
import PrismicButtons from "@/components/ui/PrismicButtons";
import LogoMarquee from "@/components/ui/LogoMarquee";
import Eyebrow from "@/components/ui/Eyebrow";
import CheckDot from "@/components/ui/CheckDot";
import StyledContainer from "@/components/ui/StyledContainer";
import ScrollTilt from "@/components/ui/ScrollTilt";

export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Figma: hero_variants4 (19350:5778) for "default"; the service pages'
 * "Section 1 — Hero" (e.g. 19268:13844) for "split"; About's hero (19268:10147) for "portrait".
 */
const Hero = ({ slice }: HeroProps) => {
  if (slice.variation === "split") return <SplitHero slice={slice} />;
  if (slice.variation === "portrait") return <PortraitHero slice={slice} />;
  return <CentredHero slice={slice} />;
};

export default Hero;

type Variation<V extends Content.HeroSlice["variation"]> = Extract<Content.HeroSlice, { variation: V }>;

function CentredCopy({
  eyebrow,
  title,
  description,
  medium = false,
  children,
}: {
  eyebrow: string | null;
  title: Content.HeroSliceDefaultPrimary["title"];
  description: string | null;
  /** Smaller title (60px), as on How it works. */
  medium?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[1026px] flex flex-col items-center gap-6 text-center">
      <div className="flex flex-col items-center gap-3.5">
        {eyebrow && <p className="text-title-base-blog text-text-heading">{eyebrow}</p>}
        <PrismicTitle
          field={title}
          className={`${medium ? "text-title-2x-large" : "text-title-3x-large"} text-text-heading`}
        />
        {description && <p className="text-body-base text-text-description">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function CentredHero({ slice }: { slice: Variation<"default"> }) {
  const { eyebrow, title, title_size, description, buttons, highlights, showcase_image, logos_label, logos } =
    slice.primary;
  const checks = (highlights ?? []).filter((h) => h.text);
  // A text-only hero (no showcase image, no logo row) gets a full 120px below the buttons.
  const textOnly = !isFilled.image(showcase_image) && !(logos?.length > 0);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={clsx("pt-10 lg:pt-[58px] overflow-hidden", textOnly ? "pb-[60px] md:pb-[120px]" : "pb-10")}
    >
      <div className="px-4 md:px-10 xl:px-20">
        <CentredCopy eyebrow={eyebrow} title={title} description={description} medium={title_size === "Medium"}>
          <PrismicButtons buttons={buttons} />
          {checks.length > 0 && (
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {checks.map((c, i) => (
                <li key={i} className="flex items-center gap-2 text-body-small text-text-heading">
                  <CheckDot size={18} />
                  {c.text}
                </li>
              ))}
            </ul>
          )}
        </CentredCopy>
      </div>

      {isFilled.image(showcase_image) && (
        <div className="mt-8 md:mt-10 px-4 lg:px-[25px]">
          {/* Tilts back and eases flat as the page scrolls (awmedia.marketing pattern). */}
          <ScrollTilt className="mx-auto max-w-[1390px] rounded-md lg:rounded-lg overflow-hidden bg-primary-dark shadow-[0_40px_80px_-30px_rgba(10,23,51,0.45)]">
            <PrismicNextImage
              field={showcase_image}
              priority
              sizes="(min-width: 1440px) 1390px, 100vw"
              className="w-full h-auto"
            />
          </ScrollTilt>
        </div>
      )}

      {logos?.length > 0 && (
        <div className="mt-10 flex flex-col gap-[7px]">
          {logos_label && (
            <p className="text-body-x-small text-text-heading text-center px-4">{logos_label}</p>
          )}
          <LogoMarquee logos={logos} />
        </div>
      )}
    </section>
  );
}

function Badge({ title, text }: { title: string | null; text: string | null }) {
  if (!title && !text) return null;
  return (
    <div className="absolute left-4 bottom-4 lg:left-6 lg:bottom-6 flex items-center gap-3 px-[18px] py-3.5 rounded-[18px] bg-white shadow-[0_16px_48px_0_rgba(10,18,33,0.05)]">
      <CheckDot size={26} />
      <div className="flex flex-col gap-0.5">
        {title && <p className="text-body-base-bold text-text-heading">{title}</p>}
        {text && <p className="text-body-small text-text-description">{text}</p>}
      </div>
    </div>
  );
}

function SplitHero({ slice }: { slice: Variation<"split"> }) {
  const { parent_link, eyebrow, title, description, buttons, image, badge_title, badge_text } =
    slice.primary;
  return (
    <StyledContainer
      as="section"
      parentClassName="pt-10 lg:pt-14 pb-14 lg:pb-24"
      className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16"
    >
      <div className="flex-1 min-w-0 flex flex-col items-start">
        <nav aria-label="Breadcrumb" className="mb-7 text-body-small">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="text-text-inactive hover:text-primary-light">
                Home
              </Link>
            </li>
            {isFilled.link(parent_link) && (
              <>
                <li aria-hidden className="text-border-primary">/</li>
                <li>
                  <PrismicNextLink field={parent_link} className="text-text-inactive hover:text-primary-light" />
                </li>
              </>
            )}
            {eyebrow && (
              <>
                <li aria-hidden className="text-border-primary">/</li>
                <li aria-current="page" className="text-text-heading">{eyebrow}</li>
              </>
            )}
          </ol>
        </nav>
        <Eyebrow className="mb-[18px]">{eyebrow}</Eyebrow>
        <PrismicTitle
          field={title}
          className="font-title font-medium text-[40px] leading-[46px] lg:text-[56px] lg:leading-[64px] tracking-[-0.027em] text-text-heading"
        />
        {description && <p className="mt-6 text-body-base text-text-description">{description}</p>}
        <PrismicButtons buttons={buttons} className="mt-9 sm:gap-4" />
      </div>
      {isFilled.image(image) && (
        <div className="relative w-full lg:w-[560px] shrink-0 aspect-[560/520] rounded-[28px] overflow-hidden bg-primary-dark">
          <PrismicNextImage
            field={image}
            fill
            priority
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover"
            fallbackAlt=""
          />
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(8,13,26,0)_45%,rgba(8,13,26,0.55))]" />
          <Badge title={badge_title} text={badge_text} />
        </div>
      )}
    </StyledContainer>
  );
}

function PhotoBadge({ text, dot }: { text: string | null; dot: string }) {
  if (!text) return null;
  return (
    <span className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-body-small text-text-heading">
      <span aria-hidden className={`size-2 rounded-full ${dot}`} />
      {text}
    </span>
  );
}

function PortraitHero({ slice }: { slice: Variation<"portrait"> }) {
  const { eyebrow, title, description, buttons, portrait, portrait_badge, photo, photo_badge } =
    slice.primary;
  return (
    <StyledContainer as="section" parentClassName="pt-10 lg:pt-[58px] pb-14 lg:pb-20">
      <CentredCopy eyebrow={eyebrow} title={title} description={description}>
        <PrismicButtons buttons={buttons} />
      </CentredCopy>
      <div className="mt-10 flex flex-col md:flex-row gap-5">
        <div className="relative md:w-[440px] shrink-0 aspect-[440/560] rounded-[28px] overflow-hidden bg-primary-dark">
          {isFilled.image(portrait) && (
            <PrismicNextImage field={portrait} fill priority sizes="(min-width: 768px) 440px, 100vw" className="object-cover" fallbackAlt="" />
          )}
          <div className="absolute left-6 bottom-6">
            <PhotoBadge text={portrait_badge} dot="bg-primary-light" />
          </div>
        </div>
        <div className="relative flex-1 min-h-[320px] rounded-[28px] overflow-hidden bg-primary-dark">
          {isFilled.image(photo) && (
            <PrismicNextImage field={photo} fill sizes="(min-width: 768px) 820px, 100vw" className="object-cover" fallbackAlt="" />
          )}
          <div className="absolute left-6 top-6">
            <PhotoBadge text={photo_badge} dot="bg-success-primary" />
          </div>
        </div>
      </div>
    </StyledContainer>
  );
}
