import StyledButton from "@/components/ui/StyledButton";

interface CtaBandProps {
  title: React.ReactNode;
  intro?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  /** Exported Figma background image. Until it is exported a CSS gradient stands in. */
  backgroundSrc?: string;
}

/**
 * Figma: Home Page › Pain-point transition (19255:60520, 19268:1996)
 * Dark rounded band with blue light-wave background and two CTAs.
 */
export default function CtaBand({
  title,
  intro,
  primary = { label: "Get a Free Quote", href: "/contact" },
  secondary = { label: "See Recent Work", href: "/work" },
  backgroundSrc,
}: CtaBandProps) {
  return (
    <section className="px-4 lg:px-6 py-10 lg:py-(--spacing-horizontal-padding)">
      <div
        className="relative overflow-hidden rounded-md lg:rounded-[24px] bg-[#05070c] px-6 py-20 md:px-[55px] lg:py-[150px] bg-cover bg-center"
        style={
          backgroundSrc
            ? { backgroundImage: `url(${backgroundSrc})` }
            : undefined
        }
      >
        {!backgroundSrc && (
          // TODO(figma): replace with the exported fill of node 19255:60521
          <div
            aria-hidden
            className="absolute inset-0 blur-3xl opacity-90"
            style={{
              background: [
                "radial-gradient(60% 45% at 8% 62%, rgba(110,200,255,.75), transparent 70%)",
                "radial-gradient(55% 35% at 30% 20%, rgba(21,90,248,.7), transparent 70%)",
                "radial-gradient(45% 30% at 70% 85%, rgba(60,170,255,.75), transparent 70%)",
                "radial-gradient(40% 40% at 95% 50%, rgba(21,127,248,.7), transparent 70%)",
              ].join(","),
            }}
          />
        )}
        <div className="relative mx-auto max-w-320 flex flex-col items-center gap-10 text-center text-white">
          <div className="flex flex-col gap-2.5 max-w-260">
            <h2 className="text-title-x-large">{title}</h2>
            {intro && <p className="text-body-base">{intro}</p>}
          </div>
          <div className="flex flex-col sm:flex-row gap-[18px] w-full sm:w-auto">
            <StyledButton label={primary.label} link={primary.href} />
            <StyledButton
              label={secondary.label}
              link={secondary.href}
              variant="Secondary"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
