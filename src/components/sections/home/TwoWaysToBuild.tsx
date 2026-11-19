import clsx from "clsx";
import Link from "next/link";
import Time from "atd-icons/dist/Time";
import Pencil from "atd-icons/dist/Pencil";
import DocumentText from "atd-icons/dist/DocumentText";
import Refresh from "atd-icons/dist/Refresh";
import Headset from "atd-icons/dist/Headset";
import Trophy from "atd-icons/dist/Trophy";
import ShieldCheckmark from "atd-icons/dist/ShieldCheckmark";
import Flash from "atd-icons/dist/Flash";
import Bulb from "atd-icons/dist/Bulb";
import Checkmark from "atd-icons/dist/Checkmark";
import ArrowForward from "atd-icons/dist/ArrowForward";
import StyledContainer from "@/components/ui/StyledContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import Highlight from "@/components/ui/Highlight";

type RowKey =
  | "turnaround"
  | "design"
  | "content"
  | "revisions"
  | "support"
  | "bestFor"
  | "custom";

/** Row labels with the fixed desktop row height from the design, so labels and both lanes line up. */
const rows: {
  key: RowKey;
  label: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  h: string;
  emphasis?: boolean;
}[] = [
  { key: "turnaround", label: "Turnaround", Icon: Time, h: "lg:h-[84px]", emphasis: true },
  { key: "design", label: "Design process", Icon: Pencil, h: "lg:h-[96px]" },
  { key: "content", label: "Content & copy", Icon: DocumentText, h: "lg:h-[108px]" },
  { key: "revisions", label: "Revisions", Icon: Refresh, h: "lg:h-[84px]", emphasis: true },
  { key: "support", label: "Support after launch", Icon: Headset, h: "lg:h-[108px]" },
  { key: "bestFor", label: "Best for", Icon: Trophy, h: "lg:h-[96px]" },
  { key: "custom", label: "Custom vs templated", Icon: ShieldCheckmark, h: "lg:h-[84px]" },
];

const lanes = [
  {
    pill: "Lane 1",
    name: "Fast Track",
    tagline: "Launch sooner. Still never a template.",
    Icon: Flash,
    dark: false,
    values: {
      turnaround: "2 to 4 weeks",
      design: "AI-assisted layouts, refined by hand",
      content: "You send the content; AI polishes it, we edit and add SEO",
      revisions: "3 rounds",
      support: "Lifetime support. Changes after go-live billed at an hourly rate",
      bestFor: "Startups, small businesses, quick launches",
      custom: "Custom-designed. Never templated.",
    },
  },
  {
    pill: "Lane 2",
    name: "Full Custom",
    tagline: "Go deeper. More research, more polish.",
    Icon: Bulb,
    dark: true,
    values: {
      turnaround: "4 to 8 weeks",
      design: "Hand-crafted from a blank page, with deeper research",
      content:
        "You send the content; we rewrite it by hand, AI assisting, with keyword research",
      revisions: "5 rounds",
      support: "Lifetime support. Changes after go-live billed at an hourly rate",
      bestFor: "Established brands, ecommerce and complex sites",
      custom: "Custom-designed. Never templated.",
    },
  },
] satisfies {
  pill: string;
  name: string;
  tagline: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  dark: boolean;
  values: Record<RowKey, string>;
}[];

/** Figma: Home Page › Two ways to build (19262:1770) */
export default function TwoWaysToBuild() {
  return (
    <StyledContainer
      as="section"
      slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }}
      parentClassName="bg-offwhite-2"
      className="flex flex-col gap-10"
    >
      <SectionHeading
        title={
          <>
            Two ways to build. Both
            <br />
            fully <Highlight>custom</Highlight>.
          </>
        }
        intro="Both options are designed only for you. The difference is speed and depth, so pick the one that fits your launch date and budget."
        className="[&>p]:max-w-[692px]"
      />

      <div className="flex flex-col lg:flex-row gap-5 items-stretch">
        {/* Row labels (desktop only) */}
        <ul className="hidden lg:flex flex-col w-[280px] shrink-0 pt-px">
          <li className="h-[200px]" aria-hidden />
          {rows.map(({ key, label, Icon, h }) => (
            <li
              key={key}
              className={clsx(
                "flex items-center gap-3.5 border-t border-border-primary",
                h,
              )}
            >
              <span className="p-[9px] rounded-xs bg-info-bg text-primary-light">
                <Icon size={20} />
              </span>
              <span className="text-body-base-bold text-text-heading">
                {label}
              </span>
            </li>
          ))}
        </ul>

        {lanes.map((lane) => (
          <div
            key={lane.name}
            className={clsx(
              "relative flex-1 min-w-0 overflow-hidden rounded-lg flex flex-col",
              lane.dark
                ? "border-[1.5px] border-primary-light text-white shadow-[0_24px_60px_0_rgba(20,128,247,0.28)] bg-[linear-gradient(116deg,#080d1a_0%,#0a1733_46%,#0f479e_71%)]"
                : "bg-white border border-border-primary shadow-[0_16px_48px_0_rgba(10,18,33,0.06)]",
            )}
          >
            {lane.dark && (
              <div
                aria-hidden
                className="absolute -top-36 left-1/3 w-[420px] h-[320px] rounded-full bg-primary-light/40 blur-[90px]"
              />
            )}
            <div className="relative flex flex-col gap-3 p-6 pb-8 lg:p-8 lg:pb-0 lg:h-[200px]">
              <div className="flex items-center justify-between">
                <span
                  className={clsx(
                    "p-3 rounded-[14px]",
                    lane.dark
                      ? "bg-primary-light text-white"
                      : "bg-info-bg text-primary-light",
                  )}
                >
                  <lane.Icon size={22} />
                </span>
                <span
                  className={clsx(
                    "px-3 py-1.5 rounded-full border text-[13px] font-medium uppercase tracking-[0.14em]",
                    lane.dark
                      ? "bg-white/10 border-white/20 text-white/85"
                      : "border-border-primary text-text-inactive",
                  )}
                >
                  {lane.pill}
                </span>
              </div>
              <h3 className="text-title-medium">{lane.name}</h3>
              <p
                className={clsx(
                  "text-body-small",
                  lane.dark ? "text-white/75" : "text-text-description",
                )}
              >
                {lane.tagline}
              </p>
            </div>

            <dl className="relative">
              {rows.map(({ key, label, h, emphasis }) => (
                <div
                  key={key}
                  className={clsx(
                    "flex flex-col justify-center gap-1 px-6 py-4 lg:px-8 lg:py-0 border-t",
                    lane.dark ? "border-white/10" : "border-border-secondary",
                    h,
                  )}
                >
                  <dt
                    className={clsx(
                      "lg:sr-only text-xs uppercase tracking-[0.12em] font-medium",
                      lane.dark ? "text-white/50" : "text-text-inactive",
                    )}
                  >
                    {label}
                  </dt>
                  <dd
                    className={clsx(
                      key === "custom" && "flex items-center gap-3",
                      emphasis
                        ? "text-title-base font-semibold!"
                        : key === "custom"
                          ? "text-body-base-bold"
                          : clsx(
                              "text-body-base",
                              lane.dark ? "text-white/80" : "text-text-description",
                            ),
                    )}
                  >
                    {key === "custom" && (
                      <span className="p-1 rounded-full bg-success-primary text-white">
                        <Checkmark size={14} />
                      </span>
                    )}
                    {lane.values[key]}
                  </dd>
                </div>
              ))}
            </dl>

            <div
              className={clsx(
                "relative mt-auto px-6 lg:px-8 py-6 lg:h-[112px] flex items-center border-t",
                lane.dark ? "border-white/10" : "border-border-secondary",
              )}
            >
              <Link
                href="/contact"
                className={clsx(
                  "w-full flex items-center justify-center gap-2.5 py-[15px] rounded-full text-body-base-bold transition-colors",
                  lane.dark
                    ? "bg-primary-light text-white hover:bg-white hover:text-text-heading"
                    : "border-[1.5px] border-text-heading text-text-heading hover:bg-text-heading hover:text-white",
                )}
              >
                Get a Free Quote
                <ArrowForward size={18} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </StyledContainer>
  );
}
