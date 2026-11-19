import clsx from "clsx";
import StyledContainer from "./StyledContainer";

/** Dark navy section with the soft blue glow at the top (Why UX-led, Stats, Beliefs). */
export default function DarkBand({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <StyledContainer
      as="section"
      slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }}
      parentClassName="grain relative overflow-hidden bg-[linear-gradient(to_bottom,#080d1a,#0a1733)] text-white"
      className={clsx("relative", className)}
    >
      <div
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 -top-[240px] md:-top-[260px] lg:-top-[300px] w-[343px] h-[160px] md:w-[688px] md:h-[321px] lg:w-[900px] lg:h-[420px] rounded-full bg-primary-light/35 blur-[90px]"
      />
      {children}
    </StyledContainer>
  );
}
