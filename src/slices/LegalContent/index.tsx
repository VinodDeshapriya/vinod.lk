import type { Content } from "@prismicio/client";
import { asText, isFilled } from "@prismicio/client";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";
import StyledContainer from "@/components/ui/StyledContainer";
import StyledButton from "@/components/ui/StyledButton";
import { articleProse } from "@/components/blog/articleStyles";
import { slugify } from "@/lib/blog";

export type LegalContentProps = SliceComponentProps<Content.LegalContentSlice>;

const formatDate = (d: string) =>
  new Date(`${d}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

/**
 * Legal page body (Privacy Policy, Terms & Conditions).
 * Each Heading 2 in the content becomes a numbered section and an entry in the sticky contents list.
 */
const LegalContent = ({ slice }: LegalContentProps) => {
  const { last_updated, content, contact_title, contact_text, contact_link } =
    slice.primary;
  const toc = content
    .filter((b) => b.type === "heading2")
    .map((b) => {
      const text = asText([b]);
      return { id: slugify(text), text };
    });

  return (
    <StyledContainer
      as="section"
      data-slice-type={slice.slice_type}
      slice={{ primary: { top_padding: "Half", bottom_padding: "Full" } }}
      className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-20"
    >
      <aside className="lg:order-2 lg:w-[320px] shrink-0 lg:sticky lg:top-28 flex flex-col gap-5">
        {last_updated && (
          <p className="inline-flex self-start items-center gap-2 px-3.5 py-1.5 rounded-full bg-offwhite-2 border border-border-secondary text-body-small text-text-description">
            <span
              aria-hidden
              className="size-1.5 rounded-full bg-primary-light"
            />
            Last updated{" "}
            <time dateTime={last_updated}>{formatDate(last_updated)}</time>
          </p>
        )}
        {toc.length > 0 && (
          <nav
            aria-label="On this page"
            className="hidden lg:block p-5 rounded-[20px] border border-border-secondary bg-offwhite-2"
          >
            <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.12em] text-text-inactive">
              On this page
            </p>
            <ul className="flex flex-col border-l border-border-primary">
              {toc.map((h) => (
                <li key={h.id}>
                  <a
                    href={`#${h.id}`}
                    className="block -ml-px pl-4 py-1.5 border-l-2 border-transparent text-body-small text-text-description hover:text-primary-light hover:border-primary-light transition-colors"
                  >
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
        {contact_title && (
          <div className="hidden lg:flex flex-col items-start gap-3 p-6 rounded-[20px] text-white bg-[linear-gradient(140deg,#080d1a_0%,#0a1733_55%,#0f4da8_100%)]">
            <p className="font-title font-medium text-[22px] leading-[30px]">
              {contact_title}
            </p>
            {contact_text && (
              <p className="text-body-small text-white/75">{contact_text}</p>
            )}
            {isFilled.link(contact_link) && (
              <StyledButton field={contact_link} />
            )}
          </div>
        )}
      </aside>

      <div
        className={`flex-1 min-w-0 max-w-[780px] [&>:first-child]:mt-0 ${articleProse}`}
      >
        <PrismicRichText
          field={content}
          components={{
            heading2: ({ children, text }) => (
              <h2 id={slugify(text ?? "")}>{children}</h2>
            ),
          }}
        />
        {contact_title && (
          <div className="lg:hidden mt-12 flex flex-col items-start gap-3 p-6 rounded-[20px] text-white bg-[linear-gradient(140deg,#080d1a_0%,#0a1733_55%,#0f4da8_100%)]">
            <p className="font-title font-medium text-[22px] leading-[30px] text-white!">
              {contact_title}
            </p>
            {contact_text && (
              <p className="m-0! text-body-small text-white/75">
                {contact_text}
              </p>
            )}
            {isFilled.link(contact_link) && (
              <StyledButton field={contact_link} />
            )}
          </div>
        )}
      </div>
    </StyledContainer>
  );
};

export default LegalContent;
