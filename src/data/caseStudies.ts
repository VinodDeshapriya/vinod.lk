/**
 * Case studies for /work/[slug] (layout modelled on awmedia.marketing/work/renewafuel).
 * Local content for review; this will move to a Prismic "case_study" type once approved.
 * Copy comes from the case-study docs in the Vinod.lk project. Anything those docs
 * still mark [ADD] (timelines, results, testimonials) is left out until it's known.
 */
export type Shot = { src: string; alt: string; width: number; height: number };

export type CaseStudy = {
  slug: string;
  name: string;
  /** Short line for cards. */
  summary: string;
  category: string;
  status: "Live" | "Design complete";
  meta: { title: string; description: string; ogTitle: string; ogDescription: string; keywords: string[] };
  hero: { eyebrow: string; title: string; intro: string };
  tags: string[];
  liveUrl?: string;
  facts: { label: string; value: string; href?: string }[];
  about: { title: string; paragraphs: string[] };
  challenge: { intro: string; items: { title: string; text: string }[] };
  approach: { intro: string; steps: { title: string; text: string }[] };
  highlights: { intro: string; items: { title: string; text: string; shot: Shot; caption: string }[] };
  /** Desktop shots stacked into one long page for the "The work" viewer. */
  desktopShots: Shot[];
  mobileShots: Shot[];
  delivered: string[];
  numbers: { value: string; label: string }[];
  thumb: string;
  cta: { title: string; text: string };
};

const s = (slug: string, file: string, alt: string, width: number, height: number): Shot => ({
  src: `/images/work/${slug}/${file}.webp`,
  alt,
  width,
  height,
});

export const caseStudies: CaseStudy[] = [
  {
    slug: "absoliq",
    name: "Absoliq",
    summary: "A conversion-led website for a system-led marketing consultancy, built on Next.js and Prismic.",
    category: "Websites",
    status: "Live",
    meta: {
      title: "Absoliq Case Study: Marketing Consultancy Website",
      description:
        "How we designed and built Absoliq's Next.js and Prismic website: a conversion-led site for a Sri Lankan growth consultancy. Read the case study.",
      ogTitle: "Absoliq: a website built like a growth system",
      ogDescription: "Positioning-led UX, bold UI and a Next.js + Prismic build for a senior-expert marketing consultancy.",
      keywords: ["Absoliq website case study", "marketing consultancy website design", "Next.js Prismic website"],
    },
    hero: {
      eyebrow: "Case study · Website design & development",
      title: "Absoliq website case study: a site built like a growth system",
      intro:
        "Absoliq fixes broken marketing systems for growing businesses. We designed and built a website that argues the case as clearly as their senior experts do, then moves visitors straight to a free diagnostic “Roast”.",
    },
    tags: ["Next.js", "Prismic CMS", "UX/UI Design", "Conversion", "B2B", "Google Tag Manager"],
    liveUrl: "https://absoliq.com",
    facts: [
      { label: "Client", value: "Absoliq Private Limited" },
      { label: "Industry", value: "Marketing consultancy" },
      { label: "Market", value: "Sri Lanka & international B2B" },
      { label: "Stack", value: "Next.js, Prismic, GTM" },
      { label: "Website", value: "absoliq.com", href: "https://absoliq.com" },
    ],
    about: {
      title: "About Absoliq",
      paragraphs: [
        "Absoliq is a consulting-first marketing company that fixes broken performance marketing systems. It works with founders, CEOs and marketing leads at revenue-generating businesses whose ad spend has stopped producing consistent results.",
        "Their offer is built on the ABS Growth Model: Attract OS (positioning, messaging, channels), Build OS (tracking, funnels, landing pages, campaign structure) and Scale OS (conversion systems and scale frameworks). Delivery is senior experts only, with no juniors and no retainer lock-in. Clients include Rush Lanka, Olanka Travels and Rocell.",
      ],
    },
    challenge: {
      intro:
        "Absoliq needed a website that made one hard idea land fast: your problem is not marketing, it is your marketing system. It had to stand apart in a market where most competitors sell the same services.",
      items: [
        { title: "Explain a new category", text: "Visitors expect an agency. The site had to show a consultancy with its own framework, the ABS Growth Model." },
        { title: "Earn trust quickly", text: "Senior decision-makers needed proof early: client logos, hard results and named testimonials." },
        { title: "Drive one action", text: "Every section had to lead to booking a free Roast or contacting an expert." },
        { title: "Stay easy to update", text: "The team needed to add results, blog posts and team members without a developer." },
      ],
    },
    approach: {
      intro: "We treated the homepage as a sales conversation: name the pain, reframe it, show the system, prove it, then ask for the Roast.",
      steps: [
        { title: "Problem-first storytelling", text: "The page opens by speaking to the founder, the marketing lead and the product owner, then lists the symptoms they feel: unstable results, flat returns, weak conversions." },
        { title: "A framework you can see", text: "The ABS Growth Model became the visual centre of the site, with Attract, Build and Scale shown as three clear operating systems." },
        { title: "Proof placed early", text: "Client logos sit under the hero, and a results section shows named brands with real metrics." },
        { title: "Contrast that sells", text: "A side-by-side “Traditional agencies vs Absoliq” table makes the difference obvious in seconds." },
        { title: "One repeated action", text: "“Book a Roast” and “Nudge an Expert” appear in the header, hero, mid-page and footer." },
        { title: "A CMS the team owns", text: "Built on Next.js with Prismic, so Absoliq edits results, blogs, team and FAQs as content slices, without code." },
      ],
    },
    highlights: {
      intro:
        "The UI pairs a bold grotesque headline with an italic serif accent, on a warm, textured off-white with a single electric-blue action colour. Confident and senior, not a template agency site.",
      items: [
        { title: "A hero that says it all in one screen", text: "Headline, value proposition and “Book a Roast” sit above the fold, with client logos directly underneath for instant trust.", shot: s("absoliq", "hero", "Absoliq homepage hero on desktop", 800, 500), caption: "Absoliq homepage hero on desktop." },
        { title: "The ABS Growth Model, made visual", text: "Three tiles, A, B and S, so visitors grasp the whole offer in a few seconds.", shot: s("absoliq", "growth-model", "The ABS Growth Model section", 800, 500), caption: "The ABS (not a BS) Growth Model section." },
        { title: "Proof with real numbers", text: "Result cards pair each client's logo with two hard metrics and service tags. The team adds new cards in Prismic.", shot: s("absoliq", "results", "Client results cards", 800, 500), caption: "Client results cards for Rush Lanka, Olanka Travels and Rocell." },
        { title: "A comparison that does the selling", text: "A two-column layout sets traditional agency habits against the Absoliq way, point by point.", shot: s("absoliq", "comparison", "Traditional agencies vs Absoliq comparison", 800, 500), caption: "Traditional agencies vs Absoliq comparison section." },
      ],
    },
    desktopShots: [
      s("absoliq", "hero", "Absoliq homepage hero", 800, 500),
      s("absoliq", "growth-model", "ABS Growth Model section", 800, 500),
      s("absoliq", "results", "Client results section", 800, 500),
      s("absoliq", "comparison", "Comparison section", 800, 500),
    ],
    mobileShots: [
      s("absoliq", "mobile", "Absoliq homepage on mobile", 375, 812),
      s("absoliq", "mobile-2", "Absoliq testimonials on mobile", 375, 812),
    ],
    delivered: [
      "Positioning-led homepage story",
      "ABS Growth Model section",
      "Client results cards with hard metrics",
      "Traditional agencies vs Absoliq comparison",
      "“Book a Roast” on every key screen",
      "9 pages: Home, Solutions, About, Team, Get Roasted, Contact, Blogs, Newsletter, legal",
      "Prismic slices for results, blogs, team and FAQs",
      "Google Tag Manager tracking",
      "Mobile-first layouts with a swipeable testimonial slider",
    ],
    numbers: [
      { value: "9", label: "pages designed and built" },
      { value: "3", label: "operating systems made visual: Attract, Build, Scale" },
      { value: "1", label: "repeated action: Book a Roast" },
    ],
    thumb: "/images/home/projects/absoliq.webp",
    cta: { title: "Need a website that sells your expertise?", text: "We design and build fast, conversion-led websites for consultancies, agencies and B2B brands, with a CMS your team can run." },
  },
  {
    slug: "matara-bodhiya",
    name: "Matara Bodhiya",
    summary: "A Sinhala-first website for one of Sri Lanka's oldest Bodhi trees, with events and LankaQR donations.",
    category: "Websites",
    status: "Live",
    meta: {
      title: "Sinhala Website Design Case Study: Matara Bodhiya",
      description:
        "Sinhala website design case study: a Unicode-first site for the historic Matara Bodhiya, with LankaQR donations, an events calendar and news.",
      ogTitle: "Matara Bodhiya: a Sinhala-first website for a historic temple",
      ogDescription: "A full redesign for the Matara Bodhi Protection Society: services, events, news and LankaQR donations.",
      keywords: ["Sinhala website design", "temple website design Sri Lanka", "charity donation website Sri Lanka"],
    },
    hero: {
      eyebrow: "Case study · Website redesign",
      title: "Sinhala website design for the historic Matara Bodhiya",
      intro:
        "The Matara Bodhi Protection Society cares for one of Sri Lanka's oldest Bodhi trees and runs religious, social and educational services. We redesigned its website in Sinhala Unicode, with an events calendar, news and one-scan LankaQR donations.",
    },
    tags: ["Sinhala Unicode", "UX/UI Design", "Non-profit", "LankaQR donations", "Events calendar", "Mobile-first"],
    liveUrl: "https://matarabodhiya.org/",
    facts: [
      { label: "Client", value: "Matara Bodhi Protection Society" },
      { label: "Sector", value: "Religious & community non-profit" },
      { label: "Market", value: "Sinhala-speaking devotees & donors" },
      { label: "Scope", value: "15+ templates × 3 breakpoints" },
      { label: "Website", value: "matarabodhiya.org", href: "https://matarabodhiya.org/" },
    ],
    about: {
      title: "About Matara Bodhiya",
      paragraphs: [
        "The historic Matara Bodhiya stands in the centre of Matara, on Sri Lanka's south coast. The site describes its history as reaching back to about 515 CE.",
        "The Matara Bodhi Protection Society looks after the Bodhiya. Funded by public donations, it runs religious, social and educational services, from Poya day sil programmes to Dhamma classes for young people. It is currently raising funds for the “Apeksha Piyasa – Matara” cancer ward at the new Matara hospital.",
      ],
    },
    challenge: {
      intro:
        "The society's audience reads Sinhala first and visits on their phones. The website needed to feel sacred and dignified, yet be as easy to use as a modern app.",
      items: [
        { title: "Sinhala, done properly", text: "Every page, heading and button had to work in Sinhala Unicode, with type that stays readable at every size." },
        { title: "Make giving effortless", text: "Donors needed a fast, trusted way to give, without bank slips or branch visits." },
        { title: "Show what's happening", text: "Devotees wanted to see upcoming Poya programmes, Dhamma classes and events at a glance." },
        { title: "Tell the story", text: "The Bodhiya's history, the society's services and its team needed a proper home." },
      ],
    },
    approach: {
      intro: "We designed a Sinhala-first site where every section leads to one of two actions: take part, or give.",
      steps: [
        { title: "A reverent first impression", text: "The hero shows the illuminated stupa and the Bodhiya at night, with the Dharma wheel and a short Pali-inspired verse." },
        { title: "Services in three clear doors", text: "Religious, social and educational services each get a card on the homepage and their own page." },
        { title: "Events two ways", text: "A card carousel shows the next programmes with date, time and a short summary. A full month calendar lists every event, with share links for Facebook, X and WhatsApp." },
        { title: "One-scan donations", text: "A donation block with a LankaQR code lets anyone give from any Sri Lankan banking app, paid straight into the society's NSB account." },
        { title: "Special donation drives", text: "A filterable page lists active causes, such as the Apeksha Piyasa cancer ward." },
        { title: "News, gallery and story", text: "News articles, an image gallery and About pages for history, team and contact build trust over time." },
        { title: "Designed at three sizes", text: "Every template was laid out at 1440px, 768px and 375px, so phones get a purpose-built layout, not a squeezed desktop." },
      ],
    },
    highlights: {
      intro:
        "The palette takes its cues from Buddhist tradition: saffron orange, deep maroon, Bodhi-leaf green and warm gold buttons. Bold Sinhala display type sits over soft cream backgrounds, so the script stays crisp and easy to read.",
      items: [
        { title: "A sacred first screen", text: "The illuminated stupa and Buddhist flags frame the Dharma wheel and the site title, “Historic Matara Bodhiya”.", shot: s("matara-bodhiya", "hero", "Matara Bodhiya homepage hero", 1200, 574), caption: "Matara Bodhiya homepage hero (desktop)." },
        { title: "Services in three clear doors", text: "Icon cards for religious, social and educational services, with phone and WhatsApp numbers and a “Contact us” button right below.", shot: s("matara-bodhiya", "services", "Services section", 1200, 692), caption: "The services section." },
        { title: "Upcoming events at a glance", text: "Event cards lead with a bold date badge, then the title, time and a “Read more” link.", shot: s("matara-bodhiya", "events", "Upcoming events carousel", 1200, 953), caption: "The upcoming events carousel." },
        { title: "A full events calendar", text: "A month view lists every programme by day, colour-coded by type, with share links on each event.", shot: s("matara-bodhiya", "calendar", "Events calendar page", 682, 760), caption: "The events calendar page." },
      ],
    },
    desktopShots: [
      s("matara-bodhiya", "hero", "Matara Bodhiya homepage hero", 1200, 574),
      s("matara-bodhiya", "services", "Services section", 1200, 692),
      s("matara-bodhiya", "events", "Upcoming events", 1200, 953),
    ],
    mobileShots: [
      s("matara-bodhiya", "mobile", "Matara Bodhiya hero on mobile", 375, 688),
      s("matara-bodhiya", "mobile-2", "LankaQR donation section on mobile", 375, 877),
    ],
    delivered: [
      "Full redesign in Sinhala Unicode",
      "Religious, social and educational service pages",
      "Upcoming events carousel and event detail pages",
      "Month calendar with share links",
      "LankaQR donation block for every Sri Lankan banking app",
      "Special donation drives page",
      "News list, articles and image gallery",
      "About pages: history, team and contact",
      "Every template at 1440, 768 and 375px",
    ],
    numbers: [
      { value: "15+", label: "page templates designed" },
      { value: "3", label: "breakpoints for every template" },
      { value: "1", label: "scan to give, from any banking app" },
    ],
    thumb: "/images/home/projects/matara-bodhiya.webp",
    cta: { title: "Need a website in Sinhala?", text: "We design and build Sinhala-first websites for temples, charities and local organisations, with online donations, events and news your team can update." },
  },
  {
    slug: "enjoy-sri-lanka",
    name: "Enjoy Sri Lanka",
    summary: "A bilingual tour company website with curated packages and a trip builder that qualifies every enquiry.",
    category: "Websites",
    status: "Live",
    meta: {
      title: "Enjoy Sri Lanka Case Study: Tour Company Website",
      description:
        "Enjoy Sri Lanka website case study: a bilingual Next.js site for a tailor-made tour company, with package pages and a trip-builder enquiry flow.",
      ogTitle: "Enjoy Sri Lanka: a tour website that plans the trip with you",
      ogDescription: "A bilingual, enquiry-led website for a tailor-made Sri Lanka tour company, built on Next.js.",
      keywords: ["tour company website design Sri Lanka", "travel website design Sri Lanka", "Enjoy Sri Lanka website case study"],
    },
    hero: {
      eyebrow: "Case study · Tourism website design & development",
      title: "Enjoy Sri Lanka: a tour company website design that plans the trip with you",
      intro:
        "Enjoy Sri Lanka crafts private, tailor-made tours across the island. We designed and built a bilingual website that turns browsing into enquiries, with curated packages and a trip builder that asks the right questions.",
    },
    tags: ["Next.js", "Netlify", "English & Spanish", "Tourism", "Trip builder", "UX/UI Design"],
    liveUrl: "https://enjoy-sri-lanka.netlify.app/",
    facts: [
      { label: "Client", value: "Enjoy Sri Lanka" },
      { label: "Industry", value: "Private & tailor-made tours" },
      { label: "Market", value: "English & Spanish-speaking travellers" },
      { label: "Stack", value: "Next.js on Netlify" },
      { label: "Website", value: "enjoy-sri-lanka.netlify.app", href: "https://enjoy-sri-lanka.netlify.app/" },
    ],
    about: {
      title: "About Enjoy Sri Lanka",
      paragraphs: [
        "Enjoy Sri Lanka is a Nugegoda-based tour company that designs private, tailor-made journeys around the island. Its Travel Designers build each trip around the guest's interests, from wildlife safaris and tea country to honeymoons and Colombo city tours.",
        "The company leads on honest pricing, local expert guides, comfortable vehicles with experienced drivers, and travel insurance for every guest.",
      ],
    },
    challenge: {
      intro:
        "Tailor-made travel is hard to sell online. Guests can't add a trip to a cart; they need to trust the company, picture the island and start a conversation.",
      items: [
        { title: "Sell a feeling, not a list", text: "The site had to show Sri Lanka's beaches, highlands and wildlife in a premium, unhurried way." },
        { title: "Serve two kinds of traveller", text: "Some want a ready-made package; others want a trip built from scratch. Both paths had to be clear from the first screen." },
        { title: "Reach Spanish-speaking travellers", text: "The company needed the full site in English and Spanish." },
        { title: "Make enquiring easy", text: "Every page had to lead to an enquiry, by form, WhatsApp, phone or email." },
      ],
    },
    approach: {
      intro: "We built the site around two doors, “Curated packages” and “Customise your journey”, and made sure every scroll ends at an enquiry.",
      steps: [
        { title: "Two paths from the hero", text: "The first screen offers both a ready-made package and a custom trip, so each visitor picks their route straight away." },
        { title: "A trip builder, not a long form", text: "“Customise your journey” opens a short planner: budget per person on a slider, tour style and trip length. Sales gets a qualified brief, not a vague message." },
        { title: "Package cards that answer the first questions", text: "Each card shows duration, group size and a short pitch before the visitor clicks through." },
        { title: "Trust built in", text: "A “What makes us different” grid covers tailor-made planning, local experts, honest pricing, safety and insurance, followed by guest reviews." },
        { title: "Bilingual from day one", text: "An EN / ES switch sits in the header, with Spanish pages under /es." },
        { title: "Every contact route visible", text: "WhatsApp, phone, email and the office address appear in the header, the enquiry section and the footer." },
      ],
    },
    highlights: {
      intro:
        "The UI pairs an elegant italic serif with clean sans-serif body text, full-bleed island imagery and a deep ocean-blue accent. It feels like a boutique travel brand, calm and premium.",
      items: [
        { title: "A cinematic first screen", text: "An aerial shot of Sigiriya fills the hero, with the headline and two clear buttons: Curated Packages and Customise Your Journey.", shot: s("enjoy-sri-lanka", "hero", "Enjoy Sri Lanka homepage hero", 800, 500), caption: "Enjoy Sri Lanka homepage hero on desktop." },
        { title: "Trust, at a glance", text: "Six icon cards answer what every traveller asks before booking: who plans it, who guides it, what it costs, and how safe it is.", shot: s("enjoy-sri-lanka", "why-us", "What makes us different section", 800, 500), caption: "The “What makes us different” section." },
        { title: "Packages that sell themselves", text: "A carousel of package cards shows the photo, duration and group size up front, with a clear Explore Package button.", shot: s("enjoy-sri-lanka", "packages", "Most popular tour packages carousel", 800, 500), caption: "Most popular tour packages carousel." },
        { title: "The trip builder", text: "A slide-out panel, always one tap away, lets travellers set a budget, pick tour styles and choose trip length before they enquire.", shot: s("enjoy-sri-lanka", "trip-builder", "Customise Your Journey trip builder", 800, 500), caption: "The Customise Your Journey trip builder." },
      ],
    },
    desktopShots: [
      s("enjoy-sri-lanka", "hero", "Enjoy Sri Lanka homepage hero", 800, 500),
      s("enjoy-sri-lanka", "why-us", "What makes us different", 800, 500),
      s("enjoy-sri-lanka", "packages", "Tour packages", 800, 500),
      s("enjoy-sri-lanka", "trip-builder", "Trip builder", 800, 500),
    ],
    mobileShots: [s("enjoy-sri-lanka", "mobile", "The Spanish homepage on mobile", 375, 812)],
    delivered: [
      "Two-path hero: packages or a custom trip",
      "Trip builder with budget, tour style and trip length",
      "Package cards and a package detail template",
      "Tailor-Made Tours, Day Tours and Things To Do pages",
      "“What makes us different” trust grid and guest reviews",
      "Full English and Spanish versions",
      "WhatsApp, phone and email on every page",
      "Sticky trip-builder bar on mobile",
    ],
    numbers: [
      { value: "2", label: "languages, English and Spanish" },
      { value: "2", label: "clear paths to an enquiry" },
      { value: "9", label: "page types in each language" },
    ],
    thumb: "/images/home/projects/enjoy-sri-lanka.webp",
    cta: { title: "Run a tour or travel business?", text: "We design and build fast, bilingual travel websites that turn browsers into enquiries, with package pages your team can update." },
  },
  {
    slug: "janangana",
    name: "Janangana",
    summary: "A bold, structured website for a Kandy engineering consultancy selling local design and global AEC outsourcing.",
    category: "Websites",
    status: "Design complete",
    meta: {
      title: "Engineering Consultancy Website Design: Janangana",
      description:
        "Engineering consultancy website design case study: a responsive site for Janangana, a Kandy firm offering design, outsourcing and staff augmentation.",
      ogTitle: "Janangana: a website for an engineering firm with global ambitions",
      ogDescription: "Bold, structured web design for a Kandy consultancy selling local design services and global AEC outsourcing.",
      keywords: ["engineering consultancy website design", "architecture firm website design", "AEC website design"],
    },
    hero: {
      eyebrow: "Case study · Website design",
      title: "Engineering consultancy website design for Janangana",
      intro:
        "Janangana is a Kandy-based engineering and architecture consultancy that also serves overseas firms as their outsourced “engine room”. We designed a bold, structured website that sells both: local design services and global CAD, BIM and staff augmentation.",
    },
    tags: ["UX/UI Design", "Information architecture", "Design system", "AEC", "B2B", "Responsive"],
    facts: [
      { label: "Client", value: "Janangana (Pvt) Ltd" },
      { label: "Industry", value: "Engineering & architecture (AEC)" },
      { label: "Market", value: "Sri Lanka & overseas firms" },
      { label: "Scope", value: "7 templates × 3 breakpoints" },
      { label: "Status", value: "Design complete, launching soon" },
    ],
    about: {
      title: "About Janangana",
      paragraphs: [
        "Janangana (Pvt) Ltd is an engineering and architectural consultancy based in Kandy, Sri Lanka, providing end-to-end building and interior design.",
        "For local projects it offers engineering and structural design, architectural and landscape design, MEP engineering, quantity surveying, cost consultancy and project management. For overseas firms it provides high-volume CAD drafting, BIM and 3D modelling, BOQ and contract documents, and staff augmentation.",
      ],
    },
    challenge: {
      intro:
        "Janangana sells to two very different buyers: a local developer looking for a structural engineer, and an overseas architecture firm looking for reliable CAD and BIM capacity. One website had to speak to both without confusing either.",
      items: [
        { title: "Look world-class", text: "Overseas firms judge an outsourcing partner by its website first. It had to feel as polished as the Tier-1 architects it wants to serve." },
        { title: "Separate the offers", text: "Consultancy, outsourcing and staff augmentation each needed a clear home and a clear path." },
        { title: "Explain staff augmentation simply", text: "Hiring remote engineers feels risky, so the process had to look easy and controlled." },
        { title: "Support hiring", text: "As the firm grows, the site also had to attract engineers through a careers page." },
      ],
    },
    approach: {
      intro: "We gave each side of the business its own page and its own story, then tied them together with one design language and a single action: “Talk to an expert”.",
      steps: [
        { title: "A statement hero", text: "Full-bleed project photography with one big line: “We are engineering a more sustainable world.”" },
        { title: "Clear service tiles", text: "The homepage lists the core consultancy services as bold, clickable tiles, each leading to detail on the Services page." },
        { title: "Outsourcing as “The Global Engine Room”", text: "A dedicated page and homepage section pitch CAD drafting, BIM and 3D modelling to Tier-1 architects, with image-led cards." },
        { title: "Staff augmentation in three steps", text: "Define your needs, match and select, seamless integration. Three cards make a complex service feel simple and low-risk." },
        { title: "Proof and trust", text: "Client logos, testimonials, a projects grid and a team page back up every claim." },
        { title: "Built for hiring too", text: "A careers page with open roles helps the firm grow its engineering team." },
        { title: "Three breakpoints, one system", text: "All 7 templates were designed at 1440px, 768px and 375px from shared components, so the build stays consistent." },
      ],
    },
    highlights: {
      intro:
        "The visual language borrows from construction itself: charcoal blocks, crisp white space and a hazard-yellow accent taken from the logo. A clean geometric sans-serif keeps it modern and international.",
      items: [
        { title: "A statement hero", text: "Aerial project photography fills the screen, with a floating navigation bar and a “Talk to an expert” button always in reach.", shot: s("janangana", "hero", "Janangana homepage hero", 1200, 782), caption: "Janangana homepage hero (desktop)." },
        { title: "Services as bold tiles", text: "Charcoal tiles list the consultancy services, so visitors find their need in seconds.", shot: s("janangana", "services", "Engineering and architecture services section", 1200, 667), caption: "The consultancy services section." },
        { title: "The global engine room", text: "The outsourcing section pairs dark text panels with technical imagery: CAD drawings and BIM steel-frame models.", shot: s("janangana", "outsourcing", "Outsourcing section", 1207, 960), caption: "The outsourcing section for international firms." },
        { title: "Staff augmentation in three steps", text: "Three step cards, each finished with a yellow edge, turn a complex hiring service into a simple process.", shot: s("janangana", "staff-augmentation", "Staff augmentation section", 1200, 744), caption: "The staff augmentation section." },
      ],
    },
    desktopShots: [
      s("janangana", "hero", "Janangana homepage hero", 1200, 782),
      s("janangana", "services", "Services", 1200, 667),
      s("janangana", "outsourcing", "Outsourcing", 1207, 960),
      s("janangana", "staff-augmentation", "Staff augmentation", 1200, 744),
    ],
    mobileShots: [s("janangana", "mobile", "Janangana homepage hero on mobile", 375, 810)],
    delivered: [
      "Information architecture for two audiences",
      "Home, About, Services, Outsourcing, Careers, Projects and Contact",
      "“Global Engine Room” outsourcing story",
      "Three-step staff augmentation explainer",
      "Client logos, testimonials and team page",
      "Careers page with open roles",
      "Shared component system",
      "Every template at 1440, 768 and 375px",
    ],
    numbers: [
      { value: "7", label: "page templates" },
      { value: "3", label: "breakpoints each" },
      { value: "21", label: "responsive layouts delivered" },
    ],
    thumb: "/images/home/projects/janangana.webp",
    cta: { title: "Run an engineering or architecture firm?", text: "We design websites that make technical firms look as good as their work, for local clients and global partners." },
  },
  {
    slug: "somerset-mirissa-blue",
    name: "Somerset Mirissa Blue",
    summary: "A direct-booking website for a hilltop boutique hotel above Mirissa beach, built on Next.js.",
    category: "Websites",
    status: "Live",
    meta: {
      title: "Hotel Website Design Case Study: Somerset Blue",
      description:
        "Hotel website design case study: how we built a direct-booking Next.js site for Somerset Mirissa Blue, a hilltop boutique hotel in Mirissa, Sri Lanka.",
      ogTitle: "Somerset Mirissa Blue: a hotel website built for direct bookings",
      ogDescription: "Room pages, a booking bar in the hero and web-only offers for a hilltop boutique hotel in Mirissa.",
      keywords: ["hotel website design case study", "boutique hotel website design Sri Lanka", "direct booking hotel website"],
    },
    hero: {
      eyebrow: "Case study · Hotel website design & development",
      title: "Hotel website design case study: Somerset Mirissa Blue",
      intro:
        "Somerset Mirissa Blue is a hilltop boutique hotel facing Mirissa beach. We designed and built a website that shows off the view and gets guests to book direct, with dates and guests picked right in the first screen.",
    },
    tags: ["Next.js", "SwiftBook", "Hospitality", "Direct booking", "UX/UI Design", "Mobile-first"],
    liveUrl: "https://somersetmirissablue.com/",
    facts: [
      { label: "Client", value: "Somerset Mirissa Blue" },
      { label: "Industry", value: "Boutique beach hotel" },
      { label: "Market", value: "International & local travellers" },
      { label: "Stack", value: "Next.js, SwiftBook engine" },
      { label: "Website", value: "somersetmirissablue.com", href: "https://somersetmirissablue.com/" },
    ],
    about: {
      title: "About Somerset Mirissa Blue",
      paragraphs: [
        "Somerset Mirissa Blue is a boutique hotel on a hilltop above Mirissa beach, on Sri Lanka's south coast. Its rooftop infinity pool looks straight over Turtle Beach.",
        "The hotel offers six room types, from sea-view doubles to family quadruple rooms, plus a restaurant and an Ayurvedic spa. It positions itself as affordable, luxurious and family friendly, about 2.5 hours from Colombo airport by expressway.",
      ],
    },
    challenge: {
      intro:
        "Like most small hotels, Somerset Mirissa Blue pays commission on every booking that comes through an OTA. The website had to win more of those guests back as direct bookings.",
      items: [
        { title: "Make booking direct the easy option", text: "Guests should be able to check dates without leaving the homepage." },
        { title: "Sell the view", text: "The hilltop setting and rooftop pool are the hotel's biggest selling points, so they had to lead." },
        { title: "Help guests choose a room", text: "Six room types needed clear, comparable details: size, view, beds and features." },
        { title: "Reward booking direct", text: "The hotel needed a place to run web-only offers and promo codes." },
      ],
    },
    approach: {
      intro: "We built the site around one goal: get the guest from “wow, that view” to a confirmed direct booking in as few steps as possible.",
      steps: [
        { title: "A booking bar in the hero", text: "Check-in, check-out and guests sit on the first screen, linked to the SwiftBook engine. “Book Now” stays in the header on every page." },
        { title: "Room cards that compare at a glance", text: "Each card shows size in sqm, view, pool and balcony icons, then Explore and Check Availability. Every room has its own page." },
        { title: "A home for direct-booking offers", text: "An offers carousel shows web-only deals, such as a promo-code discount and a stay-2-get-1-free package." },
        { title: "The full stay, not just the bed", text: "Dining, the Ayurvedic spa and the gallery each get a homepage teaser and their own page." },
        { title: "FAQs that remove doubt", text: "Check-in times, kids policy, payments and activities like whale watching are answered before guests have to ask." },
        { title: "Contact everywhere", text: "Hotline, WhatsApp and email sit in the header and footer." },
      ],
    },
    highlights: {
      intro:
        "The UI pairs an elegant small-caps serif with soft watercolour textures and a navy accent taken from the logo. It feels calm, coastal and boutique.",
      items: [
        { title: "A split hero with booking built in", text: "A guest relaxing in the rooftop infinity pool sits beside the hotel name, with the date and guest picker anchored at the bottom of the screen.", shot: s("somerset-mirissa-blue", "hero", "Somerset Mirissa Blue homepage hero with booking bar", 800, 500), caption: "Homepage hero with the booking bar." },
        { title: "Room cards made for comparing", text: "Each card leads with a large room photo, size in sqm and feature icons, then Explore and Check Availability links.", shot: s("somerset-mirissa-blue", "rooms", "Room cards slider", 800, 500), caption: "Room cards in the “Your home away from home” slider." },
        { title: "More than a room", text: "Dining and the Ayurvedic spa get editorial-style sections with mixed image layouts, so guests picture the whole stay.", shot: s("somerset-mirissa-blue", "spa", "Spa and wellness section", 800, 500), caption: "The Spa & Wellness section." },
      ],
    },
    desktopShots: [
      s("somerset-mirissa-blue", "hero", "Somerset Mirissa Blue homepage hero", 800, 500),
      s("somerset-mirissa-blue", "rooms", "Rooms", 800, 500),
      s("somerset-mirissa-blue", "spa", "Spa & Wellness", 800, 500),
    ],
    mobileShots: [s("somerset-mirissa-blue", "mobile", "Somerset Mirissa Blue homepage on mobile", 375, 812)],
    delivered: [
      "Booking bar in the hero, linked to SwiftBook",
      "“Book Now” in the header on every page",
      "Rooms & Rates plus 6 room pages",
      "Web-only offers carousel",
      "Dining, Spa & Wellness and Gallery pages",
      "FAQs for check-in, kids, payments and activities",
      "Hotline, WhatsApp and email in header and footer",
      "Mobile-first layouts",
    ],
    numbers: [
      { value: "6", label: "room types, each with its own page" },
      { value: "1", label: "screen from the view to booking dates" },
      { value: "0", label: "OTA commission on direct bookings" },
    ],
    thumb: "/images/home/projects/somerset-mirissa-blue.webp",
    cta: { title: "Want more direct bookings for your hotel?", text: "We design and build hotel websites that show off your property and cut OTA commission, with booking engine integration and offers you control." },
  },
];

export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);

/** The three case studies after this one, wrapping round. */
export const moreCaseStudies = (slug: string, n = 3) => {
  const i = caseStudies.findIndex((c) => c.slug === slug);
  return Array.from({ length: Math.min(n, caseStudies.length - 1) }, (_, k) => caseStudies[(i + 1 + k) % caseStudies.length]);
};
