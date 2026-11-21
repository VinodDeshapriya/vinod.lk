import clsx from "clsx";
import { type Content, isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import StyledContainer from "@/components/ui/StyledContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import SliceIcon from "@/components/ui/SliceIcon";
import CardRows from "@/components/ui/CardRows";
import Checkmark from "atd-icons/dist/Checkmark";

export type ImageCardsProps = SliceComponentProps<Content.ImageCardsSlice>;

/**
 * Figma: default = "What you get" (19299:1062), "Every build includes" (19303:1058),
 * "What I look after" (19309:1058); bento = "Websites I build" (19311:1058).
 */
const ImageCards = ({ slice }: ImageCardsProps) => {
  const { eyebrow, title, intro } = slice.primary;

  if (slice.variation === "bento") {
    const rows = [slice.primary.cards.slice(0, 2), slice.primary.cards.slice(2)];
    return (
      <StyledContainer
        as="section"
        slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }}
        parentClassName="bg-offwhite-2"
        className="flex flex-col gap-14"
      >
        <SectionHeading eyebrow={eyebrow} title={title} intro={intro} />
        <div className="flex flex-col gap-5">
          {rows.map((row, r) =>
            row.length ? (
              <ul
                key={r}
                className={clsx(
                  "grid gap-5",
                  r === 0 ? "lg:grid-cols-[3fr_2fr]" : "md:grid-cols-2 lg:grid-cols-3",
                )}
              >
                {row.map((c, i) => {
                  const wide = r === 0 && i === 0;
                  const w = c.image.dimensions ? Math.round(c.image.dimensions.width / 2) : undefined;
                  return (
                    <li
                      key={i}
                      className={clsx(
                        "relative overflow-hidden flex rounded-[24px] border",
                        r === 0 ? "h-[400px]" : "h-[380px]",
                        wide ? "flex-col lg:flex-row lg:gap-4" : "flex-col",
                        c.dark
                          ? "text-white border-white/10 bg-[linear-gradient(140deg,#080d1a_0%,#0a1733_50%,#0f4da8_100%)]"
                          : "bg-surface border-border-primary shadow-[0_16px_24px_0_rgba(10,18,33,0.05)]",
                      )}
                    >
                      <div className={clsx("shrink-0 flex flex-col gap-3 pt-8 px-8", wide && "lg:w-[260px] lg:pr-0")}>
                        <span
                          className={clsx(
                            "self-start p-3 rounded-[14px] mb-3",
                            c.dark ? "bg-primary-light text-white" : "bg-info-bg text-primary-light",
                          )}
                        >
                          <SliceIcon name={c.icon} size={20} />
                        </span>
                        <h3 className="text-[24px] leading-[30px] font-title font-medium tracking-[-0.01em]">{c.title}</h3>
                        <p className={clsx("text-body-small", c.dark ? "text-white/75" : "text-text-description")}>{c.text}</p>
                      </div>
                      {isFilled.image(c.image) && (
                        <div className={clsx("shrink-0 pt-5", wide ? "pl-2 lg:pt-[34px] lg:pl-0" : "pl-[2px]")}>
                          <PrismicNextImage
                            field={c.image}
                            style={{ width: w }}
                            sizes="(min-width: 1024px) 560px, 90vw"
                            className="max-w-none h-auto"
                            fallbackAlt=""
                          />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : null,
          )}
        </div>
      </StyledContainer>
    );
  }

  const { chip, cards } = slice.primary;
  return (
    <StyledContainer
      as="section"
      slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }}
      className="flex flex-col gap-14"
    >
      <SectionHeading eyebrow={eyebrow} title={title} intro={intro}>
        {chip && (
          <span className="mt-2.5 flex items-center gap-2 px-3.5 py-2 rounded-full bg-info-bg text-body-small text-primary-light">
            <span className="size-4 rounded-full bg-primary-light text-white flex items-center justify-center">
              <Checkmark size={10} />
            </span>
            {chip}
          </span>
        )}
      </SectionHeading>
      <CardRows items={cards} gap="gap-5">
        {(c, i) => (
          <div className="h-full flex flex-col p-[13px] rounded-[24px] bg-offwhite-2 border border-border-primary">
            <div className="relative h-[196px] rounded-[16px] overflow-hidden bg-surface">
              {isFilled.image(c.image) && (
                <PrismicNextImage
                  field={c.image}
                  fill
                  sizes="(min-width: 1024px) 620px, 100vw"
                  className="object-cover"
                  fallbackAlt=""
                />
              )}
            </div>
            <div className="flex flex-col gap-2 px-4 pt-6 pb-4">
              <h3 className="flex items-baseline gap-3 text-[20px] leading-[28px] font-title font-medium tracking-[-0.01em] text-text-heading">
                <span className="text-[15px] text-primary-light">{String(i + 1).padStart(2, "0")}</span>
                {c.title}
              </h3>
              <p className="text-body-small text-text-description">{c.text}</p>
            </div>
          </div>
        )}
      </CardRows>
    </StyledContainer>
  );
};

export default ImageCards;
