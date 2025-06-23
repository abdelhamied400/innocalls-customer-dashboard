import { ExpandMore, ExpandLess, UnfoldMore } from "@mui/icons-material";
import { Button } from "./ui/button";
import { PropsWithChildren } from "react";
import { Column } from "@tanstack/react-table";

type SortingHeadProps<T> = PropsWithChildren<{
  column: Column<T, unknown>;
}>;
const SortingHead = <T,>({ column, children }: SortingHeadProps<T>) => {
  const toggleSorting = () => {
    column.toggleSorting();
  };
  return (
    <Button variant="ghost" onClick={toggleSorting}>
      {children}
      {column.getIsSorted() === "asc" && (
        <ExpandMore className="ml-2 h-4 w-4" />
      )}
      {column.getIsSorted() === "desc" && (
        <ExpandLess className="ml-2 h-4 w-4" />
      )}
      {column.getIsSorted() === false && (
        <UnfoldMore className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
};

export default SortingHead;
