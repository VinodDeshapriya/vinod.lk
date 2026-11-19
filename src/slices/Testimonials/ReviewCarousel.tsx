"use client";
import CarouselArrows from "@/components/ui/CarouselArrows";
import useScrollCarousel from "@/components/ui/useScrollCarousel";

export default function ReviewCarousel({ children }: { children: React.ReactNode }) {
  const { ref, canPrev, canNext, prev, next } =
    useScrollCarousel<HTMLUListElement>();
  return (
    <>
      <ul
        ref={ref}
        className="w-full flex gap-5 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </ul>
      <CarouselArrows onPrev={prev} onNext={next} canPrev={canPrev} canNext={canNext} />
    </>
  );
}
