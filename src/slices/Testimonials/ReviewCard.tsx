"use client";
import { useState } from "react";
import type { RichTextField } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import Stars from "@/components/ui/Stars";

export default function ReviewCard({
  name,
  meta,
  rating,
  review,
}: {
  name: string | null;
  meta: string | null;
  rating: number | null;
  review: RichTextField;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <li className="snap-start shrink-0 w-[85%] sm:w-[calc((100%-20px)/2)] lg:w-[calc((100%-40px)/3)] bg-white border border-border-secondary rounded-md shadow-[0_8px_24px_0_rgba(10,18,33,0.05)] px-7 py-8 flex flex-col gap-5">
      <Stars count={Math.min(5, Math.max(0, rating ?? 5))} />
      <div className={expanded ? "" : "line-clamp-6 lg:min-h-[180px]"}>
        <PrismicRichText
          field={review}
          components={{
            paragraph: ({ children }) => (
              <p className="text-body-base text-text-heading">{children}</p>
            ),
          }}
        />
      </div>
      <div className="grow" />
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="self-start text-body-small font-medium text-primary-light hover:underline"
        aria-expanded={expanded}
      >
        {expanded ? "Show less" : "Read more"}
      </button>
      <div className="flex items-center gap-3.5 border-t border-border-secondary pt-5">
        <div className="size-11 shrink-0 rounded-full bg-info-bg flex items-center justify-center font-title font-semibold text-lg text-primary-light">
          {name?.charAt(0)}
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <p className="text-body-base-bold text-text-heading truncate">{name}</p>
          {meta && (
            <p className="text-body-small text-text-inactive truncate">{meta}</p>
          )}
        </div>
      </div>
    </li>
  );
}
