import Link from "next/link";
import ArrowForward from "atd-icons/dist/ArrowForward";
import { formatDate, type PostSummary } from "@/lib/blog";
import clsx from "clsx";
import TypographicCover from "./TypographicCover";

/** Blog card (Figma blog_variants1 card): typographic cover, tag, title, excerpt, date and read time. */
export default function PostCard({ post, className }: { post: PostSummary; className?: string }) {
  return (
    <li
      className={clsx(
        "group flex flex-col p-2.5 bg-white border border-border-primary rounded-[28px] shadow-[0_16px_48px_0_rgba(10,18,33,0.06)]",
        className,
      )}
    >
      <Link href={post.href} tabIndex={-1} aria-hidden draggable={false}>
        <TypographicCover tag={post.tag} title={post.coverTitle} className="h-[280px]" />
      </Link>
      <div className="flex flex-col gap-3.5 grow px-[5px] pt-3 pb-3 md:px-[18px] md:pt-[22px]">
        {post.tag && (
          <span className="self-start px-3 py-1.5 rounded-full bg-info-bg text-xs font-medium uppercase tracking-[0.12em] text-primary-light">
            {post.tag}
          </span>
        )}
        <h3 className="text-title-base text-text-heading max-md:text-[20px] max-md:leading-[26px]">
          <Link href={post.href} className="hover:text-primary-light transition-colors">
            {post.title}
          </Link>
        </h3>
        <p className="text-body-small text-text-description">{post.excerpt}</p>
        <div className="grow" />
        <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between md:gap-0 pt-4 border-t border-border-secondary">
          <p className="text-body-small text-text-inactive">
            {post.date && (
              <>
                <time dateTime={post.date} className="text-primary-light">
                  {formatDate(post.date)}
                </time>
                {post.readMinutes ? " · " : null}
              </>
            )}
            {post.readMinutes ? `${post.readMinutes} min read` : null}
          </p>
          <Link
            href={post.href}
            draggable={false}
            className="flex items-center gap-1.5 text-body-base-bold text-text-heading hover:text-primary-light transition-colors"
            aria-label={`Read more: ${post.title}`}
          >
            Read more
            <ArrowForward size={16} />
          </Link>
        </div>
      </div>
    </li>
  );
}
