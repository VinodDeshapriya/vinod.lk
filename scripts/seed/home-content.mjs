// Home page content as Prismic slices (runtime/API shape). Used for the local
// preview route and as the source for the Prismic "home" document.
const p = (text, spans = []) => ({ type: "paragraph", text, spans });
const h = (type, text, em = []) => ({
  type, text, spans: em.map((w) => { const s = text.indexOf(w); return { start: s, end: s + w.length, type: "em" }; }),
});
const img = (url, w, h, alt = "") => ({ url, alt, copyright: null, dimensions: { width: w, height: h }, id: url, edit: { x: 0, y: 0, zoom: 1, background: "transparent" } });
const link = (url, text, variant) => ({ link_type: "Web", url, text, ...(variant ? { variant } : {}) });
const btn = (url, text, variant = "Primary") => ({ link: link(url, text, variant) });
let n = 0;
const slice = (slice_type, primary) => ({ id: `${slice_type}$${n++}`, slice_type, slice_label: null, variation: "default", version: "initial", primary, items: [] });
const quote = btn("/contact", "Get a Free Quote");
const cta = (t, em, intro) => slice("call_to_action", { title: [h("heading2", t, [em])], intro, background_image: {}, buttons: [quote, btn("/#work", "See Recent Work", "Secondary")] });

export const homeSlices = [
  slice("hero", {
    eyebrow: "System-Led UX Engineer in Sri Lanka",
    title: [h("heading1", "Designed for people.\nBuilt faster.", ["faster"])],
    description: "Fast, mobile-first websites, brands and business systems for Sri Lankan businesses. Every site is designed for you, built to rank on Google, and made to turn visitors into enquiries.",
    buttons: [quote, btn("/#work", "See Recent Work", "Secondary")],
    showcase_image: img("/images/home/hero-showcase.png", 1390, 772, "Absoliq website shown in a browser window"),
    logos_label: "Trusted by growing brands across Sri Lanka",
    logos: [["absoliq",152,30,"Absoliq"],["enjoy-sri-lanka",155,40,"Enjoy Sri Lanka"],["matara-bodhiya",173,40,"Matara Bodhiya"],["janangana",211,40,"Janangana"],["sun2earth",152,40,"Sun2Earth"],["ceylon-track",36,48,"Ceylon Track"],["somerset-blue",100,38,"Somerset Blue"]]
      .map(([f, w, hh, alt]) => ({ logo: img(`/images/clients/${f}.png`, w, hh, alt) })),
  }),
  slice("testimonials", {
    title: [h("heading2", "What clients say", ["clients"])],
    intro: "Real words from the businesses I've designed and built for, across Sri Lanka.",
    show_google_rating: true,
    reviews: [
      { name: "Supun Senarath", meta: "3 months ago · Absoliq", rating: 5, review: [p("We worked with Vinod to design our website for Absoliq, and the experience was really good from start to finish."), p("What stood out was that they actually understood what we needed and gave a unique solution, not just a pretty template. Communication also was clear throughout. He helped us to get the exact UI output we expected."), p("We are so much happy with the output and the way he delivered and also the way he made very valid points without just agreeing with us. Would work with him again for sure.")] },
      { name: "Chamila Rathnayake", meta: "2 years ago", rating: 5, review: [p("Vinod's design work is outstanding. He has a keen eye for aesthetics and a deep understanding of user experience principles, which he seamlessly integrated into our website. The result is a visually stunning and highly functional website that not only meets but exceeds our expectations."), p("Throughout the project, Vinod maintained clear and consistent communication and professionalism, ensuring that our vision was accurately captured and implemented. His ability to translate our ideas into a cohesive and engaging design was truly impressive. He was receptive to feedback and made adjustments swiftly, showcasing his commitment to delivering the best possible product. Keep up the good work Vinod."), p("Cheers"), p("Chamila")] },
      { name: "Bhaddiya Dodangoda", meta: "2 years ago", rating: 5, review: [p("I had the pleasure of working with Vinod on our recent website developed for spiritual content, and I was hyper impressed with the design he delivered. The UX/UI design was delivered timely and exceeded our expectations in every way. The design is stunning and professional, showcasing a deep understanding of our needs and vision. I feel Vinod demonstrated exceptional skill, creativity, and attention to detail, ensuring that every aspect of the design was polished and user-friendly. Thank you very much for a job well done!")] },
    ],
  }),
  slice("featured_project", {
    title: [h("heading2", "Recent build", ["build"])],
    intro: "A real project, from first idea to live site. See how clear UX thinking and a system-led build turned into a fast website that brings in leads, launched in about 5 weeks.",
    projects: [
      { name: "Absoliq", logo: img("/images/clients/absoliq.png", 152, 30, "Absoliq"), headline: "Turn every ad click into a qualified lead with one clear agency website.", summary: "Absoliq, Colombo. A lead-generating website for a growth marketing agency, designed, built and launched in about 5 weeks. Clear service pages, a strong audit offer and a call to action on every screen. Fast on mobile and ready for Google from day one.", tags: "Colombo, Sri Lanka | Agency Website | Landing Pages | SEO-ready | UX/UI Design | Website Development", is_live: true, image: img("/images/home/project-absoliq.png", 771, 609, "Absoliq homepage in a browser window"), link: link("/work/absoliq", "View the project") },
      ...["Matara Bodhiya", "Enjoy Sri Lanka", "Janangana", "Ceylon Track", "Somerset Mirissa Blue"].map((name) => ({ name, logo: {}, headline: null, summary: null, tags: null, is_live: false, image: {}, link: { link_type: "Any" } })),
    ],
    buttons: [quote, btn("/work", "See all projects", "Secondary")],
  }),
  slice("services_grid", {
    title: [h("heading2", "Websites, branding and systems,\nall under one roof", ["all under one roof"])],
    intro: "Whether you need your first business website, a full rebrand or a booking system that saves you hours each week, Vinod.lk handles it end to end. One team, one plan, and no passing you between agencies.",
    services: [
      ["Design","Web Design","Custom, mobile-friendly websites built around your customers, not a template.","/web-design-sri-lanka"],
      ["Branding","Branding & Logo Design","Logos, colours and brand guides that make your business look as good as it is.","/logo-design-sri-lanka"],
      ["Development","Website Development","Fast, secure websites built on WordPress, Shopify or custom code, with ecommerce, payments and bookings built in.","/website-development-sri-lanka"],
      ["Social","Social Media Marketing","Scroll-stopping post designs, captions and ad creative for Facebook, Instagram and TikTok.","/social-media-marketing-sri-lanka"],
      ["Systems","Business Systems","Booking systems, CRMs, client portals and custom tools that replace spreadsheets and paperwork.","/custom-software-sri-lanka"],
      ["AI","AI for Business","AI chatbots, automations and smart workflows that answer customers and save your team time.","/ai-solutions-sri-lanka"],
    ].map(([label, title, description, url]) => ({ label, title, description, link: link(url, title) })),
    buttons: [btn("/services", "All services", "Secondary")],
  }),
  cta("Websites, branding and systems,\nall under one roof", "all under one roof", "Whether you need your first business website, a full rebrand or a booking system that saves you hours each week, Vinod.lk handles it end to end. One team, one plan, and no passing you between agencies."),
  slice("compare", {
    title: [h("heading2", "Two ways to build. Both\nfully custom.", ["custom"])],
    intro: "Both options are designed only for you. The difference is speed and depth, so pick the one that fits your launch date and budget.",
    lane_1_pill: "Lane 1", lane_1_name: "Fast Track", lane_1_tagline: "Launch sooner. Still never a template.",
    lane_2_pill: "Lane 2", lane_2_name: "Full Custom", lane_2_tagline: "Go deeper. More research, more polish.",
    rows: [
      ["Turnaround","clock","emphasis","2 to 4 weeks","4 to 8 weeks"],
      ["Design process","pen","text","AI-assisted layouts, refined by hand","Hand-crafted from a blank page, with deeper research"],
      ["Content & copy","document","text","You send the content; AI polishes it, we edit and add SEO","You send the content; we rewrite it by hand, AI assisting, with keyword research"],
      ["Revisions","refresh","emphasis","3 rounds","5 rounds"],
      ["Support after launch","headset","text","Lifetime support. Changes after go-live billed at an hourly rate","Lifetime support. Changes after go-live billed at an hourly rate"],
      ["Best for","trophy","text","Startups, small businesses, quick launches","Established brands, ecommerce and complex sites"],
      ["Custom vs templated","shield","check","Custom-designed. Never templated.","Custom-designed. Never templated."],
    ].map(([label, icon, style, a, b]) => ({ label, icon, style, lane_1_value: a, lane_2_value: b })),
    cta_link: link("/contact", "Get a Free Quote"),
  }),
  slice("stats", {
    title: [h("heading2", "Websites built to rank,\nacross Sri Lanka", ["across Sri Lanka"])],
    subtitle: "Two ways to build. Both custom.", show_google_rating: true,
    stats: [
      ["100%","Custom designs","Every site is designed for you. Never templated.",true],
      ["Mobile-first","On every build","Built to be fast on the phones your customers actually use.",false],
      ["SEO-ready","From day one","Keyword research and a sitemap, so every page has a search term to win.",false],
      ["5+ years","Of experience","From graphic design to UI UX, a decade of designing for real users.",true],
    ].map(([value, label, text, large]) => ({ value, label, text, large })),
  }),
  slice("process", {
    eyebrow: "How it works",
    title: [h("heading2", "From brief to launch\nin five clear steps", ["five clear steps"])],
    steps: [
      ["Discovery","Discovery","A free call to understand your business, your customers and your goals. You'll get a clear plan, timeline and price, with no surprises later.",true],
      ["Research & Planning","Research | & Planning","Keyword research, competitor checks and a sitemap, so every page has a job and a search term to win.",false],
      ["Design","Design","You see the design before anything is built. We refine it together until it feels right.",false],
      ["Build","Build","Your site is built to be fast, mobile-first and SEO-ready, with forms, WhatsApp chat and Google Analytics set up.",false],
      ["Launch & Support","Launch | & Support","We launch, submit your site to Google and show you how to edit it. Support continues after go-live, so you're never left on your own.",false],
    ].map(([title, short_label, description, is_free]) => ({ title, short_label, description, is_free })),
    cta_title: "Start with step one", cta_meta: "Free · 30 min · Online", cta_link: link("/contact", "Book a Free Call"),
  }),
  slice("reasons", {
    title: [h("heading2", "Why clients choose to\nwork with me", ["work with me"])],
    reasons: [
      ["Delivered on time","You get a clear timeline at the start, and we stick to it. No projects dragging on for months."],
      ["Support that sticks around","Questions after launch? You'll get a real answer from a real person, fast."],
      ["Talk directly to the person building it","No account managers or middlemen. Call, email or WhatsApp, in Sinhala or English."],
      ["Built for Google from day one","Every site comes SEO-ready: clean code, fast load times, proper headings and Google Business Profile tips."],
    ].map(([title, text]) => ({ title, text })),
    buttons: [btn("/contact", "Get a Free Quote", "Secondary")],
  }),
  cta("Ready to stop losing customers\nto a better website?", "better website", "Book a free 20-minute call. We'll look at your current site (or your idea), show you what's holding it back, and give you a clear plan. No pressure, no jargon."),
  slice("blog_preview", { title: [h("heading2", "Tips, guides\nand website advice", ["website advice"])], number_of_posts: 3, buttons: [btn("/blog", "Read more", "Secondary")] }),
  slice("faq", {
    eyebrow: "FAQs", title: [h("heading2", "Web design questions, answered", ["answered"])],
    intro: "Can't find what you're looking for? Ask me directly and you'll get a real answer.",
    contact_link: link("https://wa.me/94775037738", "Ask on WhatsApp"),
    faqs: [
      ["How much does a website cost in Sri Lanka?","It depends on the number of pages, features and whether you need ecommerce or booking. A simple business website starts from LKR 80,000, and larger or custom builds are priced after a free call. You always get a fixed quote before work begins, with no hidden costs.","LKR 80,000"],
      ["How long does it take to build a website?","A Fast Track site usually takes 2 to 4 weeks, and a Full Custom build 4 to 8 weeks. You get a clear timeline at the start of the project, and we stick to it.",null],
      ["Will my website show up on Google?","Every site is built SEO-ready from day one: keyword research, a sitemap, clean code, fast load times and proper headings. At launch we submit your site to Google and share tips for your Google Business Profile.",null],
      ["Can I update the website myself?","Yes. When your site goes live we show you how to edit it, so you can update text, images and posts yourself. Support continues after launch if you ever need a hand.",null],
      ["Do you work with businesses outside Colombo?","Yes, I work with businesses across Sri Lanka. Everything can be done online, and you can call, email or WhatsApp me directly, in Sinhala or English.",null],
    ].map(([question, a, bold]) => ({ question, answer: [p(a, bold ? [{ start: a.indexOf(bold), end: a.indexOf(bold) + bold.length, type: "strong" }] : [])] })),
  }),
];
