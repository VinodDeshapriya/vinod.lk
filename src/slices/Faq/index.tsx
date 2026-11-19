import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import FaqPanel from "./FaqPanel";

export type FaqProps = SliceComponentProps<Content.FaqSlice>;

/** Figma: 📦 Components › FAQs Section Variants › faq_variants1 (19338:3456) */
const Faq = ({ slice }: FaqProps) => (
  <div data-slice-type={slice.slice_type}>
    <FaqPanel primary={slice.primary} />
  </div>
);

export default Faq;
