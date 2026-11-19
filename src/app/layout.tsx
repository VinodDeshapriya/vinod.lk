import type { Metadata } from "next";
import { PrismicPreview } from "@prismicio/next";
import StyledHeader from "@/components/ui/StyledHeader";
import StyledFooter from "@/components/ui/StyledFooter";
import { getLayoutData } from "@/lib/layoutData";
import { repositoryName } from "@/prismicio";
import projectConfig from "../../project.config";
import { fontVariables } from "./fonts";

import SmoothScroll from "@/components/motion/SmoothScroll";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import "./globals.css";

/** Runs before paint: turn on scroll reveals only when motion is allowed. */
const revealBoot = `try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("js-reveal")}catch(e){}`;

export async function generateMetadata(): Promise<Metadata> {
  const { site, settings } = await getLayoutData();
  return {
    metadataBase: new URL(projectConfig.baseUrl),
    title: { default: site.name, template: `%s | ${site.name}` },
    description: settings?.data.meta_description || site.description,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { mainMenu, headerCta, site, footerMenus, legalLinks, footerStrap } =
    await getLayoutData();

  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: revealBoot }} />
      </head>
      <body id="top" className="min-h-full flex flex-col">
        <StyledHeader mainMenu={mainMenu} headerCta={headerCta} />
        <main className="grow">{children}</main>
        <StyledFooter
          site={site}
          footerMenus={footerMenus}
          legalLinks={legalLinks}
          footerStrap={footerStrap}
        />
        <SmoothScroll />
        <RevealOnScroll />
        <PrismicPreview repositoryName={repositoryName} />
      </body>
    </html>
  );
}
