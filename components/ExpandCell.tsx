import { Row } from "@tanstack/react-table";

import { ChevronRightCircle, ChevronDownCircle } from "lucide-react";

type ExpandCellProps<T> = {
  row: Row<T>;
};

const ExpandCell = <T,>({ row }: ExpandCellProps<T>) => {
  return (
    <div className="flex items-center justify-center">
      <button onClick={() => row.toggleExpanded()}>
        {row.getIsExpanded() ? (
          <ChevronDownCircle
            size={16}
            className="text-primary-500 hover:text-primary-600"
          />
        ) : (
          <ChevronRightCircle
            size={16}
            className="text-gray-500 hover:text-gray-700"
          />
        )}
      </button>
    </div>
  );
};

export default ExpandCell;
