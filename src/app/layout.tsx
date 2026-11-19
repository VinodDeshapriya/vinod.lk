import type { Metadata } from "next";
import StyledHeader from "@/components/ui/StyledHeader";
import StyledFooter from "@/components/ui/StyledFooter";
import { mainMenu, siteSettings } from "@/data/site";
import projectConfig from "../../project.config";
import { fontVariables } from "./fonts";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(projectConfig.baseUrl),
  title: {
    default: siteSettings.name,
    template: `%s | ${siteSettings.name}`,
  },
  description: siteSettings.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body id="top" className="min-h-full flex flex-col">
        <StyledHeader mainMenu={mainMenu} />
        <main className="grow">{children}</main>
        <StyledFooter />
      </body>
    </html>
  );
}
