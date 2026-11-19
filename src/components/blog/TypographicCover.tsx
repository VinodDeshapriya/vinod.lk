import Image from "next/image";
import clsx from "clsx";

/** Navy cover generated from the post's tag and title (Figma "Cover (typographic)"). */
export default function TypographicCover({
  tag,
  title,
  size = "card",
  className,
}: {
  tag: string;
  title: string;
  size?: "card" | "large";
  className?: string;
}) {
  const large = size === "large";
  return (
    <div
      className={clsx(
        "relative overflow-hidden flex flex-col items-center justify-center text-center bg-[linear-gradient(144deg,#05080f_0%,#0a142e_43%,#0d3880_71%)]",
        large ? "gap-6 px-8 lg:px-24 rounded-[28px]" : "gap-5 px-8 rounded-[20px]",
        className,
      )}
    >
      <span
        aria-hidden
        className={clsx(
          "absolute rounded-full bg-primary-light/45 blur-[80px] transition-opacity group-hover:opacity-80",
          large ? "-top-24 left-1/3 w-[600px] h-[300px]" : "-top-14 left-1/4 w-[300px] h-[220px]",
        )}
      />
      {tag && (
        <span className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-medium uppercase tracking-[0.12em] text-white/90">
          <span className="size-[5px] rounded-full bg-secondary-light" />
          {tag}
        </span>
      )}
      <span
        className={clsx(
          "relative font-title font-semibold tracking-[-0.02em] bg-clip-text text-transparent bg-[linear-gradient(to_bottom,#fff,#bfdbff)]",
          large ? "max-w-[720px] text-[32px] leading-[38px] lg:text-[48px] lg:leading-[56px]" : "text-[28px] leading-[33px]",
        )}
      >
        {title}
      </span>
      <Image
        src="/logo-white.svg"
        alt=""
        width={74}
        height={25}
        className={clsx("relative w-auto", large ? "h-[30px]" : "h-[25px]")}
      />
    </div>
  );
}
