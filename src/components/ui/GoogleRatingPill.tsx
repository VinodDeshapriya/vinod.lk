import GoogleColor from "atd-icons/dist/GoogleColor";
import { PrismicNextLink } from "@prismicio/next";
import { isFilled, type Content } from "@prismicio/client";
import Stars from "./Stars";
import GoogleG from "@/components/icons/GoogleG";

/** Used until a review link is set in Prismic › Settings › Google review link. */
const FALLBACK_REVIEW_URL = "https://www.google.com/search?q=Vinod.lk+reviews";

/** Google rating summary from Settings › Google. `dark` = compact pill for dark bands. */
export default function GoogleRatingPill({
  settings,
  dark = false,
}: {
  settings?: Content.SettingsDocument | null;
  dark?: boolean;
}) {
  const d = settings?.data;
  if (!d?.google_rating) return null;
  const count = d.google_review_count;

  if (dark) {
    return (
      <div className="relative flex flex-wrap justify-center items-center gap-2.5 px-4 py-[9px] rounded-full bg-white/6 border border-white/14">
        <GoogleColor size={18} />
        <span className="text-body-base-bold">{d.google_rating}</span>
        <Stars />
        <span className="text-body-small text-white/70">
          on Google{count ? ` · ${count} reviews` : ""}
        </span>
      </div>
    );
  }

  // Figma testimonial_variants1 "Google rating": a pill on tablet/desktop,
  // a stacked card with a full-width button on mobile.
  return (
    <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3 sm:gap-7 bg-surface border border-border-primary rounded-[8px] sm:rounded-full p-4 sm:py-3.5 sm:pl-6 sm:pr-3.5">
      <div className="flex items-center gap-4">
        <GoogleG size={36} />
        <div className="flex flex-col gap-0.5">
          <p className="font-medium text-[16px] leading-[26px] sm:text-[18px] sm:leading-[30px] text-text-heading">
            Excellent on Google
          </p>
          <div className="flex items-center gap-2 text-[16px] leading-6">
            <span className="text-text-heading">{d.google_rating}</span>
            <Stars />
            {count ? <span className="text-text-inactive">({count})</span> : null}
          </div>
        </div>
      </div>
      {isFilled.link(d.google_review_link) ? (
        <PrismicNextLink field={d.google_review_link} className={"btn btn-primary min-w-0! w-full sm:w-auto h-[46px]! sm:h-12! px-6! font-medium text-[16px] leading-[26px] sm:text-[18px] sm:leading-[30px]"}>
          {d.google_review_link.text || "Review us on Google"}
        </PrismicNextLink>
      ) : (
        <a href={FALLBACK_REVIEW_URL} target="_blank" rel="noopener noreferrer" className={"btn btn-primary min-w-0! w-full sm:w-auto h-[46px]! sm:h-12! px-6! font-medium text-[16px] leading-[26px] sm:text-[18px] sm:leading-[30px]"}>
          Review us on Google
        </a>
      )}
    </div>
  );
}
