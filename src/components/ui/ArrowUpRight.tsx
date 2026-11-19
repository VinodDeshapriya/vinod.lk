import ArrowForward from "atd-icons/dist/ArrowForward";

/** North-east arrow (atd-icons ArrowForward rotated -45°). */
export default function ArrowUpRight({
  size = 18,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <ArrowForward size={size} className={`-rotate-45 ${className ?? ""}`} />
  );
}
