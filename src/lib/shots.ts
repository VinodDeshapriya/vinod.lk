import { isFilled, type ImageField } from "@prismicio/client";
import type { Shot } from "@/data/caseStudies";

/** A Prismic image as the Shot the work frames render (null when empty). */
export function toShot(field: ImageField | null | undefined, fallbackAlt = ""): Shot | null {
  if (!field || !isFilled.image(field)) return null;
  return {
    src: field.url,
    alt: field.alt ?? fallbackAlt,
    width: field.dimensions.width,
    height: field.dimensions.height,
  };
}

export const shots = (fields: (ImageField | null | undefined)[], fallbackAlt = "") =>
  fields.map((f) => toShot(f, fallbackAlt)).filter((s): s is Shot => !!s);
