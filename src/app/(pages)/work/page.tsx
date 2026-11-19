import type { Metadata } from "next";
import PageIntro from "@/components/sections/PageIntro";

export const metadata: Metadata = {
  title: "Work",
};

export default function WorkPage() {
  return <PageIntro title="Work" description="Content coming soon." />;
}
