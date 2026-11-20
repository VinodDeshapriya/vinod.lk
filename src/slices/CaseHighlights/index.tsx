import { asLink, type Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import StyledContainer from "@/components/ui/StyledContainer";
import PrismicTitle from "@/components/ui/PrismicTitle";
import { BrowserFrame, ShotImage } from "@/components/work/Frames";
import { toShot } from "@/lib/shots";
import type { SliceContext } from "@/lib/sliceContext";

export type CaseHighlightsProps = SliceComponentProps<Content.CaseHighlightsSlice, SliceContext>;

/** Two-column grid of browser-framed screenshots with caption, title and text. */
const CaseHighlights = ({ slice, context }: CaseHighlightsProps) => {
  const doc = context?.caseStudy?.data;
  const name = doc?.name || "Project";
  const url = (doc && asLink(doc.live_url)) || `${name} (design)`;
  const { title, intro, items } = slice.primary;
  return (
    <StyledContainer
      data-slice-type={slice.slice_type}
      slice={{ primary: { top_padding: "Half", bottom_padding: "Full" } }}
      className="flex flex-col gap-10"
    >
      <div className="flex flex-col lg:flex-row lg:items-end gap-5 lg:gap-20">
        <div className="lg:w-[520px] shrink-0">
          <PrismicTitle field={title} className="text-title-2x-large text-text-heading" emClassName="text-primary-light" />
        </div>
        {intro && <p className="flex-1 text-body-base text-text-description">{intro}</p>}
      </div>
      <ul data-reveal-stagger className="grid md:grid-cols-2 gap-x-6 gap-y-12">
        {items.map((h, i) => {
          const shot = toShot(h.image, h.title ?? name);
          return (
            <li key={`${h.title}${i}`} className="flex flex-col gap-5">
              <figure className="flex flex-col gap-3">
                <BrowserFrame url={url} className="shadow-[0_20px_50px_-20px_rgba(10,23,51,0.3)]!">
                  <div className="aspect-[16/10] overflow-hidden bg-offwhite-2">
                    {shot && <ShotImage shot={shot} sizes="(min-width: 768px) 620px, 100vw" className="h-full! object-cover object-top" />}
                  </div>
                </BrowserFrame>
                {h.caption && <figcaption className="text-body-small text-text-inactive">{h.caption}</figcaption>}
              </figure>
              <div className="flex flex-col gap-2">
                <h3 className="font-title font-medium text-[24px] leading-[30px] text-text-heading">{h.title}</h3>
                <p className="text-body-base text-text-description">{h.text}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </StyledContainer>
  );
};

export default CaseHighlights;
