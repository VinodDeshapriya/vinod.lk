"use client";

import clsx from "clsx";
import { BUTTON_VARIANTS } from "@/lib/buttonTypes";
import DynamicIcon from "./DynamicIcon";
import ButtonWrapper from "./ButtonWrapper";

export type ButtonVariantName = (typeof BUTTON_VARIANTS)[number]["variant"];

const VARIANT_LOOKUP = Object.fromEntries(
  BUTTON_VARIANTS.map((v) => [v.variant, v]),
) as Record<ButtonVariantName, (typeof BUTTON_VARIANTS)[number]>;

export interface StyledButtonProps {
  label?: string;
  variant?: ButtonVariantName;
  type?: "button" | "submit" | "reset";
  className?: string;
  link?: string;
  target?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const StyledButton = ({
  label = "",
  variant = "Primary",
  type = "button",
  className = "",
  link = "",
  children,
  disabled = false,
  target,
  onClick,
}: StyledButtonProps) => {
  if (!label && !children) return null;

  const variantDef = VARIANT_LOOKUP[variant] as {
    variant: string;
    class: string;
    icon?: string;
    iconAlignment?: string;
  };
  const icon = variantDef.icon ?? null;
  const iconAlignment = variantDef.iconAlignment ?? "left";

  return (
    <ButtonWrapper
      disabled={disabled}
      type={type}
      className={clsx("btn text-body-base-bold", variantDef.class, className)}
      onClick={onClick}
      link={link}
      target={target}
    >
      {icon && iconAlignment === "left" && (
        <DynamicIcon name={icon} size={20} className="mr-2" />
      )}
      {children || label}
      {icon && iconAlignment === "right" && (
        <DynamicIcon name={icon} size={20} className="ml-2" />
      )}
    </ButtonWrapper>
  );
};

export default StyledButton;
