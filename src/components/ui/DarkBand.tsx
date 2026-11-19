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
      parentClassName="relative overflow-hidden bg-[linear-gradient(to_bottom,#080d1a,#0a1733)] text-white"
      className={clsx("relative", className)}
    >
      <div
        aria-hidden
        className="absolute left-1/2 -translate-x-[20%] -top-[300px] w-[900px] max-w-[120vw] h-[420px] rounded-full bg-primary-light/40 blur-[120px]"
      />
      {children}
    </StyledContainer>
  );
}
