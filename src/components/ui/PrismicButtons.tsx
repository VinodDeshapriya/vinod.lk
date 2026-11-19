import clsx from "clsx";
import { isFilled, type LinkField } from "@prismicio/client";
import StyledButton from "./StyledButton";

/** Renders a slice's "buttons" group: one StyledButton per filled link. */
export default function PrismicButtons({
  buttons,
  className,
}: {
  buttons: { link: LinkField }[] | null | undefined;
  className?: string;
}) {
  const filled = (buttons ?? []).filter(({ link }) => isFilled.link(link));
  if (!filled.length) return null;
  return (
    <div
      data-reveal
      className={clsx(
        "flex flex-col sm:flex-row gap-[18px] w-full sm:w-auto",
        className,
      )}
    >
      {filled.map(({ link }, i) => (
        <StyledButton key={i} field={link} />
      ))}
    </div>
  );
}
