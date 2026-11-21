import type { Metadata } from "next";
import { PrismicPreview } from "@prismicio/next";
import StyledHeader from "@/components/ui/StyledHeader";
import StyledFooter from "@/components/ui/StyledFooter";
import { getLayoutData } from "@/lib/layoutData";
import { repositoryName } from "@/prismicio";
import projectConfig from "../../project.config";
import { fontVariables } from "./fonts";

import SmoothScroll from "@/components/motion/SmoothScroll";
import BookingModal from "@/components/booking/BookingModal";
import LiveChat from "@/components/layout/LiveChat";
import Script from "next/script";
import { themeScript } from "@/components/theme/themeScript";
import "./globals.css";

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
  const {
    mainMenu,
    headerCta,
    site,
    footerMenus,
    legalLinks,
    footerStrap,
    settings,
  } = await getLayoutData();
  const whatsapp =
    settings?.data.whatsapp_number?.replace(/\D/g, "") || "94775037738";

  return (
    <html
      lang="en"
      className={`${fontVariables} h-full antialiased`}
      suppressHydrationWarning
    >
      <body id="top" className="min-h-full flex flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <StyledHeader mainMenu={mainMenu} headerCta={headerCta} />
        <main className="grow">{children}</main>
        <StyledFooter
          site={site}
          footerMenus={footerMenus}
          legalLinks={legalLinks}
          footerStrap={footerStrap}
        />
        <SmoothScroll />
        <BookingModal />
        <LiveChat whatsapp={whatsapp} />
        <PrismicPreview repositoryName={repositoryName} />
      </body>
    </html>
  );
}
