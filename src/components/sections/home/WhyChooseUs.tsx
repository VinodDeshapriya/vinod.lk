import StyledContainer from "@/components/ui/StyledContainer";
import StyledButton from "@/components/ui/StyledButton";
import SectionHeading from "@/components/ui/SectionHeading";
import Highlight from "@/components/ui/Highlight";

const reasons = [
  {
    title: "Delivered on time",
    text: "You get a clear timeline at the start, and we stick to it. No projects dragging on for months.",
  },
  {
    title: "Support that sticks around",
    text: "Questions after launch? You'll get a real answer from a real person, fast.",
  },
  {
    title: "Talk directly to the person building it",
    text: "No account managers or middlemen. Call, email or WhatsApp, in Sinhala or English.",
  },
  {
    title: "Built for Google from day one",
    text: "Every site comes SEO-ready: clean code, fast load times, proper headings and Google Business Profile tips.",
  },
];

/** Figma: Home Page › Why choose us (19268:2010) */
export default function WhyChooseUs() {
  return (
    <StyledContainer
      as="section"
      slice={{ primary: { top_padding: "Full", bottom_padding: "Full" } }}
      parentClassName="bg-offwhite-2"
      className="flex flex-col gap-10 items-center"
    >
      <SectionHeading
        title={
          <>
            Why clients choose to
            <br />
            <Highlight>work with me</Highlight>
          </>
        }
      />
      <ol className="w-full grid sm:grid-cols-2 lg:grid-cols-4 bg-white border border-border-primary rounded-lg overflow-hidden shadow-[0_12px_40px_0_rgba(10,18,33,0.05)]">
        {reasons.map((r, i) => (
          <li
            key={r.title}
            className="flex flex-col gap-3 p-8 border-border-secondary border-b sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0 sm:[&:nth-last-child(-n+2)]:border-b-0"
          >
            <span className="pb-5 font-title font-medium text-[48px] leading-[56px] tracking-[-0.03em] text-primary-light">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="text-title-base text-text-heading">{r.title}</h3>
            <p className="text-body-small text-text-description">{r.text}</p>
          </li>
        ))}
      </ol>
      <StyledButton label="Get a Free Quote" link="/contact" variant="Secondary" />
    </StyledContainer>
  );
}
