export interface Faq {
  question: string;
  /** Answer paragraphs. `**text**` is rendered bold. */
  answer: string;
}

/**
 * Q1 answer is from Figma. Answers 2–5 are drafts written from facts used
 * elsewhere on the home page — REVIEW before launch.
 */
export const faqs: Faq[] = [
  {
    question: "How much does a website cost in Sri Lanka?",
    answer:
      "It depends on the number of pages, features and whether you need ecommerce or booking. A simple business website starts from **LKR 80,000**, and larger or custom builds are priced after a free call. You always get a fixed quote before work begins, with no hidden costs.",
  },
  {
    question: "How long does it take to build a website?",
    answer:
      "A Fast Track site usually takes **2 to 4 weeks**, and a Full Custom build **4 to 8 weeks**. You get a clear timeline at the start of the project, and we stick to it.",
  },
  {
    question: "Will my website show up on Google?",
    answer:
      "Every site is built SEO-ready from day one: keyword research, a sitemap, clean code, fast load times and proper headings. At launch we submit your site to Google and share tips for your Google Business Profile.",
  },
  {
    question: "Can I update the website myself?",
    answer:
      "Yes. When your site goes live we show you how to edit it, so you can update text, images and posts yourself. Support continues after launch if you ever need a hand.",
  },
  {
    question: "Do you work with businesses outside Colombo?",
    answer:
      "Yes, I work with businesses across Sri Lanka. Everything can be done online, and you can call, email or WhatsApp me directly, in Sinhala or English.",
  },
];
