import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import StyledContainer from "@/components/ui/StyledContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import GoogleRatingPill from "@/components/ui/GoogleRatingPill";
import type { SliceContext } from "@/lib/sliceContext";
import ReviewCard from "./ReviewCard";
import ReviewCarousel from "./ReviewCarousel";

export type TestimonialsProps = SliceComponentProps<
  Content.TestimonialsSlice,
  SliceContext
>;

/** Figma: 📦 Components › Testimonials › testimonial_variants1 (19345:4087) */
const Testimonials = ({ slice, context }: TestimonialsProps) => {
  const { title, intro, show_google_rating, reviews } = slice.primary;
  return (
    <StyledContainer
      as="section"
      slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }}
      parentClassName="bg-offwhite-2"
      className="flex flex-col gap-10 items-center"
    >
      <div
        data-slice-type={slice.slice_type}
        className="flex flex-col gap-6 items-center w-full"
      >
        <SectionHeading title={title} intro={intro} />
        {show_google_rating && <GoogleRatingPill settings={context?.settings} />}
      </div>
      <ReviewCarousel>
        {reviews.map((r, i) => (
          <ReviewCard key={i} name={r.name} meta={r.meta} rating={r.rating} review={r.review} />
        ))}
      </ReviewCarousel>
    </StyledContainer>
  );
};

export default Testimonials;
