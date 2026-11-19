export interface PostPreview {
  slug: string;
  tag: string;
  title: string;
  excerpt: string;
  /** ISO date. TODO: add real publish dates (Figma shows "[ADD: date]"). */
  date?: string;
  readMinutes: number;
}

export const latestPosts: PostPreview[] = [
  {
    slug: "how-much-does-a-website-cost-in-sri-lanka",
    tag: "Pricing",
    title: "How Much Does a Website Cost in Sri Lanka?",
    excerpt:
      "A plain-English guide to website prices, what affects them and what you should expect for your budget.",
    readMinutes: 6,
  },
  {
    slug: "how-to-rank-your-business-on-google-in-sri-lanka",
    tag: "SEO",
    title: "How to Rank Your Business on Google in Sri Lanka",
    excerpt:
      "Simple local SEO steps any business owner can start this week, from Google Business Profile to reviews.",
    readMinutes: 7,
  },
  {
    slug: "woocommerce-vs-shopify-sri-lanka",
    tag: "Ecommerce",
    title: "WooCommerce vs Shopify for Sri Lankan Online Stores",
    excerpt:
      "Payments, delivery, costs and ease of use, compared side by side for selling online in Sri Lanka.",
    readMinutes: 5,
  },
];
