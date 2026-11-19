import { asLink, isFilled, type Content, type LinkField } from "@prismicio/client";
import { createClient } from "@/prismicio";
import type { NavItem } from "@/types/nav";
import * as fallback from "@/data/site";
import { withNavDetails } from "@/data/navDetails";

export type SiteData = typeof fallback.siteSettings;
export type HeaderCta = { label: string; href: string };
export type FooterMenu = { title: string; links: NavItem[] };

const toNav = (link: LinkField): NavItem => ({
  href: asLink(link) ?? "/",
  label: ("text" in link && link.text) || "",
  target: link.link_type === "Web" ? link.target : undefined,
});

/**
 * Header/footer data from Prismic (Settings, Main Menu, Footer Menu documents).
 * Anything not yet filled in Prismic falls back to src/data/site.ts.
 */
export async function getLayoutData() {
  const client = createClient();
  const [settings, mainMenuDoc, menus] = await Promise.all([
    client.getSingle("settings").catch(() => null),
    client.getSingle("main_menu").catch(() => null),
    client.getAllByType("menu").catch(() => [] as Content.MenuDocument[]),
  ]);
  const s = settings?.data;

  const site: SiteData = {
    ...fallback.siteSettings,
    ...(s?.site_name ? { name: s.site_name } : {}),
    ...(s?.footer_description ? { description: s.footer_description } : {}),
    ...(s?.email ? { email: s.email } : {}),
    ...(s?.location ? { location: s.location } : {}),
  };
  const phones = (s?.phone_numbers ?? []).map((p) => p.number).filter(Boolean) as string[];
  if (phones.length) {
    site.phones = phones;
    site.phone = phones[0];
  }
  const social = (s?.social_links ?? [])
    .filter((l) => l.platform && isFilled.link(l.link))
    .map((l) => ({ label: l.platform!, href: asLink(l.link) ?? "#" }));
  if (social.length) site.social = social;

  const headerCta: HeaderCta =
    s && isFilled.link(s.header_cta)
      ? { label: s.header_cta.text || "Contact", href: asLink(s.header_cta) ?? "/contact" }
      : fallback.headerCta;

  const prismicNav = (mainMenuDoc?.data.links ?? [])
    .filter((l) => isFilled.link(l.link))
    .map((l) => {
      const subs = (l.sub_links ?? []).filter((x) => isFilled.link(x.link));
      return {
        ...toNav(l.link),
        drop: subs.length
          ? [
              {
                links: subs.map((x) =>
                  withNavDetails({
                    ...toNav(x.link),
                    description: x.description || undefined,
                    icon: x.icon || undefined,
                    image: isFilled.image(x.image)
                      ? { src: x.image.url, alt: x.image.alt ?? undefined }
                      : undefined,
                  }),
                ),
              },
            ]
          : undefined,
      };
    });
  const mainMenu: NavItem[] = prismicNav.length
    ? prismicNav
    : fallback.mainMenu.map((m) => ({
        ...m,
        drop: m.drop?.map((c) => ({ ...c, links: c.links?.map(withNavDetails) })),
      }));

  const prismicFooter: FooterMenu[] = [...menus]
    .sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99))
    .map((m) => ({
      title: m.data.title ?? "",
      links: m.data.links.filter((l) => isFilled.link(l.link)).map((l) => toNav(l.link)),
    }));
  const footerMenus = prismicFooter.length ? prismicFooter : fallback.footerMenus;

  const legal = (s?.legal_links ?? []).filter((l) => isFilled.link(l.link)).map((l) => toNav(l.link));
  const legalLinks = legal.length ? legal : fallback.legalLinks;

  const footerStrap = {
    text: s?.footer_strap || "Web design across Sri Lanka, and for clients overseas",
    cta:
      s && isFilled.link(s.footer_cta)
        ? { label: s.footer_cta.text || "Book a Free Call", href: asLink(s.footer_cta) ?? "/contact" }
        : { label: "Book a Free Call", href: "/contact" },
  };

  return { settings, site, headerCta, mainMenu, footerMenus, legalLinks, footerStrap };
}

export type LayoutData = Awaited<ReturnType<typeof getLayoutData>>;
