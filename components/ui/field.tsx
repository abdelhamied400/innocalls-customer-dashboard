import { cn } from "@/lib/utils";
import { PropsWithChildren, ReactNode } from "react";

type FieldProps = PropsWithChildren<{
  htmlFor?: string;
  label?: string;
  labelAlign?: "start" | "center" | "end";
  error?: string;
  preIcon?: ReactNode;
  postIcon?: ReactNode;
  hint?: string;
}>;
const Field = ({
  htmlFor,
  label,
  labelAlign,
  children,
  error,
  preIcon,
  postIcon,
  hint,
  ...props
}: FieldProps) => {
  return (
    <div className="field">
      <label
        className="relative flex flex-col gap-1 cursor-pointer"
        htmlFor={htmlFor}
      >
        <div
          className={cn(
            "bg-gray-50 hover:bg-gray-100 px-4 pt-2 pb-1.5 border rounded-xl",
            error && "border-red-500 bg-red-50 hover:bg-red-100 text-red-500"
          )}
          {...props}
        >
          {label && (
            <span
              className={cn(
                "block text-xs text-muted-foreground",
                error && "text-red-500",
                labelAlign === "center" && "text-center",
                labelAlign === "end" && "text-end"
              )}
            >
              {label}
            </span>
          )}
          <div className="flex items-center gap-1">
            {preIcon}
            {children}
            {postIcon}
          </div>
        </div>
      </label>

      {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default Field;
