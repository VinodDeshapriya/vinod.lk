import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import StyledContainer from "@/components/ui/StyledContainer";
import PrismicTitle from "@/components/ui/PrismicTitle";
import GoogleRatingPill from "@/components/ui/GoogleRatingPill";
import type { SliceContext } from "@/lib/sliceContext";

export type StatsProps = SliceComponentProps<Content.StatsSlice, SliceContext>;

/** Figma: 📦 Components › Social Proof Variants › social-proof_stats_variants1 (19345:4347) */
const Stats = ({ slice, context }: StatsProps) => {
  const { title, subtitle, show_google_rating, stats } = slice.primary;
  return (
    <StyledContainer
      as="section"
      slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }}
      parentClassName="grain relative overflow-hidden bg-[linear-gradient(to_bottom,#080d1a,#0a1733)] text-white"
      className="relative flex flex-col items-center text-center"
    >
      <div
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 -top-[240px] md:-top-[260px] lg:-top-[300px] w-[343px] h-[160px] md:w-[688px] md:h-[321px] lg:w-[900px] lg:h-[420px] rounded-full bg-primary-light/35 blur-[90px]"
      />
      <PrismicTitle
        field={title}
        className="relative text-title-2x-large"
        emClassName="text-secondary-light"
      />
      {subtitle && (
        <p className="relative mt-5 text-body-base-bold text-white/85">
          {subtitle}
        </p>
      )}
      {show_google_rating && (
        <div className="relative mt-7">
          <GoogleRatingPill settings={context?.settings} dark />
        </div>
      )}

      <ul className="relative mt-16 w-full grid sm:grid-cols-2 lg:grid-cols-4 rounded-lg border border-white/12 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] overflow-hidden text-left">
        {stats.map((s, i) => (
          <li
            key={i}
            className="flex flex-col gap-6 px-8 py-10 border-white/10 border-b sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0 sm:[&:nth-last-child(-n+2)]:border-b-0"
          >
            <div className="flex flex-col gap-3">
              <p
                className={`font-title font-medium leading-[66px] bg-clip-text text-transparent bg-[linear-gradient(to_bottom,#fff,#99c9ff)] ${
                  s.large
                    ? "text-[48px] lg:text-[60px] tracking-[-0.04em]"
                    : "text-[38px] lg:text-[44px] tracking-[-0.04em]"
                }`}
              >
                {s.value}
              </p>
              <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-secondary-light">
                {s.label}
              </p>
            </div>
            <p className="text-body-small text-white/65">{s.text}</p>
          </li>
        ))}
      </ul>
    </StyledContainer>
  );
};

export default Stats;
