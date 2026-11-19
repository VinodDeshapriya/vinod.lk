import clsx from "clsx";

/** Clear, slightly heavier chevron for the menu (atd-icons' outline chevron is too faint at this size). */
export default function Chevron({ size = 14, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={clsx("shrink-0", className)}
    >
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
