import { PropsWithChildren, ReactNode } from "react";

type FieldProps = PropsWithChildren<{
  htmlFor?: string;
  label?: string;
  error?: string;
  preIcon?: ReactNode;
  postIcon?: ReactNode;
  hint?: string;
}>;
const Field = ({
  htmlFor,
  label,
  children,
  error,
  preIcon,
  postIcon,
  hint,
  ...props
}: FieldProps) => {
  return (
    <div className="field flex-1">
      <label
        className="relative flex flex-col gap-1 cursor-pointer"
        htmlFor={htmlFor}
      >
        <div
          className="bg-gray-50 hover:bg-gray-100 px-4 pt-2 pb-1.5 border rounded-xl"
          {...props}
        >
          {label && (
            <span className="block mb-1 text-muted-foreground text-xs">
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
