import Image from "next/image";
import Link from "next/link";
import ArrowForward from "atd-icons/dist/ArrowForward";
import StyledContainer from "@/components/ui/StyledContainer";
import type { Content } from "@prismicio/client";
import { asLink } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import { createClient } from "@/prismicio";
import PrismicButtons from "@/components/ui/PrismicButtons";
import SectionHeading from "@/components/ui/SectionHeading";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export type BlogPreviewProps = SliceComponentProps<Content.BlogPreviewSlice>;

/** Figma: 📦 Components › Blog Section Variants › blog_variants1 (19345:3779). Shows the latest blog documents. */
const BlogPreview = async ({ slice }: BlogPreviewProps) => {
  const { title, number_of_posts, buttons } = slice.primary;
  const posts = await createClient()
    .getAllByType("blog", {
      limit: number_of_posts || 3,
      orderings: [
        { field: "my.blog.publish_date", direction: "desc" },
        { field: "document.first_publication_date", direction: "desc" },
      ],
    })
    .catch(() => [] as Content.BlogDocument[]);
  if (!posts.length) return null;

  return (
    <StyledContainer
      as="section"
      slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }}
      parentClassName="bg-offwhite-2"
      className="flex flex-col gap-10 items-center"
    >
      <SectionHeading title={title} />
      <ul className="w-full grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </ul>
      <PrismicButtons buttons={buttons} />
    </StyledContainer>
  );
};

export default BlogPreview;

function PostCard({ post: doc }: { post: Content.BlogDocument }) {
  const href = asLink(doc) ?? `/blog/${doc.uid}`;
  const post = {
    tag: doc.data.tag ?? "",
    title: doc.data.title ?? "",
    excerpt: doc.data.excerpt ?? "",
    date: doc.data.publish_date ?? undefined,
    readMinutes: doc.data.read_minutes,
  };
  return (
    <li className="group flex flex-col p-2.5 bg-white border border-border-primary rounded-lg shadow-[0_16px_48px_0_rgba(10,18,33,0.06)]">
      {/* Typographic cover, generated from the post data */}
      <Link
        href={href}
        className="relative h-[280px] rounded-[20px] overflow-hidden flex flex-col items-center justify-center gap-5 px-8 text-center bg-[linear-gradient(144deg,#05080f_0%,#0a142e_43%,#0d3880_71%)]"
      >
        <span
          aria-hidden
          className="absolute -top-14 left-1/4 w-[300px] h-[220px] rounded-full bg-primary-light/45 blur-[80px] transition-opacity group-hover:opacity-80"
        />
        <span className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-medium uppercase tracking-[0.12em] text-white/90">
          <span className="size-[5px] rounded-full bg-secondary-light" />
          {post.tag}
        </span>
        <span className="relative font-title font-semibold text-[28px] leading-[33px] tracking-[-0.02em] bg-clip-text text-transparent bg-[linear-gradient(to_bottom,#fff,#bfdbff)]">
          {post.title}
        </span>
        <Image
          src="/logo-white.svg"
          alt=""
          width={74}
          height={25}
          className="relative h-[25px] w-auto"
        />
      </Link>

      <div className="flex flex-col gap-3.5 grow px-[18px] pt-[22px] pb-3">
        <span className="self-start px-3 py-1.5 rounded-full bg-info-bg text-xs font-medium uppercase tracking-[0.12em] text-primary-light">
          {post.tag}
        </span>
        <h3 className="text-title-base text-text-heading">
          <Link href={href} className="hover:text-primary-light transition-colors">
            {post.title}
          </Link>
        </h3>
        <p className="text-body-small text-text-description">{post.excerpt}</p>
        <div className="grow" />
        <div className="flex items-center justify-between pt-4 border-t border-border-secondary">
          <p className="text-body-small text-text-inactive">
            {post.date && (
              <>
                <time dateTime={post.date} className="text-primary-light">
                  {formatDate(post.date)}
                </time>
                {" · "}
              </>
            )}
            {post.readMinutes ? `${post.readMinutes} min read` : null}
          </p>
          <Link
            href={href}
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
