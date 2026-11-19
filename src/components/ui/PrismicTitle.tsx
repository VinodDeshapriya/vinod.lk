import clsx from "clsx";
import { PrismicRichText } from "@prismicio/react";
import { isFilled, type RichTextField } from "@prismicio/client";

interface PrismicTitleProps {
  field: RichTextField | null | undefined;
  className?: string;
  /** Classes for italic (em) runs — the design's highlighted words. */
  emClassName?: string;
}

/**
 * Renders a Prismic title (heading1/heading2 + em). Italic text becomes the
 * design's highlight; a soft line break (Shift+Enter) becomes <br>.
 */
export default function PrismicTitle({
  field,
  className,
  emClassName = "italic text-primary-light",
}: PrismicTitleProps) {
  if (!isFilled.richText(field)) return null;
  return (
    <PrismicRichText
      field={field}
      components={{
        heading1: ({ children }) => <h1 className={className}>{children}</h1>,
        heading2: ({ children }) => <h2 className={className}>{children}</h2>,
        heading3: ({ children }) => <h3 className={className}>{children}</h3>,
        paragraph: ({ children }) => <p className={className}>{children}</p>,
        em: ({ children }) => (
          <em className={clsx("italic", emClassName)}>{children}</em>
        ),
      }}
    />
  );
}
