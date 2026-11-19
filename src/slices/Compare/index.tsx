import clsx from "clsx";
import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
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

const icons = {
  clock: Time,
  pen: Pencil,
  document: DocumentText,
  refresh: Refresh,
  headset: Headset,
  trophy: Trophy,
  shield: ShieldCheckmark,
} as const;

/** Desktop row heights from the design, by how much text a row holds. */
const rowHeight = (a?: string | null, b?: string | null) => {
  const len = Math.max(a?.length ?? 0, b?.length ?? 0);
  return len > 60 ? "lg:h-[108px]" : len > 30 ? "lg:h-[96px]" : "lg:h-[84px]";
};

export type CompareProps = SliceComponentProps<Content.CompareSlice>;

/** Figma: 📦 Components › Content Section Variants › content_compare_variants1 (19343:4029) */
const Compare = ({ slice }: CompareProps) => {
  const p = slice.primary;
  const rows = p.rows.map((r) => ({
    ...r,
    Icon: icons[(r.icon ?? "clock") as keyof typeof icons] ?? Time,
    h: rowHeight(r.lane_1_value, r.lane_2_value),
  }));
  const lanes = [
    { pill: p.lane_1_pill, name: p.lane_1_name, tagline: p.lane_1_tagline, Icon: Flash, dark: false, key: "lane_1_value" as const },
    { pill: p.lane_2_pill, name: p.lane_2_name, tagline: p.lane_2_tagline, Icon: Bulb, dark: true, key: "lane_2_value" as const },
  ];
  return (
    <StyledContainer
      as="section"
      slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }}
      parentClassName="bg-offwhite-2"
      className="flex flex-col gap-6 md:gap-10"
    >
      <SectionHeading
        title={p.title}
        intro={p.intro}
        className="[&>p]:max-w-[692px] max-md:px-5 max-md:[&>h2]:text-[36px]! max-md:[&>h2]:leading-[42px]! max-md:[&>h2]:tracking-[-0.8px]!"
      />

      {/* Mobile: lanes stack. Tablet: two lanes side by side whose rows line up
          (CSS subgrid). Desktop: label column + two lanes. */}
      <div className="flex flex-col gap-5 md:max-lg:grid md:max-lg:grid-cols-2 md:max-lg:gap-x-4 md:max-lg:gap-y-0 lg:flex-row items-stretch">
        {/* Row labels (desktop only) */}
        <ul className="hidden lg:flex flex-col w-[280px] shrink-0 pt-px">
          <li className="h-[200px]" aria-hidden />
          {rows.map(({ label, Icon, h }, i) => (
            <li
              key={i}
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
            key={lane.key}
            style={{ gridRow: `span ${rows.length + 2}` }}
            className={clsx(
              "relative flex-1 min-w-0 overflow-hidden rounded-lg flex flex-col md:max-lg:grid md:max-lg:grid-rows-subgrid",
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
            <div className="relative flex flex-col gap-3 px-5 pt-8 pb-3 md:px-6 lg:p-8 lg:pb-0 lg:h-[200px]">
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
              <div className="flex flex-col gap-1 lg:gap-3">
                <h3 className="text-title-medium max-md:leading-[30px]">{lane.name}</h3>
                <p
                  className={clsx(
                    "text-body-small",
                    lane.dark ? "text-white/75" : "text-text-description",
                  )}
                >
                  {lane.tagline}
                </p>
              </div>
            </div>

            <dl className="relative md:max-lg:contents">
              {rows.map(({ label, h, style, ...r }, i) => (
                <div
                  key={i}
                  className={clsx(
                    "relative flex flex-col justify-start lg:justify-center gap-1.5 px-5 py-4 md:px-6 lg:px-8 lg:py-0 border-t",
                    lane.dark ? "border-white/10" : "border-border-secondary",
                    h,
                  )}
                >
                  <dt
                    className={clsx(
                      "lg:sr-only text-xs leading-4 uppercase tracking-[1px] font-medium",
                      lane.dark ? "text-white/50" : "text-text-inactive",
                    )}
                  >
                    {label}
                  </dt>
                  <dd
                    className={clsx(
                      style === "check" && "flex items-center gap-3",
                      style === "emphasis"
                        ? "text-title-base font-semibold!"
                        : style === "check"
                          ? "text-body-base-bold"
                          : clsx(
                              "text-body-base",
                              lane.dark ? "text-white/80" : "text-text-description",
                            ),
                    )}
                  >
                    {style === "check" && (
                      <span className="p-1 rounded-full bg-success-primary text-white">
                        <Checkmark size={14} />
                      </span>
                    )}
                    {r[lane.key]}
                  </dd>
                </div>
              ))}
            </dl>

            <div
              className={clsx(
                "relative mt-auto h-28 px-5 md:px-6 lg:px-8 flex items-center border-t",
                lane.dark ? "border-white/10" : "border-border-secondary",
              )}
            >
              <PrismicNextLink
                field={p.cta_link}
                className={clsx(
                  "w-full flex items-center justify-center gap-2.5 py-[15px] rounded-full text-body-base-bold transition-colors",
                  lane.dark
                    ? "bg-primary-light text-white hover:bg-white hover:text-text-heading"
                    : "border-[1.5px] border-text-heading text-text-heading hover:bg-text-heading hover:text-white",
                )}
              >
                {p.cta_link.text || "Get a Free Quote"}
                <ArrowForward size={18} />
              </PrismicNextLink>
            </div>
          </div>
        ))}
      </div>
    </StyledContainer>
  );
};

export default Compare;
