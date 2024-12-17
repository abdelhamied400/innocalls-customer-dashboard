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
    <div className="field">
      <label
        className="relative flex flex-col gap-1 cursor-pointer"
        htmlFor={htmlFor}
      >
        <div
          className="bg-gray-50 hover:bg-gray-100 px-4 py-2 border rounded-xl"
          {...props}
        >
          {label && (
            <span className="block -mb-2 text-muted-foreground text-xs">
              {label}
            </span>
          )}
          <div className="flex items-center gap-1">
            {preIcon}
            <div className="flex flex-col flex-1 gap-2">{children}</div>
            {postIcon}
          </div>
        </div>
      </label>

      {hint && <div className="text-muted-foreground text-xs">{hint}</div>}
      {error && <div className="text-red-500 text-xs">{error}</div>}
    </div>
  );
};

export default Field;
