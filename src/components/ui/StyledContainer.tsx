import clsx from "clsx";
import React from "react";

interface SlicePrimary {
  top_padding?: "None" | "Half" | "Full";
  bottom_padding?: "None" | "Half" | "Full";
  background_color?: boolean;
  // Slices pass their whole `primary` object here; only the padding /
  // background keys above are read, so allow any other fields through.
  [key: string]: unknown;
}

interface SliceData {
  primary?: SlicePrimary;
}

interface StyledContainerProps {
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
  slice?: SliceData;
  paddingX?: boolean;
  parentClassName?: string;
}

const StyledContainer = ({
  as: Comp = "div",
  className = "",
  children,
  slice = {},
  paddingX = true,
  parentClassName = "",
}: StyledContainerProps) => {
  const paddingXStyles = "px-[16px] md:px-[40px] xl:px-[80px]";

  const pt = slice.primary?.top_padding || "None";
  const pb = slice.primary?.bottom_padding || "None";

  return (
    <Comp
      className={clsx({
        "bg-offwhite": slice?.primary?.background_color,
        [paddingXStyles]: paddingX,
        "pt-0": pt === "None",
        "pb-0": pb === "None",
        "pt-(--spacing-vertical-padding-half)": pt === "Half",
        "pb-(--spacing-vertical-padding-half)": pb === "Half",
        "pt-(--spacing-vertical-padding-full)": pt === "Full",
        "pb-(--spacing-vertical-padding-full)": pb === "Full",
        [parentClassName]: true,
      })}
    >
      <div
        className={clsx({
          "mx-auto w-full max-w-[1280px]": true,
          [className]: true,
        })}
      >
        {children}
      </div>
    </Comp>
  );
};

export default StyledContainer;
