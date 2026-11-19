/**
 * Central definition of button variants for this project.
 *
 * HOW TO ADD A NEW VARIANT
 * 1. Add the name to BUTTON_VARIANTS below (e.g. "Outline")
 * 2. Add its CSS class to the `class` property in the entry above
 * 3. Add the CSS styles to src/app/style-variables/buttons.css (e.g. .btn-outline { ... })
 * 4. If new variants are added, update the buttons.css accordingly
 */

export const BUTTON_VARIANTS = [
  { variant: "Primary", class: "btn-primary" },
  { variant: "Secondary", class: "btn-secondary" },
  { variant: "Link", class: "btn-link" },
  {
    variant: "Primary with Arrow",
    class: "btn-primary",
    icon: "ArrowForwardFill",
    iconAlignment: "right",
  },
  {
    variant: "Secondary with Arrow",
    class: "btn-secondary",
    icon: "ArrowForwardFill",
    iconAlignment: "right",
  },
  {
    variant: "Link with Arrow",
    class: "btn-link",
    icon: "ArrowForwardFill",
    iconAlignment: "right",
  },
] as const;

export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];

export const BUTTON_VARIANT_OPTIONS = BUTTON_VARIANTS.map((v) => ({
  value: v,
  label: v,
}));
