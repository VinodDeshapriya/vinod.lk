import Link from "next/link";
import clsx from "clsx";
import StyledContainer from "@/components/ui/StyledContainer";
import StyledButton from "@/components/ui/StyledButton";
import ScrollTilt from "@/components/ui/ScrollTilt";
import CheckDot from "@/components/ui/CheckDot";
import ArrowUpRight from "@/components/ui/ArrowUpRight";
import { moreCaseStudies, type CaseStudy } from "@/data/caseStudies";
import { BrowserFrame, PhoneFrame, ShotImage } from "./Frames";
import ApproachSteps from "./ApproachSteps";
import DeviceViewer from "./DeviceViewer";
import ProjectCard from "./ProjectCard";
import CaseStudyCta from "./CaseStudyCta";

const pad = (n: number) => String(n).padStart(2, "0");

/** Section title in the reference's style: "The challenge." with the last word highlighted. */
function Title({ lead, accent, className, dark }: { lead: string; accent: string; className?: string; dark?: boolean }) {
  return (
    <h2 className={clsx("text-title-2x-large", dark ? "text-white" : "text-text-heading", className)}>
      {lead} <span className={clsx("italic", dark ? "text-secondary-light" : "text-primary-light")}>{accent}</span>
    </h2>
  );
}

/**
 * Case study page (layout modelled on awmedia.marketing/work/renewafuel):
 * hero + device mockup, project facts, about, challenge, approach, the work
 * viewer, design highlights, what we built, numbers, more projects, CTA.
 */
export default function CaseStudyView({ c }: { c: CaseStudy }) {
  const heroShot = c.highlights.items[0]?.shot ?? c.desktopShots[0];
  const phoneShot = c.mobileShots[0];
  const more = moreCaseStudies(c.slug);

  return (
    <article>
      {/* 1. Hero */}
      <section className="relative overflow-hidden pt-10 lg:pt-14 pb-10">
        <div className="px-4 md:px-10 xl:px-20">
          <div className="mx-auto max-w-[1040px] flex flex-col items-center text-center gap-6">
            <nav aria-label="Breadcrumb" className="inline-flex items-center gap-2 h-8 px-4 rounded-full border border-border-primary bg-white text-[12px] font-medium uppercase tracking-[0.14em]">
              <Link href="/work" className="text-text-inactive hover:text-primary-light transition-colors">Work</Link>
              <span className="text-text-inactive" aria-hidden>/</span>
              <span className="text-text-heading" aria-current="page">{c.name}</span>
            </nav>
            <h1 className="text-title-2x-large text-text-heading text-balance">{c.hero.title}</h1>
            <p className="text-body-base text-text-description max-w-[760px]">{c.hero.intro}</p>
            <div className="flex flex-wrap justify-center gap-2" data-reveal>
              <span className={clsx(
                "inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full text-[12px] font-medium uppercase tracking-[0.12em]",
                c.status === "Live" ? "bg-info-bg text-primary-light" : "bg-amber-50 text-amber-700",
              )}>
                <span className={clsx("size-1.5 rounded-full", c.status === "Live" ? "bg-primary-light" : "bg-amber-500")} />
                {c.status}
              </span>
              {c.tags.map((t) => (
                <span key={t} className="inline-flex items-center h-8 px-3.5 rounded-full border border-border-primary bg-white text-[13px] text-text-description">
                  {t}
                </span>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-[18px] w-full sm:w-auto" data-reveal>
              {c.liveUrl && <StyledButton link={c.liveUrl} target="_blank" label="Visit the live site" variant="Primary" />}
              <StyledButton link="/contact" label="Start a project like this" variant="Secondary" />
            </div>
          </div>
        </div>

        <div className="mt-10 md:mt-14 px-4 lg:px-[25px]">
          <ScrollTilt className="relative mx-auto max-w-[1180px]">
            <BrowserFrame url={c.liveUrl ?? `${c.name} (design)`}>
              <ShotImage shot={heroShot} sizes="(min-width: 1180px) 1180px, 100vw" priority />
            </BrowserFrame>
            {phoneShot && (
              <PhoneFrame className="hidden sm:block absolute -bottom-8 right-4 md:right-10 w-[150px] md:w-[210px]">
                <div className="aspect-[375/700] overflow-hidden">
                  <ShotImage shot={phoneShot} sizes="210px" />
                </div>
              </PhoneFrame>
            )}
          </ScrollTilt>
        </div>
      </section>

      {/* 2. Project facts */}
      <StyledContainer className="pt-8 md:pt-12">
        <dl data-reveal className="grid grid-cols-2 lg:grid-cols-5 gap-px rounded-[24px] bg-border-secondary border border-border-primary shadow-[0_16px_48px_0_rgba(10,18,33,0.06)] overflow-hidden">
          {c.facts.map((f, i) => (
            <div key={f.label} className={clsx("flex flex-col gap-1.5 p-5 md:p-6 bg-white", i === c.facts.length - 1 && c.facts.length % 2 === 1 && "col-span-2 lg:col-span-1")}>
              <dt className="text-[12px] font-medium uppercase tracking-[0.14em] text-text-inactive">{f.label}</dt>
              <dd className="text-body-small font-medium text-text-heading">
                {f.href ? (
                  <a href={f.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-primary-light hover:underline">
                    {f.value} <ArrowUpRight size={12} />
                  </a>
                ) : (
                  f.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </StyledContainer>

      {/* 3. About */}
      <StyledContainer slice={{ primary: { top_padding: "Full", bottom_padding: "None" } }} className="flex flex-col lg:flex-row gap-6 lg:gap-20">
        <h2 className="lg:w-[420px] shrink-0 text-title-x-large text-text-heading">{c.about.title}</h2>
        <div className="flex-1 flex flex-col gap-5">
          {c.about.paragraphs.map((p) => (
            <p key={p.slice(0, 24)} data-reveal className="text-body-base text-text-description">{p}</p>
          ))}
        </div>
      </StyledContainer>

      {/* 4. The challenge */}
      <StyledContainer slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }} className="flex flex-col gap-10">
        <div className="flex flex-col lg:flex-row lg:items-end gap-5 lg:gap-20">
          <Title lead="The" accent="challenge." className="lg:w-[420px] shrink-0" />
          <p className="flex-1 text-body-base text-text-description">{c.challenge.intro}</p>
        </div>
        <ul data-reveal-stagger className="grid sm:grid-cols-2 gap-5">
          {c.challenge.items.map((it, i) => (
            <li key={it.title} className="flex flex-col justify-between gap-12 min-h-[260px] md:min-h-[300px] rounded-[24px] bg-white border border-border-primary p-7 md:p-9 shadow-[0_16px_24px_0_rgba(10,18,33,0.05)]">
              <span className="font-title font-medium text-[56px] leading-none tracking-[-0.04em] text-primary-light">{pad(i + 1)}</span>
              <div className="flex flex-col gap-2">
                <h3 className="font-title font-medium text-[24px] leading-[30px] text-text-heading">{it.title}</h3>
                <p className="text-body-base text-text-description">{it.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </StyledContainer>

      {/* 5. Our approach (dark) */}
      <StyledContainer
        as="section"
        slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }}
        parentClassName="grain relative overflow-hidden bg-[linear-gradient(to_bottom,#080d1a,#0a1733)] text-white"
        className="relative"
      >
        <div aria-hidden className="absolute -right-40 top-1/3 w-[520px] h-[420px] rounded-full bg-primary-light/30 blur-[90px]" />
        <ApproachSteps intro={c.approach.intro} steps={c.approach.steps} />
      </StyledContainer>

      {/* 6. The work */}
      <StyledContainer slice={{ primary: { top_padding: "Full", bottom_padding: "Half" } }} className="flex flex-col gap-10">
        <Title lead="The" accent="work." />
        <DeviceViewer name={c.name} url={c.liveUrl} desktop={c.desktopShots} mobile={c.mobileShots} />
      </StyledContainer>

      {/* 7. Design highlights */}
      <StyledContainer slice={{ primary: { top_padding: "Half", bottom_padding: "Full" } }} className="flex flex-col gap-10">
        <div className="flex flex-col lg:flex-row lg:items-end gap-5 lg:gap-20">
          <Title lead="Design" accent="highlights." className="lg:w-[520px] shrink-0" />
          <p className="flex-1 text-body-base text-text-description">{c.highlights.intro}</p>
        </div>
        <ul data-reveal-stagger className="grid md:grid-cols-2 gap-x-6 gap-y-12">
          {c.highlights.items.map((h) => (
            <li key={h.title} className="flex flex-col gap-5">
              <figure className="flex flex-col gap-3">
                <BrowserFrame url={c.liveUrl ?? `${c.name} (design)`} className="shadow-[0_20px_50px_-20px_rgba(10,23,51,0.3)]!">
                  <div className="aspect-[16/10] overflow-hidden bg-offwhite-2">
                    <ShotImage shot={h.shot} sizes="(min-width: 768px) 620px, 100vw" className="h-full! object-cover object-top" />
                  </div>
                </BrowserFrame>
                <figcaption className="text-body-small text-text-inactive">{h.caption}</figcaption>
              </figure>
              <div className="flex flex-col gap-2">
                <h3 className="font-title font-medium text-[24px] leading-[30px] text-text-heading">{h.title}</h3>
                <p className="text-body-base text-text-description">{h.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </StyledContainer>

      {/* 8. What we built + 9. The numbers (dark) */}
      <StyledContainer
        as="section"
        slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }}
        parentClassName="grain relative overflow-hidden bg-[linear-gradient(to_bottom,#080d1a,#0a1733)] text-white"
        className="relative flex flex-col gap-20 lg:gap-28"
      >
        <div aria-hidden className="absolute left-1/2 -translate-x-1/2 -top-[300px] w-[900px] max-w-[120vw] h-[420px] rounded-full bg-primary-light/35 blur-[90px]" />
        <div className="relative flex flex-col lg:flex-row gap-10 lg:gap-20">
          <div className="lg:w-[420px] shrink-0">
            <div className="lg:sticky lg:top-32 flex flex-col gap-5">
              <Title lead="What we" accent="built." dark />
              <p className="text-body-base text-white/65">Everything that went into the {c.name} {c.status === "Live" ? "website" : "design"}.</p>
            </div>
          </div>
          <ul data-reveal-stagger className="flex-1 rounded-[24px] border border-white/12 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-3 md:p-4">
            {c.delivered.map((d) => (
              <li key={d} className="flex items-start gap-3.5 px-4 py-4 border-b border-white/8 last:border-b-0 text-body-base text-white/85">
                <CheckDot size={22} />
                {d}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex flex-col gap-10">
          <Title lead="The" accent="numbers." dark />
          <ul data-reveal-stagger className="grid sm:grid-cols-3 rounded-[24px] border border-white/12 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] overflow-hidden">
            {c.numbers.map((n) => (
              <li key={n.label} className="flex flex-col gap-3 px-8 py-9 border-white/10 border-b sm:border-b-0 sm:border-r last:border-0">
                <span className="font-title font-medium text-[56px] lg:text-[64px] leading-none tracking-[-0.04em] bg-clip-text text-transparent bg-[linear-gradient(to_bottom,#fff,#99c9ff)]">
                  {n.value}
                </span>
                <span className="text-body-small text-white/65">{n.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </StyledContainer>

      {/* 10. More projects */}
      <StyledContainer slice={{ primary: { top_padding: "Full", bottom_padding: "Half" } }} className="flex flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <Title lead="More" accent="projects." />
          <Link href="/work" className="inline-flex items-center gap-2 text-body-base-bold text-primary-light hover:underline">
            See all work <ArrowUpRight size={14} />
          </Link>
        </div>
        <ul data-reveal-stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {more.map((m) => (
            <li key={m.slug} className={clsx(more.length === 3 && "last:sm:max-lg:col-span-2")}>
              <ProjectCard c={m} />
            </li>
          ))}
        </ul>
      </StyledContainer>

      {/* 11. CTA */}
      <CaseStudyCta title={c.cta.title} text={c.cta.text} />
    </article>
  );
}
