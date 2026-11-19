import type { Metadata } from "next";
import PageIntro from "@/components/sections/PageIntro";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return <PageIntro title="Contact" description="Content coming soon." />;
}
