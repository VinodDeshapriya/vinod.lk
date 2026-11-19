import type { Metadata } from "next";
import PageIntro from "@/components/sections/PageIntro";

export const metadata: Metadata = {
  title: "Blog",
};

export default function BlogPage() {
  return <PageIntro title="Blog" description="Content coming soon." />;
}
