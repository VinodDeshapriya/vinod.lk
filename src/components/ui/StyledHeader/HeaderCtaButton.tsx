import clsx from "clsx";
import Link from "next/link";
import CallFill from "atd-icons/dist/CallFill";
import ArrowForward from "atd-icons/dist/ArrowForward";
import type { HeaderCta } from "@/lib/layoutData";

/**
 * Header call-to-action: a pill with an icon badge. A phone icon for tel: links,
 * an arrow otherwise. Desktop only; phones and tablets use the button in the menu sheet.
 */
export default function HeaderCtaButton({
  cta,
  className,
}: {
  cta: HeaderCta;
  className?: string;
}) {
  const isCall = cta.href.startsWith("tel:");
  const Icon = isCall ? CallFill : ArrowForward;
  return (
    <Link
      href={cta.href}
      aria-label={cta.label}
      className={clsx(
        "group relative items-center gap-2.5 h-10 rounded-full bg-primary-light text-white",
        "p-1 xl:pr-5 shadow-[0_1px_2px_rgba(10,18,33,0.12),inset_0_1px_0_rgba(255,255,255,0.25)]",
        "transition-[background-color,box-shadow,transform] duration-200 ease-out motion-reduce:transition-none",
        "hover:bg-button-primary-hover hover:text-button-primary-text-hover hover:-translate-y-px hover:shadow-[0_8px_24px_-6px_rgba(21,127,248,0.65),inset_0_1px_0_rgba(255,255,255,0.25)]",
        "active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light",
        className,
      )}
    >
      <span className="relative grid place-items-center size-8 rounded-full bg-white text-primary-light dark:group-hover:bg-primary-light dark:group-hover:text-white transition-colors">
        {isCall && (
          <span
            aria-hidden
            className="absolute inset-0 rounded-full bg-white/60 opacity-0 group-hover:animate-[cta-ping_0.9s_ease-out_1] motion-reduce:hidden"
          />
        )}
        <Icon
          size={15}
          aria-hidden
          className={clsx(
            "relative transition-transform duration-300",
            isCall
              ? "group-hover:animate-[cta-ring_0.6s_ease-in-out_1]"
              : "group-hover:translate-x-0.5",
          )}
        />
      </span>
      <span className="hidden xl:inline text-[14px] leading-none font-medium whitespace-nowrap">
        {cta.label}
      </span>
    </Link>
  );
}
