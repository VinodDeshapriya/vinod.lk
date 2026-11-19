// The one fully designed blog article (Figma "Blog article — /blog/website-cost-sri-lanka (template)"),
// as a Prismic "blog" document in API shape. The "[ADD: …]" notes are Vinod's to fill in.
const spans = (text, words, type) =>
  words.map((w) => {
    const s = text.indexOf(w);
    if (s < 0) throw new Error(`"${w}" not in "${text}"`);
    return { start: s, end: s + w.length, type };
  });
const p = (text, bold = []) => ({ type: "paragraph", text, spans: spans(text, bold, "strong") });
const h2 = (text) => ({ type: "heading2", text, spans: [] });
const li = (text, bold = []) => ({ type: "list-item", text, spans: spans(text, bold, "strong") });
const link = (url, text, variant) => ({ link_type: "Web", url, text, ...(variant ? { variant } : {}) });
let n = 0;
const slice = (slice_type, primary, variation = "default") => ({ id: `${slice_type}$b${n++}`, slice_type, slice_label: null, variation, version: "initial", primary, items: [] });

export const blogPosts = {
  "website-cost-sri-lanka": {
    title: "How Much Does a Website Cost in Sri Lanka?",
    display_title: [{ type: "heading1", text: "How Much Does a Website Cost in Sri Lanka?", spans: spans("How Much Does a Website Cost in Sri Lanka?", ["in Sri Lanka?"], "em") }],
    tag: "Website Planning",
    excerpt: "A plain-English guide to website prices, what affects them and what you should expect for your budget.",
    cover_image: {},
    publish_date: null,
    read_minutes: 6,
    featured: true,
    related_service_title: "Website Design",
    related_service_text: "Custom, mobile-first websites planned around how your customers think.",
    related_service_link: link("/web-design-sri-lanka", "Website Design"),
    meta_title: "How Much Does a Website Cost in Sri Lanka?",
    meta_description: "A plain-English guide to website prices in Sri Lanka: what affects the cost, typical price ranges and how to get a fixed quote.",
    slices: [
      slice("rich_text", {
        content: [
          p("The short answer: a simple business website starts from LKR 80,000. The real price depends on how many pages you need, what the site has to do and how much of it is custom. Here's what affects the price, and how to get a fixed quote.", ["The short answer:"]),
          p("[ADD: article intro, 2 to 3 short paragraphs. Why prices vary so much in Sri Lanka, and what this guide covers.]"),
          h2("What affects the price"),
          li("Number of pages: a 5-page site costs less than a 20-page one.", ["Number of pages:"]),
          li("Custom design: designing from a blank page takes more time than adapting a layout.", ["Custom design:"]),
          li("Features: bookings, payments, WhatsApp chat or member logins add build time.", ["Features:"]),
          li("Content: who writes and prepares the text and photos.", ["Content:"]),
          li("Ecommerce: the number of products and payment and delivery options.", ["Ecommerce:"]),
        ],
      }),
      slice("article_table", {
        heading: "Typical price ranges", column_1: "Website type", column_2: "Typical price", column_3: "Timeline",
        rows: [
          ["Simple business website", "From LKR 80,000", "4 to 5 weeks"],
          ["Ecommerce store", "[ADD: range]", "[ADD: weeks]"],
          ["Booking website", "[ADD: range]", "[ADD: weeks]"],
          ["Custom system or portal", "Priced after a free call", "Depends on scope"],
        ].map(([cell_1, cell_2, cell_3]) => ({ cell_1, cell_2, cell_3 })),
        note: "Prices are a guide only. You always get a fixed quote before work begins.",
      }),
      slice("rich_text", {
        content: [
          h2("Fast Track vs Full Custom"),
          p("Both options are custom-designed, never templated. Fast Track takes 2 to 4 weeks, with AI-assisted layouts refined by hand. Full Custom takes 4 to 8 weeks, with hand-crafted design and deeper research. [ADD: how each affects the price]"),
          h2("Costs to ask about up front"),
          p("[ADD: hosting, domain renewal, email, paid plugins or apps, and changes after launch. Explain which are one-off and which are yearly.]"),
        ],
      }),
      slice("article_callout", { quote: [{ type: "paragraph", text: "[ADD: pull quote from the article]", spans: [] }] }, "quote"),
      slice("rich_text", {
        content: [
          h2("How to get a fixed quote"),
          p("Book a free 20-minute call. Tell me what you're trying to achieve, and I'll send a proposal with the scope, timeline and a fixed price. No surprises later."),
        ],
      }),
      slice("article_callout", { title: "Need a price for your website?", text: "Get a fixed quote after a free call.", link: link("/contact", "Get a Free Quote", "Primary") }),
      slice("faq", {
        heading: "Frequently asked questions",
        faqs: [
          ["How long does a website take?", "Most business websites go live in 4 to 5 weeks. Ecommerce stores and custom systems take longer."],
          ["Do you use templates?", "No. Every site is custom-designed for your business."],
          ["Will I own my website?", "Yes. Once the project is paid, the website and its content belong to you."],
        ].map(([question, a]) => ({ question, answer: [p(a)] })),
      }, "simple"),
      slice("call_to_action", {
        title: [{ type: "heading2", text: "Rather talk it through?", spans: spans("Rather talk it through?", ["talk it through?"], "em") }],
        intro: null, background_image: {}, buttons: [{ link: link("/contact", "Book a Free Call", "Primary") }],
      }),
    ],
  },
};

/** Settings fields added for the blog (author box and the article sidebar CTA). */
export const blogSettings = {
  author_name: "Vinod Deshapriya",
  author_bio: "UX engineer in Sri Lanka. I design and build websites, brands and business systems for small businesses.",
  author_photo: {},
  article_cta_eyebrow: "Free 20-minute call",
  article_cta_title: [{ type: "heading3", text: "Get a fixed price for your website", spans: spans("Get a fixed price for your website", ["your website"], "em") }],
  article_cta_link: link("/contact", "Book a Free Call", "Primary"),
};
