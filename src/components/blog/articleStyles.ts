/** Shared typography for blog article content (rich text, table headings, FAQ). */
export const articleH2 =
  "scroll-mt-28 font-title font-medium text-[24px] leading-[32px] tracking-[-0.01em] text-text-heading";

export const articleProse = [
  "text-body-base text-text-description",
  "[&_h2]:scroll-mt-28 [&_h2]:font-title [&_h2]:font-medium [&_h2]:text-[24px] [&_h2]:leading-[32px] [&_h2]:tracking-[-0.01em] [&_h2]:text-text-heading [&_h2]:mt-12 [&_h2]:mb-4",
  "[&_h3]:text-title-base-blog [&_h3]:text-text-heading [&_h3]:mt-8 [&_h3]:mb-3",
  "[&_p]:mb-5 [&_strong]:font-medium [&_strong]:text-text-heading [&_a]:text-primary-light [&_a]:underline",
  "[&_ul]:mb-5 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-3 [&_ul>li]:relative [&_ul>li]:pl-6",
  "[&_ul>li]:before:absolute [&_ul>li]:before:left-1 [&_ul>li]:before:top-[11px] [&_ul>li]:before:size-2 [&_ul>li]:before:rounded-full [&_ul>li]:before:bg-primary-light",
  "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_img]:rounded-md [&_img]:my-6",
].join(" ");
