"use client";
import clsx from "clsx";
import ArrowBack from "atd-icons/dist/ArrowBack";
import ArrowForward from "atd-icons/dist/ArrowForward";

interface CarouselArrowsProps {
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  className?: string;
}

/** Round prev/next buttons. The active direction is filled brand blue. */
export default function CarouselArrows({
  onPrev,
  onNext,
  canPrev,
  canNext,
  className,
}: CarouselArrowsProps) {
  const base =
    "size-13 rounded-full flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
  return (
    <div className={clsx("flex gap-3 justify-center", className)}>
      <button
        type="button"
        aria-label="Previous"
        onClick={onPrev}
        disabled={!canPrev}
        className={clsx(
          base,
          canPrev && !canNext
            ? "bg-primary-light text-white"
            : "bg-white border border-border-primary text-text-heading hover:border-primary-light",
        )}
      >
        <ArrowBack size={18} />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={onNext}
        disabled={!canNext}
        className={clsx(
          base,
          canNext
            ? "bg-primary-light text-white hover:bg-primary-dark"
            : "bg-white border border-border-primary text-text-heading",
        )}
      >
        <ArrowForward size={18} />
      </button>
    </div>
  );
}
