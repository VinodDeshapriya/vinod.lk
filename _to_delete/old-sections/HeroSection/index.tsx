import StyledContainer from "@/components/ui/StyledContainer";
import StyledButton from "@/components/ui/StyledButton";

interface HeroSectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export default function HeroSection({
  eyebrow,
  title,
  description,
}: HeroSectionProps) {
  return (
    <StyledContainer
      as="section"
      slice={{ primary: { top_padding: "Full", bottom_padding: "Full", background_color: true } }}
      className="flex flex-col items-center text-center max-w-260!"
    >
      {eyebrow && (
        <p className="text-label text-primary-light uppercase mb-3">{eyebrow}</p>
      )}
      <h1 className="text-title-3x-large text-text-heading">{title}</h1>
      {description && (
        <p className="text-body-large text-text-description mt-4 max-w-180">
          {description}
        </p>
      )}
      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <StyledButton label="See my work" link="/work" variant="Primary" />
        <StyledButton
          label="Get in touch"
          link="/contact"
          variant="Secondary with Arrow"
        />
      </div>
    </StyledContainer>
  );
}
