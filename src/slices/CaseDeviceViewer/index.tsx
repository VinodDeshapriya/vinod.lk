import { asLink, type Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import StyledContainer from "@/components/ui/StyledContainer";
import PrismicTitle from "@/components/ui/PrismicTitle";
import DeviceViewer from "@/components/work/DeviceViewer";
import { shots } from "@/lib/shots";
import type { SliceContext } from "@/lib/sliceContext";

export type CaseDeviceViewerProps = SliceComponentProps<Content.CaseDeviceViewerSlice, SliceContext>;

/** Desktop / Mobile switch with screens that scroll inside the frame. */
const CaseDeviceViewer = ({ slice, context }: CaseDeviceViewerProps) => {
  const doc = context?.caseStudy?.data;
  const name = doc?.name || "Project";
  const url = (doc && asLink(doc.live_url)) || undefined;
  const { title, desktop_screens, mobile_screens } = slice.primary;
  return (
    <StyledContainer
      data-slice-type={slice.slice_type}
      slice={{ primary: { top_padding: "Full", bottom_padding: "Half" } }}
      className="flex flex-col gap-10"
    >
      <PrismicTitle field={title} className="text-title-2x-large text-text-heading" emClassName="text-primary-light" />
      <DeviceViewer
        name={name}
        url={url}
        desktop={shots(desktop_screens.map((s) => s.image), `${name} desktop screen`)}
        mobile={shots(mobile_screens.map((s) => s.image), `${name} mobile screen`)}
      />
    </StyledContainer>
  );
};

export default CaseDeviceViewer;
