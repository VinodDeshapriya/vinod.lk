"use client";

import Link from "next/link";
import { PrismicNextLink } from "@prismicio/next";
import { isFilled, type LinkField } from "@prismicio/client";

interface ButtonWrapperProps {
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  link?: string;
  target?: string;
  field?: LinkField | null;
  type?: "button" | "submit" | "reset";
}

const ButtonWrapper = ({
  children,
  className = "",
  onClick,
  disabled,
  link,
  field,
  type,
  target,
}: ButtonWrapperProps) => {
  if (field && isFilled.link(field)) {
    return (
      <PrismicNextLink field={field} className={className}>
        {children}
      </PrismicNextLink>
    );
  }
  if (link && !link.startsWith("/")) {
    return (
      <a href={link} className={className} target={target} rel="noreferrer">
        {children}
      </a>
    );
  }
  if (link) {
    return (
      <Link href={link} className={className} target={target}>
        {children}
      </Link>
    );
  }
  return (
    <button
      disabled={disabled}
      type={type}
      className={className}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ButtonWrapper;
