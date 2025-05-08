import { Button } from "@/components/ui/button";
import { PropsWithChildren } from "react";

type FilterDialogProps = PropsWithChildren<{
  title?: string;
  onApply?: () => void;
  onReset?: () => void;
}>;
const FilterDialog = ({
  children,
  title,
  onApply,
  onReset,
}: FilterDialogProps) => {
  return (
    <div className="flex flex-col gap-2 pt-2 min-w-72 filter-dialog">
      <div className="px-2 text-neutral-600 filter-dialog-header">
        <h4>{title}</h4>
      </div>
      <div className="flex flex-col gap-2 filter-dialog-body">
        <div className="flex flex-col gap-4 p-2 filter-dialog-content max-h-64 overflow-y-auto">
          {children}
        </div>
        <hr className="mx-2" />
        <div className="flex justify-between mb-2 px-2 filter-dialog-footer">
          <Button variant="ghost" className="text-primary" onClick={onReset}>
            Reset
          </Button>
          <Button variant="ghost" className="text-primary" onClick={onApply}>
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterDialog;
