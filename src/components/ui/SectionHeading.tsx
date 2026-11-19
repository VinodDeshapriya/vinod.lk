import clsx from "clsx";
import type { RichTextField } from "@prismicio/client";
import PrismicTitle from "./PrismicTitle";
import Eyebrow from "./Eyebrow";

interface SectionHeadingProps {
  title: RichTextField | null | undefined;
  intro?: React.ReactNode;
  eyebrow?: React.ReactNode;
  /** Extra content under the intro (e.g. a chip). */
  children?: React.ReactNode;
  className?: string;
  /** Use on dark backgrounds. */
  inverted?: boolean;
}

/** Centred section title + intro, as used by every home page section. */
export default function SectionHeading({
  title,
  intro,
  eyebrow,
  children,
  className,
  inverted = false,
}: SectionHeadingProps) {
  return (
    <div
      className={clsx(
        "flex flex-col gap-2.5 items-center text-center max-w-260 mx-auto",
        className,
      )}
    >
      {eyebrow && (
        <Eyebrow inverted={inverted} className="mb-1.5">
          {eyebrow}
        </Eyebrow>
      )}
      <PrismicTitle
        field={title}
        emClassName={inverted ? "text-secondary-light" : undefined}
        className={clsx(
          "text-title-2x-large",
          inverted ? "text-white" : "text-text-heading",
        )}
      />
      {intro && (
        <p
          className={clsx(
            "text-body-base",
            inverted ? "text-white/70" : "text-text-description",
          )}
        >
          {intro}
        </p>
      )}
      {children}
    </div>
  );
}
