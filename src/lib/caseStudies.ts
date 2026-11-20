import { asImageSrc, type Content } from "@prismicio/client";
import { createClient } from "@/prismicio";
import { caseStudies as localCaseStudies, toCard } from "@/data/caseStudies";
import type { ProjectCardData } from "@/components/work/ProjectCard";

/** Every published case study, in the order set on each page (then by name). */
export async function getCaseStudyDocs(): Promise<Content.CaseStudyDocument[]> {
  const docs = await createClient()
    .getAllByType("case_study")
    .catch(() => [] as Content.CaseStudyDocument[]);
  return docs.sort(
    (a, b) => (a.data.order ?? 99) - (b.data.order ?? 99) || (a.data.name ?? "").localeCompare(b.data.name ?? ""),
  );
}

export const docToCard = (d: Content.CaseStudyDocument): ProjectCardData => ({
  href: `/work/${d.uid}`,
  name: d.data.name || d.uid,
  summary: d.data.summary ?? "",
  category: d.data.category ?? "",
  image: asImageSrc(d.data.thumbnail)
    ? { src: asImageSrc(d.data.thumbnail)!, alt: d.data.thumbnail.alt ?? `${d.data.name} website` }
    : undefined,
});

/**
 * Cards for the work grid: Prismic case studies, or the local ones until the
 * Prismic pages are published. `skip` leaves out the page being viewed and
 * starts after it, wrapping round.
 */
export async function getProjectCards(skip?: string): Promise<{ key: string; card: ProjectCardData }[]> {
  const docs = await getCaseStudyDocs();
  const all = docs.length
    ? docs.map((d) => ({ key: d.uid, card: docToCard(d) }))
    : localCaseStudies.map((c) => ({ key: c.slug, card: toCard(c) }));
  if (!skip) return all;
  const i = all.findIndex((x) => x.key === skip);
  return i < 0 ? all : [...all.slice(i + 1), ...all.slice(0, i)];
}
