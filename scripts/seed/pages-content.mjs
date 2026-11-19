// Content for every page except home, as Prismic slices (runtime/API shape).
// Source: the Figma page frames (text copied as designed, including the
// "[ADD: …]" notes Vinod still has to fill in). Used for the local preview and
// to create the Prismic "page" documents.
import { homeSlices } from "./home-content.mjs";

const spans = (text, words, type) =>
  words.map((w) => {
    const s = text.indexOf(w);
    if (s < 0) throw new Error(`"${w}" not in "${text}"`);
    return { start: s, end: s + w.length, type };
  });
const p = (text, bold = []) => ({ type: "paragraph", text, spans: spans(text, bold, "strong") });
const h = (type, text, em = []) => ({ type, text, spans: spans(text, em, "em") });
const h1 = (text, ...em) => [h("heading1", text, em)];
const h2 = (text, ...em) => [h("heading2", text, em)];
const para = (text, ...em) => [h("paragraph", text, em)];
const img = (url, w, hh, alt = "") => ({ url, alt, copyright: null, dimensions: { width: w, height: hh }, id: url, edit: { x: 0, y: 0, zoom: 1, background: "transparent" } });
const link = (url, text, variant) => ({ link_type: "Web", url, text, ...(variant ? { variant } : {}) });
const btn = (url, text, variant = "Primary") => ({ link: link(url, text, variant) });
let n = 0;
const slice = (slice_type, primary, variation = "default") => ({ id: `${slice_type}$p${n++}`, slice_type, slice_label: null, variation, version: "initial", primary, items: [] });

const WHATSAPP = "https://wa.me/94775037738";
const quote = btn("/contact", "Get a Free Quote");
const recentWork = btn("/#work", "See Recent Work", "Secondary");
const freeCall = btn("/contact", "Book a Free Call");
const cta = (title, em, intro, buttons) =>
  slice("call_to_action", { title: h2(title, em), intro: intro ?? null, background_image: {}, buttons });
const faq = (title, em, qa) =>
  slice("faq", {
    eyebrow: "FAQs", title: h2(title, em),
    intro: "Can't find what you're looking for? Ask me directly and you'll get a real answer.",
    contact_link: link(WHATSAPP, "Ask on WhatsApp"),
    faqs: qa.map(([question, answer]) => ({ question, answer: [p(answer)] })),
  });
const cards = (rows) => rows.map(([icon, title, text]) => ({ icon, title, text }));
const ill = (folder, rows, wideLast = 0) =>
  rows.map(([file, title, text], i) => ({
    image: img(`/images/pages/${folder}/${file}.png`, i >= rows.length - wideLast ? 1208 : 775, 392, ""),
    title, text,
  }));
const splitHero = (crumb, title, em, description, buttons, image, badgeTitle, badgeText) =>
  slice("hero", {
    parent_link: link("/services", "Services"), eyebrow: crumb, title: h1(title, em), description, buttons,
    image: img(`/images/pages/photos/${image}.jpg`, 1120, 1040, ""), badge_title: badgeTitle, badge_text: badgeText,
  }, "split");
const darkCards = (eyebrow, title, em, rows) =>
  slice("feature_cards", { eyebrow, title: h2(title, em), intro: null, show_numbers: false, cards: cards(rows) }, "dark");

const homeCompare = homeSlices.find((s) => s.slice_type === "compare");
const compare = (title, em) => ({ ...homeCompare, id: `compare$p${n++}`, primary: { ...homeCompare.primary, title: h2(title, em) } });
const homeTestimonials = homeSlices.find((s) => s.slice_type === "testimonials");

export const pages = {
  /* ------------------------------------------------------------------ About */
  about: {
    title: "About",
    meta_title: "About Vinod Deshapriya, UX Engineer in Sri Lanka",
    meta_description: "Hi, I'm Vinod, a UX engineer in Matara. I design and build fast, mobile-first websites, brands and business systems for Sri Lankan businesses.",
    slices: [
      slice("hero", {
        eyebrow: "About me",
        title: h1("Hi, I'm Vinod.\nA UX Engineer in Sri Lanka.", "UX Engineer"),
        description: "Fast, mobile-first websites, brands and business systems for Sri Lankan businesses. Every site is designed for you, built to rank on Google, and made to turn visitors into enquiries.",
        buttons: [quote, recentWork],
        portrait: img("/images/pages/photos/about-portrait.jpg", 880, 1120, "Vinod Deshapriya"),
        portrait_badge: "Based in Matara, Sri Lanka",
        photo: img("/images/pages/photos/about-working.jpg", 1640, 1120, "A design workspace with wireframes and a UI kit"),
        photo_badge: "Open to freelance projects",
      }, "portrait"),
      slice("story_arc", {
        eyebrow: "My story", title: h2("How I got here", "got here"),
        intro: "From graphic design to UX engineering. Three moments that shaped how I work today.",
        acts: [
          { icon: "pen", label: "Where it started", title: para("Design first, then technology", "then technology"), text: "My design journey started with my very first job, as a graphic designer. Along the way I completed my BSc in IT at the University of Sri Jayewardenepura, and that mix of design and technology led me into UI/UX. I later finished a Tier 1 UX Design course to sharpen my process.", chips: "Graphic designer, BSc in IT, UI/UX, Tier 1 UX course", highlight: false },
          { icon: "eye", label: "What I noticed", title: para("The prettiest websites weren't always the ones that worked.", "weren't always the ones that worked."), text: "People got lost, gave up on forms and left without calling. That's what pulled me into UX. I wanted to understand why people click, hesitate or leave, and then design around it.", chips: null, highlight: true },
          { icon: "layers", label: "What I do now", title: para("A system-led UX engineer", "UX engineer"), text: "I don't just design screens. I think through the whole system behind them, then I build it, so nothing gets lost between the design and the live site.", chips: "User journey, Content, Enquiry flow, Everyday tools", highlight: false },
        ],
        quote: para("I don't just design screens. I think through\nthe whole system behind them.", "the whole system behind them."),
        location: "Based in Matara · working across Sri Lanka and overseas",
      }),
      slice("experience", {
        eyebrow: "Experience", title: h2("Where I've worked", "worked"),
        intro: "I've led UI/UX for digital agencies in Sri Lanka, designing for clients across marketing, ecommerce and software.",
        jobs: [
          ["Aug 2022 – Present", "UI/UX Lead", "AT Digital", "Designing websites and landing pages for performance marketing campaigns, where every screen has to earn its return."],
          ["Aug 2022 – Present", "UI/UX Lead", "Clectiq", "Leading UI/UX for a full-service digital agency covering marketing and software products."],
          ["Aug 2021 – 2022", "UI Designer", "Enspirer", "Designing interfaces for mobile apps, ecommerce and web applications for clients in Sri Lanka and overseas."],
          ["Earlier", "Graphic Designer", "Shadow Art Advertising - Katana, Negombo", "Where it all started."],
        ].map(([dates, role, company, text]) => ({ dates, role, company, text })),
        education_label: "Education",
        education: [
          { icon: "school", title: "BSc in Information Technology", detail: "University of Sri Jayewardenepura" },
          { icon: "pen", title: "Tier 1 UX Design course", detail: "Rasika Mahindasiri" },
        ],
      }),
      slice("feature_cards", {
        eyebrow: "My principles", title: h2("What I believe about good UX", "good UX"), intro: null, show_numbers: true,
        cards: cards([
          ["check", "People first, pixels second", "Every decision starts with who will use the site and what they need to get done."],
          ["check", "Clear beats clever", "If someone has to think twice about where to click, the design needs work, not the user."],
          ["check", "Design and build belong together", "Because I design and build, the live site works the way the design promised."],
          ["check", "Systems, not one-off pages", "I design reusable components and patterns, so your site stays consistent and is easy to grow."],
        ]),
      }, "dark"),
      slice("skills_services", {
        eyebrow: "Services", title: h2("What I do", "do"),
        intro: "One person, the whole journey: from understanding your users to launching a site they enjoy using.",
        skills_label: "Skills",
        skills: "Information architecture, User personas, UX writing, User flows, Design thinking, Journey mapping, A/B testing, Competitive analysis, Interaction design, Design systems, Usability testing, Wireframing, Clickable prototypes",
        services: [
          ["form", "UX research & planning", "User journeys, sitemaps and content structure", "/web-design-sri-lanka"],
          ["layers", "UI design", "Clean, on-brand interfaces in Figma, designed mobile-first", "/web-design-sri-lanka"],
          ["eye", "Prototyping & testing", "Clickable prototypes you can try before anything is built", null],
          ["code", "Website development", "Fast, secure builds that match the design exactly", "/website-development-sri-lanka"],
          ["grid", "Business systems", "Booking systems, portals and tools that save you time", "/custom-software-sri-lanka"],
          ["pen", "Branding", "Logos and visual identities that fit the product", "/logo-design-sri-lanka"],
        ].map(([icon, title, text, url]) => ({ icon, title, text, link: url ? link(url, title) : { link_type: "Any" } })),
      }),
      slice("stats", {
        title: h2("5+ years in numbers", "5+ years"), subtitle: null, show_google_rating: true,
        stats: [
          ["5+", "Years of experience", "Every site is designed for you. Never templated.", true],
          ["50+", "Websites designed and built", "Built to be fast on the phones your customers actually use.", true],
          ["30+", "Clients served", "Keyword research and a sitemap, so every page has a search term to win.", true],
          ["5+ years", "Of experience", "From graphic design to UI UX, a decade of designing for real users.", true],
        ].map(([value, label, text, large]) => ({ value, label, text, large })),
      }),
      { ...homeTestimonials, id: `testimonials$p${n++}` },
      cta("Let's build something\npeople love to use", "people love to use",
        "Got a website that isn't working, or an idea you want to get right from the start? Book a free 20-minute call. I'll listen, ask the right questions and tell you honestly what I'd do.",
        [freeCall, btn(WHATSAPP, "Message Me on WhatsApp", "Secondary")]),
    ],
  },

  /* --------------------------------------------------------------- Services */
  services: {
    title: "Services",
    meta_title: "UX Design Services in Sri Lanka, From Idea to Launch",
    meta_description: "Website design, development, branding, social media design, business systems, AI and website care. One person handles the whole journey, with no handovers.",
    slices: [
      slice("hero", {
        eyebrow: "Services",
        title: h1("UX Design Services in Sri Lanka, From Idea to Launch", "From Idea to Launch"),
        description: "One person handles the whole journey: understanding your users, designing the experience, building it and supporting it after launch. No handovers, no gaps.",
        buttons: [quote, recentWork], highlights: [], showcase_image: {},
        logos_label: "Trusted by growing brands across Sri Lanka",
        logos: homeSlices[0].primary.logos,
      }),
      slice("feature_cards", {
        eyebrow: "What I do", title: h2("What I can help you with", "help you with"), intro: null,
        cards: [
          ["Website Design", "Custom, mobile-first websites planned around how your customers think.", "/web-design-sri-lanka"],
          ["Website Development", "Fast, secure WordPress, Shopify or custom builds that match the design exactly.", "/website-development-sri-lanka"],
          ["Branding & Logo Design", "Logos, colours and fonts that make your business look as good as it is.", "/logo-design-sri-lanka"],
          ["Social Media Design", "Monthly on-brand post and story designs that keep your pages consistent.", "/social-media-marketing-sri-lanka"],
          ["Business Systems", "Booking systems, CRMs and client portals that replace spreadsheets.", "/custom-software-sri-lanka"],
          ["AI for Business", "Chatbots and automations that answer customers and save your team time.", "/ai-solutions-sri-lanka"],
          ["Website Care & Support", "Lifetime support, backups and updates for every site I build.", "/website-care-plans"],
        ].map(([title, text, url]) => ({ title, text, link: link(url, "Learn more") })),
      }, "numbered"),
      darkCards("Why one person", "Why work with one UX engineer instead of five freelancers", "instead of five freelancers", [
        ["document", "One plan.", "Your website, brand and systems are designed together, so they fit."],
        ["code", "No lost details.", "The person who designs your site also builds it."],
        ["chat", "Direct contact.", "You talk to me, not an account manager, in Sinhala or English."],
        ["support", "Lifetime support.", "I don't disappear after launch."],
      ]),
      compare("Pick your speed", "speed"),
      faq("Questions about my services", "my services", [
        ["Can I hire you for just one service?", "Yes. You can start with only a logo, only a website or only a system, and add more later."],
        ["Do you write the website content?", "You send the content. I polish it, structure it for the page and make sure it reads well on mobile."],
        ["Do you offer SEO services?", "Every site I build is SEO-ready: fast, mobile-friendly, with proper headings and page titles. I don't offer ongoing SEO campaigns."],
        ["Where are you based?", "In Sri Lanka. I work with clients across the island and overseas, online by call, WhatsApp and email."],
      ]),
      cta("Not sure which service you need?", "you need?",
        "Book a free 20-minute call. Tell me what you're trying to achieve and I'll suggest the simplest way to get there.", [freeCall]),
    ],
  },

  /* ----------------------------------------------------------- How it works */
  "how-it-works": {
    title: "How it works",
    meta_title: "My Web Design Process: From Brief to Launch in 5 Steps",
    meta_description: "No guesswork and no surprises. See the five steps from a free call to a live website, and what you get at each one. Most sites go live in 4 to 5 weeks.",
    slices: [
      slice("hero", {
        eyebrow: "How it works",
        title: h1("My Web Design Process: From Brief to Launch in 5 Steps", "From Brief to Launch"), title_size: "Medium",
        description: "No guesswork and no surprises. You'll always know what's happening, what's next and when your site goes live.",
        buttons: [btn("/contact", "Start With a Free Call")], highlights: [], showcase_image: {}, logos_label: null, logos: [],
      }),
      slice("steps_showcase", {
        eyebrow: "The process", title: h2("The five steps", "five steps"), intro: "Most business websites go live in 4 to 5 weeks.",
        steps: [
          ["Step 1", "Week 1", "Discovery", "A free call to understand your business, your customers and your goals. You get a clear plan, timeline and fixed price.", "A proposal with scope, timeline and quote."],
          ["Step 2", "Week 1 to 2", "Research & planning", "I look at your users, your competitors and what your visitors need to find. Then I map the user journeys and the sitemap, so every page has a job.", "A sitemap and wireframes to approve."],
          ["Step 3", "Week 2 to 3", "Design", "I design every page in Figma, mobile-first, and share a clickable prototype. We refine it together until it feels right.", "The full design and prototype to review."],
          ["Step 4", "Week 3 to 4", "Build", "I build the site to match the design exactly: fast, secure and SEO-ready, with forms, WhatsApp chat and analytics set up.", "A private preview link to test."],
          ["Step 5", "Week 4 to 5", "Launch & support", "We go live, I submit the site to Google and show you how to edit it. Then you get lifetime support.", "A live website and a short walkthrough."],
        ].map(([label, timing, title, text, outcome], i) => ({ label, timing, title, text, outcome, image: img(`/images/pages/how-it-works/step-${i + 1}.png`, 1352, 844, "") })),
      }),
      compare("Pick your speed. Both fully custom.", "Both fully custom."),
      slice("split_list", {
        eyebrow: "Before we start", title: h2("What I'll need from you", "from you"),
        intro: "Four simple things keep your project on schedule. Don't have them yet? That's fine, we'll sort them out together.",
        buttons: [],
        items: [
          ["pen", "Brand", "Your logo and brand colours (or we create them together)"],
          ["document", "Content", "The text for each page and any photos you want to use"],
          ["chat", "Feedback", "Quick feedback at each review stage, usually within 1 day."],
          ["code", "Access", "Access to your domain and hosting, if you already have them"],
        ].map(([icon, label, text]) => ({ icon, label, text })),
      }, "grid"),
      faq("Process questions", "questions", [
        ["How long does a website take?", "Most business websites go live in 4 to 5 weeks. Fast Track can be sooner. Ecommerce and custom systems take longer."],
        ["How many rounds of changes do I get?", "[ADD: number of revision rounds per stage]"],
        ["How do payments work?", "[ADD: e.g. 50% to start, 50% before launch]"],
        ["What if I'm not happy with the design?", "We refine it together at the wireframe and design stages, before anything is built, so there are no surprises at the end."],
      ]),
      cta("Ready for step one?", "step one?", "Book a free 20-minute call and I'll tell you exactly how your project would run.", [freeCall]),
    ],
  },

  /* ---------------------------------------------------------------- Contact */
  contact: {
    title: "Contact",
    meta_title: "Contact Vinod: Let's Talk About Your Website",
    meta_description: "Tell me about your website or project. Free 20-minute call, no obligation, in Sinhala or English. I reply within one working day.",
    slices: [
      slice("hero", {
        eyebrow: "Contact",
        title: h1("Let's Talk About\nYour Website", "Your Website"),
        description: "Got a new idea, or a site that isn't bringing in enquiries? Tell me about it. I reply within one working day.",
        buttons: [], highlights: [{ text: "Free 20-minute call" }, { text: "No obligation" }, { text: "Sinhala or English" }],
        showcase_image: {}, logos_label: null, logos: [],
      }),
      slice("contact_form", {
        eyebrow: "Free 20-minute call", title: h2("Tell me about your project", "your project"),
        text: [
          p("Tell me what you're trying to achieve and I'll get back to you within one working day. We talk about your goals, and I suggest the simplest way to reach them. No pressure."),
          p("You don't need a full brief. A rough idea is enough, and I'll ask the right questions. Sinhala or English, whichever you prefer."),
          { type: "paragraph", text: "Prefer to talk now? Call (+94) 77 503 7738 or email info@vinod.lk.", spans: [
            { start: 25, end: 41, type: "hyperlink", data: { link_type: "Web", url: "tel:+94775037738" } },
            { start: 51, end: 63, type: "hyperlink", data: { link_type: "Web", url: "mailto:info@vinod.lk" } },
          ] },
        ],
        buttons: [btn("tel:+94775037738", "Book a call", "Secondary"), btn(WHATSAPP, "WhatsApp", "Secondary")],
        services: ["Website Design", "Website Development", "Branding & Logo", "Social Media Design", "Business System", "AI for Business", "Website Support", "Not sure yet"].map((label) => ({ label })),
        budgets: ["Under LKR 80,000", "LKR 80,000 to 150,000", "LKR 150,000 to 300,000", "Over LKR 300,000", "Not sure"].map((label) => ({ label })),
        submit_label: "Send My Project Details",
        privacy_link: link("/privacy-policy", "privacy policy"),
        success_message: "Thanks! Your details are on their way. I'll reply within one working day.",
      }),
      faq("Before you get in touch", "get in touch", [
        ["Is the first call really free?", "Yes. 20 minutes, no obligation."],
        ["Do I need a full brief?", "No. A rough idea is enough. I'll ask the right questions."],
        ["Can we talk in Sinhala?", "Yes, Sinhala or English, whichever you prefer."],
      ]),
    ],
  },

  /* ------------------------------------------------------------------- Blog */
  blog: {
    title: "Blog",
    meta_title: "UX & Web Design Blog",
    meta_description: "Practical, jargon-free advice on UX, UI and planning a website that works. Written for business owners, not designers.",
    slices: [
      slice("blog_index", {
        eyebrow: "Blog", title: h1("UX & Web Design Blog", "Web Design Blog"),
        intro: "Practical, jargon-free advice on UX, UI and planning a website that works. Written for business owners, not designers.",
        list_title: h2("Latest articles", "articles"), posts_per_page: 6,
      }),
      cta("Rather talk it through?", "talk it through?", null, [freeCall]),
    ],
  },

  /* ---------------------------------------------------------- Website Design */
  "web-design-sri-lanka": {
    title: "Website Design",
    meta_title: "Website Design Services in Sri Lanka, Built Around Your Users",
    meta_description: "Custom websites that guide visitors to what they need, so more of them call, book or buy. Designed in Figma, mobile-first, live in 4 to 5 weeks.",
    slices: [
      splitHero("Website Design", "Website Design Services in Sri Lanka, Built Around Your Users", "Built Around Your Users",
        "Most websites look fine but confuse people. I design custom websites that guide visitors to what they need, so more of them call, book or buy.",
        [quote, recentWork], "web-design", "Live in 4 to 5 weeks", "Custom design, never a template"),
      slice("split_list", {
        eyebrow: "Who it's for", title: h2("Is this right for you?", "right for you?"),
        intro: "If one of these sounds like you, a custom website built around your customers will make a real difference.",
        buttons: [quote],
        items: [
          ["rocket", "Starting out", "You're launching a new business and need a professional site fast."],
          ["refresh", "Time for a refresh", "Your current site looks dated, loads slowly or brings in no enquiries."],
          ["phone", "Mobile customers", "You want a site that looks right on phones, where most of your customers are."],
        ].map(([icon, label, text]) => ({ icon, label, text })),
      }),
      darkCards("Why UX-led", "Why a UX-led design\nworks better", "works better", [
        ["eye", "Clearer for visitors.", "People find what they need without hunting for it."],
        ["trend", "More enquiries.", "Calls to action sit where people are ready to act."],
        ["layers", "Built to grow.", "A design system makes new pages quick and consistent."],
      ]),
      slice("image_cards", {
        eyebrow: null, title: h2("What you get", "you get"),
        intro: "Every deliverable is shared in Figma, so you can review and comment at each step.",
        chip: "Shared in Figma at every step",
        cards: ill("web-design", [
          ["ux-planning", "UX planning", "User journeys, a sitemap and a clear goal for every page."],
          ["wireframes", "Wireframes", "Simple page layouts you approve before any visual design."],
          ["ui-design", "UI design in Figma", "Custom, on-brand pages for desktop and mobile."],
          ["prototype", "Clickable prototype", "Try the site before it's built."],
          ["design-system", "Design system", "Reusable buttons, cards and styles, so new pages stay consistent."],
          ["seo-structure", "SEO-ready structure", "Proper headings, page titles and fast-loading images."],
        ]),
      }),
      faq("Website design questions", "questions", [
        ["Do I get to see the design before it's built?", "Yes. You review wireframes and the full design in Figma, and we refine it together before any build starts."],
        ["Will my site work on mobile?", "Yes. Every page is designed mobile-first, then scaled up for tablets and desktops."],
        ["Can you redesign my existing website?", "Yes. I review what works and what doesn't, then redesign it around your users, keeping what's worth keeping."],
        ["Do you use templates?", "No. Every site is custom-designed for your business."],
      ]),
      cta("Ready for a website people enjoy using?", "enjoy using?", null, [quote]),
    ],
  },

  /* ----------------------------------------------------- Website Development */
  "website-development-sri-lanka": {
    title: "Website Development",
    meta_title: "Website Development in Sri Lanka That Matches the Design",
    meta_description: "Business websites, ecommerce stores, booking sites and custom builds on WordPress, WooCommerce, Shopify or custom code. Built by the person who designed them.",
    slices: [
      splitHero("Website Development", "Website Development in Sri Lanka That Matches the Design", "Matches the Design",
        "Great designs often get lost when someone else builds them. I build what I design, so your live site looks and works exactly as planned.",
        [quote, recentWork], "web-development", "Pixel-matched build", "The designer is the developer"),
      slice("image_cards", {
        eyebrow: "What I build", title: h2("Websites I build", "I build"), intro: null,
        cards: [
          ["desktop", "Business websites", "Service pages, enquiry forms and WhatsApp chat.", "bento-business", 1101, 718, false],
          ["cart", "Ecommerce stores", "WooCommerce or Shopify, with payments and delivery options.", "bento-store", 904, 468, false],
          ["calendar", "Booking websites", "For hotels, clinics, tours and services.", "bento-booking", 746, 448, false],
          ["target", "Landing pages", "Single-focus pages for ads and campaigns.", "bento-landing", 486, 446, false],
          ["code", "Custom builds", "When a template platform can't do what you need. [ADD: confirm your stack, e.g. Next.js]", "bento-custom", 660, 360, true],
        ].map(([icon, title, text, file, w, hh, dark]) => ({ icon, title, text, image: img(`/images/pages/web-development/${file}.png`, w, hh, ""), dark })),
      }, "bento"),
      slice("image_cards", {
        eyebrow: null, title: h2("Every build includes", "includes"),
        intro: "These come as standard on every site.", chip: "No hidden extras",
        cards: ill("web-development", [
          ["mobile-first", "Mobile-first", "Responsive layouts that look right on phones, tablets and desktops."],
          ["fast-loading", "Fast loading", "Optimised images, so pages open quickly."],
          ["secure", "Secure by default", "SSL security and spam-protected forms."],
          ["seo-setup", "SEO-ready setup", "Page titles, headings and Google Search Console."],
          ["analytics", "Google Analytics", "Installed, so you can see how people find and use your site."],
          ["editor", "An easy editor", "Plus a short walkthrough, so you can update text, images and prices yourself."],
        ]),
      }),
      slice("split_list", {
        eyebrow: "Platforms", title: h2("The right platform for your business", "for your business"),
        intro: "Pick the one that matches what you need. Not sure? I'll recommend the simplest option on a free call.",
        buttons: [btn("/contact", "Help Me Choose", "Secondary")],
        items: [
          ["Business websites and blogs you want to edit yourself", "WordPress", "W", false],
          ["Online stores on WordPress", "WooCommerce", "Wc", false],
          ["Stores that need simple, reliable selling", "Shopify", "S", false],
          ["Unique features, portals and high-performance sites", "Custom code", "</>", true],
        ].map(([need, platform, monogram, highlight]) => ({ need, platform, monogram, highlight })),
      }, "platforms"),
      faq("Website development questions", "questions", [
        ["Can you build a website from someone else's design?", "[ADD: yes or no, and on what terms]"],
        ["Do you include hosting and a domain?", "[ADD: what you offer for hosting and domains]"],
        ["Will I own my website?", "Yes. Once the project is paid, the website and its content belong to you."],
        ["What happens after launch?", "You get lifetime support. Changes after go-live are charged at an hourly rate."],
      ]),
      cta("Let's build it properly", "properly", null, [quote]),
    ],
  },

  /* -------------------------------------------------- Branding & Logo Design */
  "logo-design-sri-lanka": {
    title: "Branding & Logo Design",
    meta_title: "Logo Design in Sri Lanka That Makes You Look as Good as You Are",
    meta_description: "Clean, memorable logos and brand identities that work on your website, shop sign and Instagram. Logo versions, colours, fonts and a mini brand guide.",
    slices: [
      splitHero("Branding & Logo Design", "Logo Design in Sri Lanka That Makes You Look as Good as You Are", "as Good as You Are",
        "Your logo is often the first thing people judge. I design clean, memorable logos and brand identities that work on your website, your shop sign and your Instagram.",
        [btn("/contact", "Start My Brand"), recentWork], "logo-design", "Logo + mini brand guide", "SVG, PNG and PDF files"),
      darkCards("Why it matters", "Why a proper brand pays off", "pays off", [
        ["shield", "Trust at first glance.", "A consistent look makes a small business feel established."],
        ["trend", "Easier marketing.", "Posts, ads and signs look right without starting from scratch."],
        ["layers", "Works with your website.", "Because I design both, your brand and site fit together."],
      ]),
      slice("image_cards", {
        eyebrow: null, title: h2("What you get", "you get"),
        intro: "Everything you need to use your brand with confidence, on screen and in print.", chip: "You own every file",
        cards: ill("logo-design", [
          ["logo", "Logo design", "[ADD: number] initial concepts, refined into one final logo."],
          ["versions", "Logo versions", "Full logo, icon and one-colour versions."],
          ["palette", "Colour palette", "Main and supporting colours, with codes for print and screen."],
          ["typography", "Typography", "Font pairings for headings and body text."],
          ["brand-guide", "Mini brand guide", "A simple PDF showing how to use it all."],
          ["files", "All files", "SVG, PNG and PDF, ready for print and web."],
        ]),
      }),
      faq("Logo design questions", "questions", [
        ["How long does a logo take?", "[ADD: e.g. 1 to 2 weeks, depending on feedback]"],
        ["Can you refresh my existing logo?", "Yes. I can modernise your current logo while keeping what your customers already recognise."],
        ["Do I own the logo?", "Yes. Once paid, you own the final logo and all files."],
        ["How much does a logo cost?", "[ADD: from price, or \"priced after a free call\"]"],
      ]),
      cta("Ready to look the part?", "the part?", null, [btn("/contact", "Start My Brand")]),
    ],
  },

  /* ----------------------------------------------------- Social Media Design */
  "social-media-marketing-sri-lanka": {
    title: "Social Media Design",
    meta_title: "Social Media Post Design in Sri Lanka That Stops the Scroll",
    meta_description: "On-brand posts, stories and ad creatives designed every month for Facebook, Instagram, Meta ads and TikTok, so your pages always look professional.",
    slices: [
      splitHero("Social Media Design", "Social Media Post Design in Sri Lanka That Stops the Scroll", "Stops the Scroll",
        "Your feed is often the first place people check you out. I design on-brand posts, stories and ad creatives every month, so your pages always look professional.",
        [btn("/contact", "Get a Monthly Plan"), btn("/#work", "See Examples", "Secondary")], "social-media", "Fresh designs every month", "Posts, stories and ad creatives"),
      darkCards("Why it matters", "Why consistent design matters", "matters", [
        ["eye", "Recognised in the feed.", "A steady look helps people spot your posts instantly."],
        ["layers", "Matches your website.", "Posts, site and logo all feel like one brand."],
        ["clock", "Saves you time.", "No more last-minute designs before a promotion."],
      ]),
      slice("image_cards", {
        eyebrow: null, title: h2("What you get each month", "each month"),
        intro: "Sized for Facebook, Instagram, Meta ads and TikTok.", chip: "You own every file",
        cards: ill("social-media", [
          ["feed-posts", "Feed posts", "Feed posts for Facebook and Instagram."],
          ["stories", "Story designs", "10+ story designs."],
          ["ad-creatives", "Ad creatives", "50+ ad creatives in the sizes Meta and TikTok need."],
          ["templates", "Reusable templates", "Templates that match your brand, ready to reuse."],
          ["editable-files", "Editable files", "So your team can make quick changes."],
        ], 2),
      }),
      faq("Social media design questions", "questions", [
        ["Do you post for me or run ads?", "No. I design the posts and ad creatives. You or your marketing team publish them and run the ads."],
        ["Do you write the captions?", "[ADD: yes or no]"],
        ["Is there a minimum term?", "[ADD: e.g. month to month, or a 3-month minimum]"],
        ["How much does it cost?", "[ADD: monthly price, or \"priced after a free call\"]"],
      ]),
      cta("Want your pages to look this good every month?", "every month?", null, [btn("/contact", "Get a Monthly Plan")]),
    ],
  },

  /* -------------------------------------------------------- Business Systems */
  "custom-software-sri-lanka": {
    title: "Business Systems",
    meta_title: "Custom Business Systems in Sri Lanka Your Team Will Actually Use",
    meta_description: "Booking systems, CRMs, client portals and internal tools designed around how your team really works, then built to save you hours each week.",
    slices: [
      splitHero("Business Systems", "Custom Business Systems in Sri Lanka Your Team Will Actually Use", "Will Actually Use",
        "Most business software is built for developers, not the people who use it every day. I design systems around how your team really works, then build them to save you hours each week.",
        [btn("/contact", "Talk About Your System"), btn("/how-it-works", "See How It Works", "Secondary")], "business-systems", "Built in stages", "Start using parts early"),
      slice("feature_cards", {
        eyebrow: "The problem", title: h2("Sound familiar?", "familiar?"), intro: null,
        cards: cards([
          ["alert", null, "Bookings arrive by phone, WhatsApp and email, and some get missed."],
          ["alert", null, "Customer details live in three different spreadsheets."],
          ["alert", null, "Staff spend hours on admin that a system could do in minutes."],
          ["alert", null, "Off-the-shelf software is too complicated, so nobody uses it."],
        ]),
      }),
      darkCards("Why UX-led", "Why UX-led systems work better", "work better", [
        ["smile", "Easy to learn.", "Your team can start using it without long training."],
        ["shield", "Fewer mistakes.", "Clear screens and simple steps cut down on errors."],
        ["target", "Built for you.", "No paying for features you'll never use."],
      ]),
      slice("feature_cards", {
        eyebrow: "What I build", title: h2("Systems I design and build", "design and build"), intro: null,
        cards: cards([
          ["calendar", "Booking systems", "Online bookings, calendars and reminders"],
          ["users", "CRMs", "One place for every customer, enquiry and follow-up"],
          ["key", "Client portals", "Secure logins where clients see orders, files or progress"],
          ["grid", "Internal tools", "Dashboards, forms and workflows for your team"],
          ["database", "Database replacements", "Move from spreadsheets to a proper system"],
        ]),
      }),
      faq("Business system questions", "questions", [
        ["How long does a system take?", "It depends on scope. You'll get a clear timeline after the first call."],
        ["Can it connect to tools I already use?", "[ADD: e.g. Google Sheets, WhatsApp, payment gateways]"],
        ["Who owns the system?", "[ADD: ownership terms]"],
        ["How much does a custom system cost?", "Every system is different, so it's priced after a free call, with a fixed quote before work begins."],
      ]),
      cta("Ready to stop fighting your spreadsheets?", "your spreadsheets?", null, [btn("/contact", "Talk About Your System")]),
    ],
  },

  /* --------------------------------------------------------- AI for Business */
  "ai-solutions-sri-lanka": {
    title: "AI for Business",
    meta_title: "AI Solutions for Business in Sri Lanka, Without the Hype",
    meta_description: "Website chatbots, WhatsApp assistants, smart forms and workflow automation that answer customers and take repetitive work off your team.",
    slices: [
      splitHero("AI for Business", "AI Solutions for Business in Sri Lanka, Without the Hype", "Without the Hype",
        "AI can answer customer questions at midnight and take repetitive work off your team. I design AI tools that are simple, useful and feel natural to your customers.",
        [btn("/contact", "Explore AI for My Business"), btn("/how-it-works", "See How It Works", "Secondary")], "ai", "Start with one quick win", "Honest, on-brand, useful"),
      slice("feature_cards", {
        eyebrow: "What I set up", title: h2("AI tools I can set up for you", "set up for you"), intro: null,
        cards: cards([
          ["chat", "Website chatbots", "Answer common questions and capture enquiries 24/7"],
          ["sparkles", "WhatsApp assistants", "Reply to FAQs and pass real leads to your team"],
          ["form", "Smart forms", "Forms that sort, tag and route enquiries automatically"],
          ["flow", "Workflow automation", "Connect your tools so data moves without copy-and-paste"],
          ["pen", "Content helpers", "AI-assisted drafts for product descriptions and replies"],
        ]),
      }),
      darkCards("My approach", "Good AI feels like\ngood service", "good service", [
        ["eye", "Clear and honest.", "Customers know they're chatting with a bot, and can reach a person easily."],
        ["heart", "On-brand.", "The tone matches how your business talks."],
        ["target", "Actually useful.", "It's built around the questions your customers really ask."],
      ]),
      faq("AI questions", "questions", [
        ["Will AI replace my staff?", "No. It handles repetitive questions and admin, so your team can focus on customers who need a person."],
        ["Can the chatbot speak Sinhala?", "[ADD: confirm which languages you support]"],
        ["Is my customer data safe?", "[ADD: how you handle data and which AI providers you use]"],
        ["How much does it cost?", "It depends on what you need. Small automations can be quick wins. You'll get a fixed quote after a free call."],
      ]),
      cta("Curious what AI could do for your business?", "your business?", null, [btn("/contact", "Explore AI for My Business")]),
    ],
  },

  /* -------------------------------------------------- Website Care & Support */
  "website-care-plans": {
    title: "Website Care & Support",
    meta_title: "Website Maintenance in Sri Lanka, With Lifetime Support",
    meta_description: "Backups, updates, security and speed checks, and quick fixes, with lifetime support for every site I build. Changes after go-live are billed hourly.",
    slices: [
      splitHero("Website Care & Support", "Website Maintenance in Sri Lanka, With Lifetime Support", "With Lifetime Support",
        "A website isn't finished at launch. I keep yours fast, safe and up to date, and I'm here whenever you need help, for as long as you have the site.",
        [btn("/contact", "Ask About Support")], "website-care", "Support for life", "For every site I build"),
      slice("feature_cards", {
        eyebrow: "How it works", title: h2("Lifetime support, simple pricing", "simple pricing"), intro: null,
        cards: cards([
          ["support", "Lifetime support", "Every site I build comes with support for life. Ask questions any time."],
          ["clock", "Changes after go-live", "New pages, features or content updates are charged at an hourly rate of [ADD: LKR rate per hour]."],
          ["tag", "No surprises", "You'll know the estimated hours before any work starts."],
        ]),
      }),
      slice("image_cards", {
        eyebrow: null, title: h2("What I look after", "look after"),
        intro: "Keeping your site fast, safe and working, so you don't have to think about it.", chip: "For as long as you have the site",
        cards: ill("website-care", [
          ["backups", "Regular backups", "Your site and its content, backed up so nothing gets lost."],
          ["updates", "Updates", "Software, theme and plugin updates."],
          ["security", "Security", "Security checks and fixes."],
          ["uptime", "Uptime & speed", "Uptime and speed checks."],
          ["quick-fixes", "Quick fixes", "Small fixes when something breaks."],
        ], 2),
      }),
      faq("Support questions", "questions", [
        ["What does lifetime support mean?", "You can contact me any time about your website, for as long as you have it. Questions and advice are covered. Changes are billed hourly."],
        ["How fast do you respond?", "[ADD: e.g. within one working day]"],
        ["Can I make small changes myself?", "Yes. Every site comes with an easy editor and a short walkthrough."],
        ["What if my site goes down?", "[ADD: what you do in an emergency]"],
      ]),
      cta("Want peace of mind for your website?", "peace of mind", null, [btn("/contact", "Ask About Support")]),
    ],
  },
};
