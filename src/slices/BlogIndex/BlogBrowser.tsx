"use client";
import { useMemo, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import type { RichTextField } from "@prismicio/client";
import ArrowForward from "atd-icons/dist/ArrowForward";
import StyledContainer from "@/components/ui/StyledContainer";
import PrismicTitle from "@/components/ui/PrismicTitle";
import PostCard from "@/components/blog/PostCard";
import TypographicCover from "@/components/blog/TypographicCover";
import { formatDate, type PostSummary } from "@/lib/blog";

const ALL = "All";
const featuredTitle = "font-title font-medium text-[32px] leading-[40px] lg:text-[36px] lg:leading-[44px] tracking-[-0.02em] text-text-heading";

/** Client part of BlogIndex: category tabs, featured post, paged grid. */
export default function BlogBrowser({
  eyebrow,
  title,
  intro,
  listTitle,
  perPage,
  posts,
  author,
}: {
  eyebrow: string | null;
  title: RichTextField;
  intro: string | null;
  listTitle: RichTextField;
  perPage: number;
  posts: PostSummary[];
  author: string;
}) {
  const [tab, setTab] = useState(ALL);
  const [page, setPage] = useState(1);

  const tags = useMemo(() => [ALL, ...new Set(posts.map((p) => p.tag).filter(Boolean))], [posts]);
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const showFeatured = tab === ALL && !!featured;
  const list = posts.filter((p) => (tab === ALL ? p !== featured : p.tag === tab));
  const pages = Math.max(1, Math.ceil(list.length / perPage));
  const shown = list.slice((page - 1) * perPage, page * perPage);

  const pick = (t: string) => {
    setTab(t);
    setPage(1);
  };
  const go = (n: number) => {
    setPage(n);
    document.getElementById("articles")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <StyledContainer as="section" parentClassName="pt-10 lg:pt-[58px] pb-16" className="flex flex-col gap-14">
        <div className="mx-auto max-w-[1026px] flex flex-col items-center gap-6 text-center">
          {eyebrow && <p className="text-title-base-blog text-text-heading">{eyebrow}</p>}
          <PrismicTitle field={title} className="text-title-3x-large text-text-heading" />
          {intro && <p className="max-w-[700px] text-body-base text-text-description">{intro}</p>}
          {tags.length > 2 && (
            <div role="tablist" aria-label="Filter articles" className="mt-2 flex flex-wrap justify-center gap-1 p-1.5 rounded-full bg-offwhite-2 border border-border-secondary">
              {tags.map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={tab === t}
                  onClick={() => pick(t)}
                  className={clsx(
                    "px-4 py-2 rounded-full text-body-small transition-colors",
                    tab === t ? "bg-text-heading text-white" : "text-text-heading hover:bg-white",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        {showFeatured && (
          <article className="group grid lg:grid-cols-[minmax(0,680px)_1fr] items-center gap-8 lg:gap-14 p-3 rounded-[32px] bg-white border border-border-primary shadow-[0_16px_48px_0_rgba(10,18,33,0.06)]">
            <Link href={featured.href} tabIndex={-1} aria-hidden>
              <TypographicCover tag={featured.tag} title={featured.coverTitle} size="large" className="h-[300px] lg:h-[436px]" />
            </Link>
            <div className="flex flex-col items-start gap-5 px-4 pb-6 lg:p-0 lg:pr-10">
              <p className="flex items-center gap-3">
                {featured.tag && (
                  <span className="px-3 py-1.5 rounded-full bg-info-bg text-xs font-medium uppercase tracking-[0.12em] text-primary-light">
                    {featured.tag}
                  </span>
                )}
                <span className="text-xs font-medium uppercase tracking-[0.12em] text-text-inactive">Featured</span>
              </p>
              <Link href={featured.href} className="hover:opacity-80 transition-opacity">
                {featured.displayTitle ? (
                  <PrismicTitle field={featured.displayTitle} className={featuredTitle} />
                ) : (
                  <h2 className={featuredTitle}>{featured.title}</h2>
                )}
              </Link>
              <p className="text-body-small text-text-description">{featured.excerpt}</p>
              <div className="w-full mt-3 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span aria-hidden className="size-10 rounded-full bg-info-bg" />
                  <span className="flex flex-col">
                    <span className="text-body-small font-medium text-text-heading">{author}</span>
                    <span className="text-[13px] text-text-inactive">
                      {featured.date && <time dateTime={featured.date} className="text-primary-light">{formatDate(featured.date)}</time>}
                      {featured.date && featured.readMinutes ? " · " : ""}
                      {featured.readMinutes ? `${featured.readMinutes} min read` : ""}
                    </span>
                  </span>
                </div>
                <Link href={featured.href} className="px-6 py-2.5 rounded-full border border-text-heading text-body-small font-medium text-text-heading hover:bg-text-heading hover:text-white transition-colors">
                  Read article
                </Link>
              </div>
            </div>
          </article>
        )}
      </StyledContainer>

      <StyledContainer
        as="section"
        slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }}
        parentClassName="bg-offwhite-2"
        className="flex flex-col gap-10"
      >
        <div id="articles" className="scroll-mt-28 flex flex-wrap items-end justify-between gap-3">
          <PrismicTitle field={listTitle} className="font-title font-medium text-[32px] leading-[40px] tracking-[-0.02em] text-text-heading" />
          {list.length > 0 && (
            <p className="text-[13px] text-text-inactive">
              Showing {shown.length} of {list.length} article{list.length === 1 ? "" : "s"}
            </p>
          )}
        </div>
        {shown.length ? (
          <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {shown.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </ul>
        ) : (
          <p className="text-body-base text-text-description">No articles here yet.</p>
        )}
        {pages > 1 && (
          <nav aria-label="Pagination" className="flex items-center justify-center gap-2">
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => go(n)}
                aria-current={n === page ? "page" : undefined}
                className={clsx(
                  "size-10 rounded-full text-body-small transition-colors",
                  n === page ? "bg-text-heading text-white" : "text-text-heading hover:bg-white",
                )}
              >
                {n}
              </button>
            ))}
            {page < pages && (
              <button
                type="button"
                onClick={() => go(page + 1)}
                className="ml-4 flex items-center gap-2 px-6 py-2.5 rounded-full border border-text-heading text-body-small font-medium text-text-heading hover:bg-text-heading hover:text-white transition-colors"
              >
                Next page
                <ArrowForward size={14} />
              </button>
            )}
          </nav>
        )}
      </StyledContainer>
    </>
  );
}
