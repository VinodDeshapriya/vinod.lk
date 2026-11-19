import StyledContainer from "@/components/ui/StyledContainer";

interface PageIntroProps {
  title: string;
  description?: string;
}

/** Simple page heading used by inner pages until their designs are built. */
export default function PageIntro({ title, description }: PageIntroProps) {
  return (
    <StyledContainer
      as="section"
      slice={{ primary: { top_padding: "Full", bottom_padding: "Full", background_color: false } }}
      className="max-w-260!"
    >
      <h1 className="text-title-2x-large text-text-heading">{title}</h1>
      {description && (
        <p className="text-body-large text-text-description mt-4">
          {description}
        </p>
      )}
    </StyledContainer>
  );
}
