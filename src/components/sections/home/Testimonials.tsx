"use client";
import { useState } from "react";
import GoogleColor from "atd-icons/dist/GoogleColor";
import StyledContainer from "@/components/ui/StyledContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import Highlight from "@/components/ui/Highlight";
import Stars from "@/components/ui/Stars";
import CarouselArrows from "@/components/ui/CarouselArrows";
import useScrollCarousel from "@/components/ui/useScrollCarousel";
import { googleRating, testimonials, type Testimonial } from "@/data/testimonials";

/** Figma: Home Page › Testimonials (19255:49600) */
export default function Testimonials() {
  const { ref: listRef, canPrev, canNext, prev, next } =
    useScrollCarousel<HTMLUListElement>();

  return (
    <StyledContainer
      as="section"
      slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }}
      parentClassName="bg-offwhite-2"
      className="flex flex-col gap-10 items-center"
    >
      <div className="flex flex-col gap-6 items-center w-full">
        <SectionHeading
          title={
            <>
              What <Highlight>clients</Highlight> say
            </>
          }
          intro="Real words from the businesses I've designed and built for, across Sri Lanka."
        />

        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-7 bg-white border border-border-primary rounded-3xl sm:rounded-full p-4 sm:py-3.5 sm:pl-6 sm:pr-3.5">
          <div className="flex items-center gap-4">
            <GoogleColor size={36} />
            <div className="flex flex-col gap-0.5">
              <p className="text-body-base-bold text-text-heading">
                Excellent on Google
              </p>
              <div className="flex items-center gap-2 text-body-small">
                <span className="text-text-heading">{googleRating.score}</span>
                <Stars />
                <span className="text-text-inactive">
                  ({googleRating.count})
                </span>
              </div>
            </div>
          </div>
          <a
            href={googleRating.reviewUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary min-w-0! h-12! text-body-base-bold"
          >
            Review us on Google
          </a>
        </div>
      </div>

      <ul
        ref={listRef}
        className="w-full flex gap-5 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {testimonials.map((t) => (
          <ReviewCard key={t.name} testimonial={t} />
        ))}
      </ul>

      <CarouselArrows
        onPrev={prev}
        onNext={next}
        canPrev={canPrev}
        canNext={canNext}
      />
    </StyledContainer>
  );
}

function ReviewCard({ testimonial }: { testimonial: Testimonial }) {
  const [expanded, setExpanded] = useState(false);
  const { name, meta, rating, body } = testimonial;

  return (
    <li className="snap-start shrink-0 w-[85%] sm:w-[calc((100%-20px)/2)] lg:w-[calc((100%-40px)/3)] bg-white border border-border-secondary rounded-md shadow-[0_8px_24px_0_rgba(10,18,33,0.05)] px-7 py-8 flex flex-col gap-5">
      <Stars count={rating} />
      <div
        className={
          expanded ? "" : "line-clamp-6 lg:min-h-[180px]"
        }
      >
        {body.map((p, i) => (
          <p key={i} className="text-body-base text-text-heading">
            {p}
          </p>
        ))}
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
          {name.charAt(0)}
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <p className="text-body-base-bold text-text-heading truncate">
            {name}
          </p>
          <p className="text-body-small text-text-inactive truncate">{meta}</p>
        </div>
      </div>
    </li>
  );
}
