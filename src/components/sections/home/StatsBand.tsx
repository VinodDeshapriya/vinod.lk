import GoogleColor from "atd-icons/dist/GoogleColor";
import StyledContainer from "@/components/ui/StyledContainer";
import Stars from "@/components/ui/Stars";
import { googleRating } from "@/data/testimonials";

const stats = [
  {
    value: "100%",
    label: "Custom designs",
    text: "Every site is designed for you. Never templated.",
    big: true,
  },
  {
    value: "Mobile-first",
    label: "On every build",
    text: "Built to be fast on the phones your customers actually use.",
  },
  {
    value: "SEO-ready",
    label: "From day one",
    text: "Keyword research and a sitemap, so every page has a search term to win.",
  },
  {
    value: "5+ years",
    label: "Of experience",
    text: "From graphic design to UI UX, a decade of designing for real users.",
    big: true,
  },
];

/** Figma: Home Page › Stats band (19267:1770) */
export default function StatsBand() {
  return (
    <StyledContainer
      as="section"
      slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }}
      parentClassName="relative overflow-hidden bg-[linear-gradient(to_bottom,#080d1a,#0a1733)] text-white"
      className="relative flex flex-col items-center text-center"
    >
      <div
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 -top-[300px] w-[900px] max-w-[120vw] h-[420px] rounded-full bg-primary-light/45 blur-[120px]"
      />
      <h2 className="relative text-title-2x-large">
        Websites built to rank,
        <br />
        <em className="italic text-secondary-light">across Sri Lanka</em>
      </h2>
      <p className="relative mt-5 text-body-base-bold text-white/85">
        Two ways to build. Both custom.
      </p>
      <div className="relative mt-7 flex flex-wrap justify-center items-center gap-2.5 px-4 py-[9px] rounded-full bg-white/6 border border-white/14">
        <GoogleColor size={18} />
        <span className="text-body-base-bold">{googleRating.score}</span>
        <Stars />
        <span className="text-body-small text-white/70">
          on Google · {googleRating.count} reviews
        </span>
      </div>

      <ul className="relative mt-16 w-full grid sm:grid-cols-2 lg:grid-cols-4 rounded-lg border border-white/12 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] overflow-hidden text-left">
        {stats.map((s) => (
          <li
            key={s.label}
            className="flex flex-col gap-6 px-8 py-10 border-white/10 border-b sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0 sm:[&:nth-last-child(-n+2)]:border-b-0"
          >
            <div className="flex flex-col gap-3">
              <p
                className={`font-title font-medium leading-[66px] bg-clip-text text-transparent bg-[linear-gradient(to_bottom,#fff,#99c9ff)] ${
                  s.big
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
}
