import { forwardRef } from "react";
import { FieldError } from "react-hook-form";

type StyledInputType = "text" | "email" | "tel" | "textarea";

interface StyledInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement> &
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "type"
> {
  label: string;
  labelClassName?: string;
  required?: boolean;
  type?: StyledInputType;
  error?: FieldError;
  rows?: number;
}

const inputClass =
  "w-full rounded border border-border-primary px-4 py-3 text-body-base outline-0 focus:border-primary focus:outline-1 focus:outline-primary-light transition-colors";
const errorClass = "mt-1 text-body-small text-red-500";
const defaultLabelClass = "mb-1 block text-body-base";

const StyledInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  StyledInputProps
>(
  (
    {
      label,
      labelClassName,
      required = false,
      type = "text",
      error,
      rows = 5,
      ...rest
    },
    ref,
  ) => {
    return (
      <div>
        <label className={labelClassName ?? defaultLabelClass}>
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
        {type === "textarea" ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            rows={rows}
            className={inputClass}
            {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            type={type}
            className={inputClass}
            {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        {error && <p className={errorClass}>{error.message}</p>}
      </div>
    );
  },
);

StyledInput.displayName = "StyledInput";

export default StyledInput;
