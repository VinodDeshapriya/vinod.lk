import GoogleColor from "atd-icons/dist/GoogleColor";
import { PrismicNextLink } from "@prismicio/next";
import { isFilled, type Content } from "@prismicio/client";
import Stars from "./Stars";

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

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-7 bg-white border border-border-primary rounded-3xl sm:rounded-full p-4 sm:py-3.5 sm:pl-6 sm:pr-3.5">
      <div className="flex items-center gap-4">
        <GoogleColor size={36} />
        <div className="flex flex-col gap-0.5">
          <p className="text-body-base-bold text-text-heading">Excellent on Google</p>
          <div className="flex items-center gap-2 text-body-small">
            <span className="text-text-heading">{d.google_rating}</span>
            <Stars />
            {count ? <span className="text-text-inactive">({count})</span> : null}
          </div>
        </div>
      </div>
      {isFilled.link(d.google_review_link) && (
        <PrismicNextLink
          field={d.google_review_link}
          className="btn btn-primary min-w-0! h-12! text-body-base-bold"
        >
          {d.google_review_link.text || "Review us on Google"}
        </PrismicNextLink>
      )}
    </div>
  );
}
