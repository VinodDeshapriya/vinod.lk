import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import ProcessTimeline from "./ProcessTimeline";

export type ProcessProps = SliceComponentProps<Content.ProcessSlice>;

/** Figma: 📦 Components › Content Section Variants › content_process_variants1 (19342:3991) */
const Process = ({ slice }: ProcessProps) => (
  <div id="process" data-slice-type={slice.slice_type} className="scroll-mt-24">
    <ProcessTimeline primary={slice.primary} />
  </div>
);

export default Process;
