import { useDateFnsLocale, useLocale } from "@/providers/TranslationProvider";
import { AutoDialerCampaignCols } from "../columns";
import { Cell } from "@/types/cell";
import { format } from "date-fns";

type CreatedAtCellProps = Cell<AutoDialerCampaignCols>;
const CreatedAtCell = ({ cell }: CreatedAtCellProps) => {
  const locale = useDateFnsLocale();
  const lang = useLocale();
  const pattern = lang === "ar" ? "d MMMM yyyy" : "d MMM yyyy";
  return format(new Date(cell.getValue() as string), pattern, { locale });
};

export default CreatedAtCell;
