import { useDateFnsLocale } from "@/providers/TranslationProvider";
import { AutoDialerCampaignCols } from "../columns";
import { Cell } from "@/types/cell";
import { format } from "date-fns";

type CreatedAtCellProps = Cell<AutoDialerCampaignCols>;
const CreatedAtCell = ({ cell }: CreatedAtCellProps) => {
  const locale = useDateFnsLocale();
  return format(new Date(cell.getValue() as string), "d MMM yyyy", { locale });
};

export default CreatedAtCell;
