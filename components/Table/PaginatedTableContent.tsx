import { PropsWithChildren } from "react";
import { Table } from "../ui/table";

type PaginatedTableContentProps = PropsWithChildren<{}>;
const PaginatedTableContent = ({ children }: PaginatedTableContentProps) => {
  return (
    <div className="flex-1 overflow-auto">
      <Table className="">{children}</Table>
    </div>
  );
};

export default PaginatedTableContent;
