import Image from "next/image";
import StyledButton from "@/components/ui/StyledButton";
import Highlight from "@/components/ui/Highlight";
import { clientLogos as allLogos } from "@/data/clients";

const clientLogos = allLogos.filter((logo) => logo.src);

/** Figma: Home Page › Hero section (19250:40416) */
export default function HeroSection() {
  return (
    <section className="pt-10 lg:pt-[58px] pb-10 overflow-hidden">
      <div className="px-4 md:px-10 xl:px-20">
        <div className="mx-auto max-w-[1026px] flex flex-col items-center gap-6 text-center">
          <div className="flex flex-col items-center gap-3.5">
            <p className="text-title-base-blog text-text-heading">
              System-Led UX Engineer in Sri Lanka
            </p>
            <h1 className="text-title-3x-large text-text-heading">
              Designed for people.
              <br />
              Built <Highlight>faster</Highlight>.
            </h1>
            <p className="text-body-base text-text-description">
              Fast, mobile-first websites, brands and business systems for Sri
              Lankan businesses. Every site is designed for you, built to rank
              on Google, and made to turn visitors into enquiries.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-[18px] w-full sm:w-auto">
            <StyledButton label="Get a Free Quote" link="/contact" />
            <StyledButton
              label="See Recent Work"
              link="/work"
              variant="Secondary"
            />
          </div>
        </div>
      </div>

      {/* Showcase image: browser mockup of a recent build on a dark card */}
      <div className="mt-10 px-4 lg:px-[25px]">
        <div className="mx-auto max-w-[1390px] aspect-[1390/771] rounded-md lg:rounded-lg overflow-hidden bg-primary-dark">
          <Image
            src="/images/home/hero-showcase.png"
            alt="Absoliq website shown in a browser window"
            width={1390}
            height={772}
            priority
            className="size-full object-cover"
          />
        </div>
      </div>

      {/* Trusted by */}
      <div className="mt-10 flex flex-col gap-[7px]">
        <p className="text-body-x-small text-text-heading text-center px-4">
          Trusted by growing brands across Sri Lanka
        </p>
        <div className="marquee relative overflow-hidden py-5 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <ul className="marquee-track flex w-max items-center">
            {[...clientLogos, ...clientLogos].map((logo, i) => (
              <li
                key={`${logo.nodeId}-${i}`}
                className="h-12 flex items-center shrink-0 box-content pr-14"
                aria-hidden={i >= clientLogos.length}
                style={{ width: logo.width }}
              >
                <Image
                  src={logo.src!}
                  alt={logo.name}
                  width={logo.width}
                  height={logo.height ?? 40}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
