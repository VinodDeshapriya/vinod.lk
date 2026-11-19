import clsx from "clsx";
import Checkmark from "atd-icons/dist/Checkmark";

/** Green round check used in badges, checklists and the contact hero. */
export default function CheckDot({ size = 22, className }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden
      style={{ width: size, height: size }}
      className={clsx("shrink-0 rounded-full bg-success-primary text-white flex items-center justify-center", className)}
    >
      <Checkmark size={Math.round(size * 0.62)} />
    </span>
  );
}
