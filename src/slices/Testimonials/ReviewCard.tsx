"use client";
import { useEffect, useId, useRef, useState } from "react";
import type { RichTextField } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import Close from "atd-icons/dist/Close";
import GoogleColor from "atd-icons/dist/GoogleColor";
import Stars from "@/components/ui/Stars";

type Props = {
  name: string | null;
  meta: string | null;
  rating: number | null;
  review: RichTextField;
};

const paragraph = (className: string) => ({
  paragraph: ({ children }: { children: React.ReactNode }) => <p className={className}>{children}</p>,
});

function Author({ name, meta }: Pick<Props, "name" | "meta">) {
  return (
    <div className="flex items-center gap-3.5 min-w-0">
      <div className="size-11 shrink-0 rounded-full bg-info-bg flex items-center justify-center font-title font-semibold text-lg text-primary-light">
        {name?.charAt(0)}
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <p className="font-medium text-[16px] leading-[26px] md:text-[18px] md:leading-[30px] text-text-heading truncate">{name}</p>
        {meta && <p className="text-[16px] leading-6 text-text-inactive truncate">{meta}</p>}
      </div>
    </div>
  );
}

/** Testimonial card. "Read more" (shown only when the text is cut off) opens the full review in a pop-up. */
export default function ReviewCard({ name, meta, rating, review }: Props) {
  const stars = Math.min(5, Math.max(0, rating ?? 5));
  const textRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [clamped, setClamped] = useState(true);
  const titleId = useId();

  // Only offer "Read more" when the clamp actually hides text.
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const check = () => setClamped(el.scrollHeight - el.clientHeight > 2);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const open = () => {
    const d = dialogRef.current;
    if (!d) return;
    d.showModal();
    document.documentElement.style.overflow = "hidden";
  };
  const close = () => dialogRef.current?.close();

  return (
    <li className="snap-start shrink-0 w-full sm:w-[calc((100%-20px)/2)] lg:w-[calc((100%-40px)/3)] bg-white border border-border-secondary rounded-2xl shadow-[0_8px_24px_0_rgba(10,18,33,0.05)] max-sm:min-h-[431px] sm:max-lg:min-h-[467px] px-5 md:px-7 py-8 flex flex-col gap-5">
      <Stars count={stars} />
      <div ref={textRef} className="line-clamp-6">
        <PrismicRichText
          field={review}
          components={paragraph("text-[16px] leading-[26px] md:text-[18px] md:leading-[30px] text-text-heading")}
        />
      </div>
      <div className="grow min-h-px" />
      {clamped && (
        <button
          ref={triggerRef}
          type="button"
          onClick={open}
          aria-haspopup="dialog"
          className="group self-start text-[16px] leading-6 font-medium text-primary-light"
        >
          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1px]">
            Read more
          </span>
        </button>
      )}
      <div className="border-t border-border-secondary pt-5">
        <Author name={name} meta={meta} />
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={() => {
          document.documentElement.style.overflow = "";
          triggerRef.current?.focus();
        }}
        onClick={(e) => {
          // A click on the backdrop lands on the dialog element itself.
          if (e.target === e.currentTarget) close();
        }}
        className="review-dialog m-auto w-[min(640px,calc(100%-32px))] max-h-[min(720px,calc(100dvh-48px))] rounded-[24px] bg-white p-0 shadow-[0_40px_100px_-20px_rgba(10,18,33,0.45)] backdrop:bg-[rgba(8,13,26,0.55)] backdrop:backdrop-blur-sm"
      >
        <div className="flex flex-col max-h-[inherit]">
          <div className="flex items-center justify-between gap-4 px-6 sm:px-8 pt-6 sm:pt-7">
            <div className="flex items-center gap-3">
              <GoogleColor size={22} aria-hidden />
              <Stars count={stars} />
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close review"
              className="-mr-2 size-10 grid place-items-center rounded-full text-text-description hover:bg-offwhite-2 hover:text-text-heading transition-colors focus-visible:outline-2 focus-visible:outline-primary-light"
            >
              <Close size={20} aria-hidden />
            </button>
          </div>
          <h3 id={titleId} className="sr-only">
            Review by {name}
          </h3>
          <div className="overflow-y-auto overscroll-contain px-6 sm:px-8 pt-5 pb-6 flex flex-col gap-4">
            <span aria-hidden className="font-title italic text-[64px] leading-[40px] h-8 text-primary-light/30">“</span>
            <PrismicRichText field={review} components={paragraph("text-body-base text-text-heading")} />
          </div>
          <div className="mt-auto border-t border-border-secondary px-6 sm:px-8 py-5">
            <Author name={name} meta={meta} />
          </div>
        </div>
      </dialog>
    </li>
  );
}
