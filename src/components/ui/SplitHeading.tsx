import type { RichTextField } from "@prismicio/client";
import PrismicTitle from "./PrismicTitle";
import Eyebrow from "./Eyebrow";

/** Eyebrow + title on the left, intro on the right (About sections). */
export default function SplitHeading({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string | null;
  title: RichTextField;
  intro: string | null;
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end gap-6 lg:gap-16">
      <div className="flex-1 flex flex-col gap-4">
        <Eyebrow>{eyebrow}</Eyebrow>
        <PrismicTitle field={title} className="text-title-2x-large text-text-heading" />
      </div>
      {intro && <p className="lg:w-[500px] shrink-0 text-body-base text-text-description">{intro}</p>}
    </div>
  );
}
