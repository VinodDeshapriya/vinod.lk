import clsx from "clsx";

/** Small uppercase label with a dot, used above most section titles. */
export default function Eyebrow({
  children,
  inverted = false,
  dot = true,
  className,
}: {
  children: React.ReactNode;
  inverted?: boolean;
  dot?: boolean;
  className?: string;
}) {
  if (!children) return null;
  return (
    <p
      className={clsx(
        "flex items-center gap-2.5 text-[13px] leading-[17px] font-medium uppercase tracking-[0.14em]",
        inverted ? "text-secondary-light" : "text-primary-light",
        className,
      )}
    >
      {dot && (
        <span
          aria-hidden
          className={clsx("size-2 rounded-full", inverted ? "bg-secondary-light" : "bg-primary-light")}
        />
      )}
      {children}
    </p>
  );
}
