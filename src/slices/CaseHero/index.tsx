import Link from "next/link";
import clsx from "clsx";
import { asLink, isFilled, type Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import PrismicTitle from "@/components/ui/PrismicTitle";
import StyledButton from "@/components/ui/StyledButton";
import ScrollTilt from "@/components/ui/ScrollTilt";
import { BrowserFrame, PhoneFrame, ShotImage } from "@/components/work/Frames";
import { toShot } from "@/lib/shots";
import type { SliceContext } from "@/lib/sliceContext";

export type CaseHeroProps = SliceComponentProps<
  Content.CaseHeroSlice,
  SliceContext
>;

/** Case study hero: breadcrumb, title, status + tags, buttons, laptop and phone mockups. */
const CaseHero = ({ slice, context }: CaseHeroProps) => {
  const { title, intro, tags, buttons, desktop_image, mobile_image } =
    slice.primary;
  const doc = context?.caseStudy?.data;
  const name = doc?.name || "Project";
  const status = doc?.status ?? "Live";
  const live = doc ? asLink(doc.live_url) : null;
  // Only a real external address counts as "the live site" (not an internal page).
  const liveHref =
    (live && /^https?:\/\//.test(live) ? live : null) ||
    (buttons ?? [])
      .map(({ link }) =>
        isFilled.link(link) && link.link_type === "Web" ? asLink(link) : null,
      )
      .find((href) => !!href && /^https?:\/\//.test(href)) ||
    null;
  const desktop = toShot(desktop_image, `${name} website`);
  const phone = toShot(mobile_image, `${name} on mobile`);
  const tagList = (tags ?? "")
    .split("|")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <section
      data-slice-type={slice.slice_type}
      className="relative overflow-hidden pt-10 lg:pt-14 pb-10"
    >
      <div className="px-4 md:px-10 xl:px-20">
        <div className="mx-auto max-w-[1040px] flex flex-col items-center text-center gap-6">
          <nav
            aria-label="Breadcrumb"
            className="inline-flex items-center gap-2 h-8 px-4 rounded-full border border-border-primary bg-surface text-[12px] font-medium uppercase tracking-[0.14em]"
          >
            <Link
              href="/work"
              className="text-text-inactive hover:text-primary-light transition-colors"
            >
              Work
            </Link>
            <span className="text-text-inactive" aria-hidden>
              /
            </span>
            <span className="text-text-heading" aria-current="page">
              {name}
            </span>
          </nav>
          <PrismicTitle
            field={title}
            className="text-title-2x-large text-text-heading text-balance"
            emClassName="text-primary-light"
          />
          {intro && (
            <p className="text-body-base text-text-description max-w-[760px]">
              {intro}
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-2" data-reveal>
            <span
              className={clsx(
                "inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full text-[12px] font-medium uppercase tracking-[0.12em]",
                status === "Live"
                  ? "bg-info-bg text-primary-light"
                  : "bg-amber-50 text-amber-700",
              )}
            >
              <span
                className={clsx(
                  "size-1.5 rounded-full",
                  status === "Live" ? "bg-primary-light" : "bg-amber-500",
                )}
              />
              {status}
            </span>
            {tagList.map((t) => (
              <span
                key={t}
                className="inline-flex items-center h-8 px-3.5 rounded-full border border-border-primary bg-surface text-[13px] text-text-description"
              >
                {t}
              </span>
            ))}
          </div>
          {/* Fixed order for every case study: start a project first (opens the quote popup),
              then the live site. The live address comes from the case study's "Live URL"
              or, failing that, an external link in the Prismic buttons. */}
          <div
            data-reveal
            className="flex flex-col sm:flex-row gap-[18px] w-full sm:w-auto"
          >
            <StyledButton
              link="/contact#get-a-quote"
              label="Start a project like this"
              variant="Primary"
            />
            {liveHref && (
              <StyledButton
                link={liveHref}
                target="_blank"
                label="Visit the live site"
                variant="Secondary"
              />
            )}
          </div>
        </div>
      </div>

      {desktop && (
        <div className="mt-10 md:mt-14 px-4 lg:px-[25px]">
          <ScrollTilt className="relative mx-auto max-w-[1180px]">
            <BrowserFrame url={live ?? `${name} (design)`}>
              <ShotImage
                shot={desktop}
                sizes="(min-width: 1180px) 1180px, 100vw"
                priority
              />
            </BrowserFrame>
            {phone && (
              <PhoneFrame className="hidden sm:block absolute -bottom-8 right-4 md:right-10 w-[150px] md:w-[210px]">
                <div className="aspect-[375/700] overflow-hidden">
                  <ShotImage shot={phone} sizes="210px" />
                </div>
              </PhoneFrame>
            )}
          </ScrollTilt>
        </div>
      )}
    </section>
  );
};

export default CaseHero;
