import clsx from "clsx";

interface SectionHeadingProps {
  title: React.ReactNode;
  intro?: React.ReactNode;
  className?: string;
  /** Use on dark backgrounds. */
  inverted?: boolean;
  as?: "h1" | "h2";
}

/** Centred section title + intro, as used by every home page section. */
export default function SectionHeading({
  title,
  intro,
  className,
  inverted = false,
  as: Heading = "h2",
}: SectionHeadingProps) {
  return (
    <div
      className={clsx(
        "flex flex-col gap-2.5 items-center text-center max-w-260 mx-auto",
        className,
      )}
    >
      <Heading
        className={clsx(
          "text-title-2x-large",
          inverted ? "text-white" : "text-text-heading",
        )}
      >
        {title}
      </Heading>
      {intro && (
        <p
          className={clsx(
            "text-body-base",
            inverted ? "text-white/70" : "text-text-description",
          )}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
