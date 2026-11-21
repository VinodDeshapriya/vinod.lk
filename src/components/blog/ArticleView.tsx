import Link from "next/link";
import { asText, isFilled, type Content } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import Time from "atd-icons/dist/Time";
import ArrowForward from "atd-icons/dist/ArrowForward";
import { components } from "@/slices";
import StyledContainer from "@/components/ui/StyledContainer";
import PrismicTitle from "@/components/ui/PrismicTitle";
import StyledButton from "@/components/ui/StyledButton";
import TypographicCover from "./TypographicCover";
import PostCard from "./PostCard";
import CopyLinkButton from "./CopyLinkButton";
import { formatDate, slugify, toPostSummary } from "@/lib/blog";

/** The article's contents list: its rich-text H2s plus titled table and FAQ slices, in order. */
function headings(slices: Content.BlogDocument["data"]["slices"]) {
  const out: { id: string; text: string }[] = [];
  for (const s of slices) {
    if (s.slice_type === "rich_text") {
      for (const node of s.primary.content) if (node.type === "heading2") out.push({ id: slugify(node.text), text: node.text });
    } else if (s.slice_type === "article_table" && s.primary.heading) {
      out.push({ id: slugify(s.primary.heading), text: s.primary.heading });
    } else if (s.slice_type === "faq" && s.variation === "simple" && s.primary.heading) {
      out.push({ id: slugify(s.primary.heading), text: s.primary.heading });
    }
  }
  return out;
}

/** Figma: "Blog article — /blog/website-cost-sri-lanka (template)" (19268:23942) */
export default function ArticleView({
  post,
  settings,
  latest,
}: {
  post: Content.BlogDocument;
  settings: Content.SettingsDocument | null;
  latest: Content.BlogDocument[];
}) {
  const d = post.data;
  const s = settings?.data;
  const author = s?.author_name || "Vinod Deshapriya";
  const body = d.slices.filter((sl) => sl.slice_type !== "call_to_action");
  const ctas = d.slices.filter((sl) => sl.slice_type === "call_to_action");
  const toc = headings(d.slices);
  const more = latest.filter((p) => p.id !== post.id).slice(0, 3);
  const plainTitle = d.title || asText(d.display_title);

  return (
    <>
      <article>
        <StyledContainer parentClassName="pt-10 lg:pt-14" className="flex flex-col gap-6">
          <nav aria-label="Breadcrumb" className="text-body-small">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/blog" className="text-text-inactive hover:text-primary-light">Blog</Link></li>
              {d.tag && (
                <>
                  <li aria-hidden className="text-border-primary">/</li>
                  <li className="text-primary-light">{d.tag}</li>
                </>
              )}
            </ol>
          </nav>
          {isFilled.richText(d.display_title) ? (
            <PrismicTitle field={d.display_title} className="max-w-[1000px] font-title font-medium text-[40px] leading-[48px] lg:text-[64px] lg:leading-[72px] tracking-[-0.023em] text-text-heading" />
          ) : (
            <h1 className="max-w-[1000px] font-title font-medium text-[40px] leading-[48px] lg:text-[64px] lg:leading-[72px] tracking-[-0.023em] text-text-heading">{d.title}</h1>
          )}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-border-secondary text-body-small">
            <p className="flex items-center gap-3 text-text-heading">
              {isFilled.image(s?.author_photo) ? (
                <PrismicNextImage field={s.author_photo} className="size-9 rounded-full object-cover" fallbackAlt="" />
              ) : (
                <span aria-hidden className="size-9 rounded-full bg-info-bg" />
              )}
              {author}
              {d.publish_date && (
                <>
                  <span aria-hidden className="text-text-inactive">·</span>
                  <time dateTime={d.publish_date} className="text-text-inactive">{formatDate(d.publish_date)}</time>
                </>
              )}
            </p>
            {d.read_minutes ? (
              <p className="flex items-center gap-1.5 text-text-inactive">
                <Time size={16} aria-hidden />
                {d.read_minutes} min read
              </p>
            ) : null}
          </div>
        </StyledContainer>

        <StyledContainer parentClassName="pt-10">
          {isFilled.image(d.cover_image) ? (
            <PrismicNextImage field={d.cover_image} priority sizes="(min-width: 1280px) 1280px, 100vw" className="w-full h-auto rounded-[28px]" fallbackAlt="" />
          ) : (
            <TypographicCover tag={d.tag ?? ""} title={d.cover_title || plainTitle} size="large" className="h-[320px] lg:h-[560px]" />
          )}
        </StyledContainer>

        <StyledContainer
          parentClassName="pt-12 lg:pt-16 pb-(--spacing-vertical-padding-full)"
          className="flex flex-col lg:flex-row lg:items-start gap-12 lg:gap-20"
        >
          <div className="flex-1 min-w-0 max-w-[780px]">
            {/* The first paragraph of the article is its lead (Figma: larger, darker). */}
            <div className="[&>:first-child>p:first-child]:text-[20px] [&>:first-child>p:first-child]:leading-[32px] [&>:first-child>p:first-child]:text-text-heading">
              <SliceZone slices={body} components={components} context={{ settings, inArticle: true }} />
            </div>

            <div className="mt-12 flex items-start gap-4 p-6 rounded-[20px] bg-offwhite-2 border border-border-secondary">
              {isFilled.image(s?.author_photo) ? (
                <PrismicNextImage field={s.author_photo} className="size-14 shrink-0 rounded-full object-cover" fallbackAlt="" />
              ) : (
                <span aria-hidden className="size-14 shrink-0 rounded-full bg-info-bg" />
              )}
              <div className="flex flex-col gap-1">
                <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-text-inactive">Written by</p>
                <p className="text-body-base-bold text-text-heading">{author}</p>
                {s?.author_bio && <p className="text-body-small text-text-description">{s.author_bio}</p>}
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <span className="text-[12px] font-medium uppercase tracking-[0.12em] text-text-inactive">Share</span>
              <CopyLinkButton />
            </div>
          </div>

          <aside className="lg:w-[380px] shrink-0 lg:sticky lg:top-28 flex flex-col gap-5">
            {toc.length > 0 && (
              <nav aria-label="On this page" className="p-5 rounded-[20px] border border-border-secondary bg-offwhite-2">
                <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.12em] text-text-inactive">On this page</p>
                <ul className="flex flex-col border-l border-border-primary">
                  {toc.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="block -ml-px pl-4 py-1.5 border-l-2 border-transparent text-body-small text-text-description hover:text-primary-light hover:border-primary-light">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            {isFilled.link(s?.article_cta_link) && (
              <div className="relative overflow-hidden flex flex-col items-start gap-3 p-6 rounded-[20px] text-white bg-[linear-gradient(140deg,#080d1a_0%,#0a1733_55%,#0f4da8_100%)]">
                {s.article_cta_eyebrow && (
                  <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-secondary-light">{s.article_cta_eyebrow}</p>
                )}
                <PrismicTitle field={s.article_cta_title} className="font-title font-medium text-[22px] leading-[30px]" emClassName="text-secondary-light" />
                <StyledButton field={s.article_cta_link} />
              </div>
            )}
            {d.related_service_title && (
              <PrismicNextLink field={d.related_service_link} className="group flex flex-col gap-1.5 p-5 rounded-[20px] border border-border-primary hover:border-primary-light transition-colors">
                <span className="text-[12px] font-medium uppercase tracking-[0.12em] text-text-inactive">Related service</span>
                <span className="flex items-center justify-between text-body-base-bold text-text-heading group-hover:text-primary-light">
                  {d.related_service_title}
                  <ArrowForward size={16} aria-hidden />
                </span>
                {d.related_service_text && <span className="text-body-small text-text-description">{d.related_service_text}</span>}
              </PrismicNextLink>
            )}
          </aside>
        </StyledContainer>
      </article>

      {more.length > 0 && (
        <StyledContainer
          as="section"
          slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }}
          parentClassName="bg-offwhite-2"
          className="flex flex-col gap-10"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-title font-medium text-[32px] leading-[40px] tracking-[-0.02em] text-text-heading">
              More from <em className="italic text-primary-light">the blog</em>
            </h2>
            <Link href="/blog" className="px-6 py-2.5 rounded-full border border-text-heading text-body-small font-medium text-text-heading hover:bg-text-heading hover:text-surface transition-colors">
              View all articles
            </Link>
          </div>
          <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {more.map((p) => (
              <PostCard key={p.id} post={toPostSummary(p)} />
            ))}
          </ul>
        </StyledContainer>
      )}

      <SliceZone slices={ctas} components={components} context={{ settings }} />
    </>
  );
}

