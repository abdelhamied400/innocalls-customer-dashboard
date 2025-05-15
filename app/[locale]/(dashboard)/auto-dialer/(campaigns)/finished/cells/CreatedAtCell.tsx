import { AutoDialerCampaignCols } from "../columns";
import { Cell } from "@/types/cell";
import { format } from "date-fns";

type CreatedAtCellProps = Cell<AutoDialerCampaignCols>;
const CreatedAtCell = ({ cell }: CreatedAtCellProps) => {
  return format(new Date(cell.getValue() as string), "PP");
};

export default CreatedAtCell;
