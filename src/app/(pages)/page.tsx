import HeroSection from "@/components/sections/home/HeroSection";
import Testimonials from "@/components/sections/home/Testimonials";
import RecentBuild from "@/components/sections/home/RecentBuild";
import Services from "@/components/sections/home/Services";
import CtaBand from "@/components/sections/home/CtaBand";
import TwoWaysToBuild from "@/components/sections/home/TwoWaysToBuild";
import StatsBand from "@/components/sections/home/StatsBand";
import Process from "@/components/sections/home/Process";
import WhyChooseUs from "@/components/sections/home/WhyChooseUs";
import BlogPreview from "@/components/sections/home/BlogPreview";
import FaqSection from "@/components/sections/home/FaqSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Testimonials />
      <RecentBuild />
      <Services />
      <CtaBand
        title={
          <>
            Websites, branding and systems,
            <br />
            <em className="italic">all under one roof</em>
          </>
        }
        intro="Whether you need your first business website, a full rebrand or a booking system that saves you hours each week, Vinod.lk handles it end to end. One team, one plan, and no passing you between agencies."
      />
      <TwoWaysToBuild />
      <StatsBand />
      <Process />
      <WhyChooseUs />
      <CtaBand
        title={
          <>
            Ready to stop losing customers
            <br />
            to a <em className="italic">better website</em>?
          </>
        }
        intro="Book a free 20-minute call. We'll look at your current site (or your idea), show you what's holding it back, and give you a clear plan. No pressure, no jargon."
      />
      <BlogPreview />
      <FaqSection />
    </>
  );
}
