import { cn } from "@/lib/utils";
import { PropsWithChildren, ReactNode } from "react";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type FieldProps = PropsWithChildren<{
  htmlFor?: string;
  label?: string;
  labelAlign?: "start" | "center" | "end";
  error?: string;
  preIcon?: ReactNode;
  postIcon?: ReactNode;
  hint?: string;
  helperText?: string;
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
  helperText,
  ...props
}: FieldProps) => {
  const Wrapper = htmlFor ? "label" : "div";
  return (
    <div className="field">
      <Wrapper
        className="relative flex flex-col gap-1 cursor-pointer"
        {...(htmlFor ? { htmlFor } : {})}
      >
        <div
          className={cn(
            "bg-gray-50 hover:bg-gray-100 px-4 pt-2 pb-1.5 border rounded-xl",
            error && "border-red-500 bg-red-50 hover:bg-red-100 text-red-500",
          )}
          {...props}
        >
          {label && (
            <span
              className={cn(
                "flex items-center gap-1 text-xs text-muted-foreground",
                error && "text-red-500",
                labelAlign === "center" && "justify-center",
                labelAlign === "end" && "justify-end",
              )}
            >
              {label}
              {hint && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Info className="w-3 h-3" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs w-56 p-2">
                      {hint}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </span>
          )}
          <div className="flex items-center gap-1">
            {preIcon}
            {children}
            {postIcon}
          </div>
        </div>
      </Wrapper>

      {helperText && (
        <p className="text-xs text-muted-foreground mt-1">{helperText}</p>
      )}

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default Field;
