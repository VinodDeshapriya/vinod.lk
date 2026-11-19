import { PrismicNextImage } from "@prismicio/next";
import { isFilled, type ImageField } from "@prismicio/client";

/** Infinite horizontal logo marquee. The list is rendered twice for a seamless loop. */
export default function LogoMarquee({
  logos,
}: {
  logos: { logo: ImageField }[] | null | undefined;
}) {
  const filled = (logos ?? []).filter(({ logo }) => isFilled.image(logo));
  if (!filled.length) return null;
  return (
    <div className="marquee relative overflow-hidden py-5 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <ul className="marquee-track flex w-max items-center">
        {[...filled, ...filled].map(({ logo }, i) => (
          <li
            key={i}
            className="h-12 flex items-center shrink-0 box-content pr-14"
            aria-hidden={i >= filled.length}
          >
            <PrismicNextImage
              field={logo}
              className="max-h-12 w-auto"
              fallbackAlt=""
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
