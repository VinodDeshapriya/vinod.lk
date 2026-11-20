import clsx from "clsx";
import Image from "next/image";
import type { Shot } from "@/data/caseStudies";

/** Desktop browser chrome around a screenshot (or any children). */
export function BrowserFrame({
  url,
  children,
  className,
  dark = false,
}: {
  url?: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={clsx(
        "overflow-hidden rounded-[14px] md:rounded-[18px] border shadow-[0_30px_70px_-20px_rgba(10,23,51,0.35)]",
        dark ? "bg-[#0d1424] border-white/10" : "bg-white border-border-primary",
        className,
      )}
    >
      <div
        className={clsx(
          "flex items-center gap-3 h-9 md:h-10 px-3.5 border-b",
          dark ? "border-white/10" : "border-border-secondary bg-offwhite-2",
        )}
      >
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </span>
        {url && (
          <span
            className={clsx(
              "mx-auto max-w-[60%] truncate rounded-full px-4 py-1 text-[11px] md:text-xs",
              dark ? "bg-white/8 text-white/60" : "bg-white border border-border-secondary text-text-description",
            )}
          >
            {url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
          </span>
        )}
        <span className="w-[42px]" aria-hidden />
      </div>
      {children}
    </div>
  );
}

/** Phone bezel around a mobile screenshot (or any children). */
export function PhoneFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={clsx(
        "overflow-hidden rounded-[34px] border-[7px] border-[#0b1220] bg-[#0b1220] shadow-[0_30px_60px_-15px_rgba(10,23,51,0.5)]",
        className,
      )}
    >
      <span aria-hidden className="absolute left-1/2 top-2 z-10 h-[18px] w-[76px] -translate-x-1/2 rounded-full bg-[#0b1220]" />
      <div className="overflow-hidden rounded-[27px] bg-white">{children}</div>
    </div>
  );
}

export function ShotImage({ shot, sizes, priority, className }: { shot: Shot; sizes: string; priority?: boolean; className?: string }) {
  return (
    <Image
      src={shot.src}
      alt={shot.alt}
      width={shot.width}
      height={shot.height}
      sizes={sizes}
      priority={priority}
      className={clsx("block w-full h-auto", className)}
    />
  );
}
