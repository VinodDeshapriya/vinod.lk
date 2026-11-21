import Link from "next/link";
import Image from "next/image";
import ArrowUpRight from "@/components/ui/ArrowUpRight";

export type ProjectCardData = {
  href: string;
  name: string;
  summary: string;
  category: string;
  image?: { src: string; alt: string };
};

/** Case study card: thumbnail, category, name and summary; the whole card links. */
export default function ProjectCard({ c, headingLevel = "h3" }: { c: ProjectCardData; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <Link
      href={c.href}
      className="group h-full flex flex-col rounded-[24px] bg-surface border border-border-primary p-2.5 shadow-[0_16px_24px_0_rgba(10,18,33,0.05)] transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-primary-light hover:shadow-[0_24px_48px_-12px_rgba(20,128,247,0.22)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
    >
      <div className="relative overflow-hidden rounded-[18px] aspect-[1538/1214] bg-[#001339]">
        {c.image && (
          <Image
            src={c.image.src}
            alt={c.image.alt}
            fill
            sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-left-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          />
        )}
      </div>
      <div className="flex flex-col gap-2 px-4 pt-5 pb-4 grow">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[12px] font-medium uppercase tracking-[0.14em] text-primary-light">{c.category}</span>
          <span className="size-8 shrink-0 rounded-full border border-border-primary flex items-center justify-center text-primary-light transition-colors group-hover:bg-primary-light group-hover:border-primary-light group-hover:text-white">
            <ArrowUpRight size={14} />
          </span>
        </div>
        <H className="font-title font-medium text-[22px] leading-[30px] text-text-heading transition-colors group-hover:text-primary-light">
          {c.name}
        </H>
        <p className="text-body-small text-text-description">{c.summary}</p>
      </div>
    </Link>
  );
}
