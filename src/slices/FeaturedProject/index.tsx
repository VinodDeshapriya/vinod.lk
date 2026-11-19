import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import StyledContainer from "@/components/ui/StyledContainer";
import SectionHeading from "@/components/ui/SectionHeading";
import PrismicButtons from "@/components/ui/PrismicButtons";
import ProjectTabs from "./ProjectTabs";

export type FeaturedProjectProps =
  SliceComponentProps<Content.FeaturedProjectSlice>;

/** Figma: 📦 Components › Featured Content › featured_project_variants1 (19347:5283) */
const FeaturedProject = ({ slice }: FeaturedProjectProps) => (
  <div id="work" className="scroll-mt-24">
    <StyledContainer
      as="section"
      slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }}
      className="flex flex-col gap-10 items-center"
    >
      <SectionHeading title={slice.primary.title} intro={slice.primary.intro} />
      <ProjectTabs projects={slice.primary.projects} />
      <PrismicButtons buttons={slice.primary.buttons} />
    </StyledContainer>
  </div>
);

export default FeaturedProject;
