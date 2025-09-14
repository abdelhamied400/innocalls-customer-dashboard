import { Row } from "@tanstack/react-table";

type ExpandCellProps<T> = {
  row: Row<T>;
};
const ExpandCell = <T,>({ row }: ExpandCellProps<T>) => {
  return (
    <div className="flex items-center justify-center">
      <button onClick={() => row.toggleExpanded()}>
        {row.getIsExpanded() ? "👇" : "👉"}
      </button>
    </div>
  );
};

export default ExpandCell;
