import clsx from "clsx";
import { PrismicRichText, type JSXMapSerializer } from "@prismicio/react";
import { isFilled, type RichTextField } from "@prismicio/client";

interface PrismicTitleProps {
  field: RichTextField | null | undefined;
  className?: string;
  /** Classes for italic (em) runs — the design's highlighted words. */
  emClassName?: string;
}

/**
 * Serializers are cached per class combination and blocks get stable keys, so
 * a re-render (e.g. opening an FAQ question) keeps the same heading element
 * instead of rebuilding it, which would replay its scroll-reveal animation.
 */
const cache = new Map<string, JSXMapSerializer>();
function serializer(className = "", emClassName = ""): JSXMapSerializer {
  const key = `${className}\u0000${emClassName}`;
  let s = cache.get(key);
  if (!s) {
    s = {
      // Stable keys from the text: the Prismic serializer otherwise hands out a
      // fresh key on every render, which makes React rebuild the heading.
      heading1: ({ node, children }) => <h1 key={`h1:${node.text}`} className={className}>{children}</h1>,
      heading2: ({ node, children }) => <h2 key={`h2:${node.text}`} className={className}>{children}</h2>,
      heading3: ({ node, children }) => <h3 key={`h3:${node.text}`} className={className}>{children}</h3>,
      paragraph: ({ node, children }) => <p key={`p:${node.text}`} className={className}>{children}</p>,
      em: ({ children }) => <em className={clsx("italic", emClassName)}>{children}</em>,
    };
    cache.set(key, s);
  }
  return s;
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
  return <PrismicRichText field={field} components={serializer(className, emClassName)} />;
}
