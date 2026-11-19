import type { Content } from "@prismicio/client";
import { PrismicRichText, type SliceComponentProps } from "@prismicio/react";
import { articleH2 } from "@/components/blog/articleStyles";
import { slugify } from "@/lib/blog";
import FaqPanel from "./FaqPanel";

export type FaqProps = SliceComponentProps<Content.FaqSlice>;

/** Figma: faq_variants1 (19338:3456) for "default"; the blog article's FAQ list for "simple". */
const Faq = ({ slice }: FaqProps) => {
  if (slice.variation === "simple") {
    const { heading, faqs } = slice.primary;
    return (
      <section data-slice-type={slice.slice_type} className="my-12">
        {heading && <h2 id={slugify(heading)} className={`${articleH2} mb-4`}>{heading}</h2>}
        <dl>
          {faqs.map((f, i) => (
            <div key={i} className="py-5 border-b border-border-secondary">
              <dt className="text-body-base-bold text-text-heading">{f.question}</dt>
              <dd className="mt-2 text-body-small text-text-description">
                <PrismicRichText field={f.answer} />
              </dd>
            </div>
          ))}
        </dl>
      </section>
    );
  }
  return (
    <div data-slice-type={slice.slice_type}>
      <FaqPanel primary={slice.primary} />
    </div>
  );
};

export default Faq;
