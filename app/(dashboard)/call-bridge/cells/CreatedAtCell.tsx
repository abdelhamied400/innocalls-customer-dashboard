import { useDateFnsLocale, useLocale } from "@/providers/TranslationProvider";
import { CallBridge } from "@/types/callBridge";
import { Cell } from "@/types/cell";
import { format } from "date-fns";

type CreatedAtCellProps = Cell<CallBridge>;
const CreatedAtCell = ({ cell }: CreatedAtCellProps) => {
  const locale = useDateFnsLocale();
  const lang = useLocale();
  const pattern = lang === "ar" ? "d MMMM yyyy" : "d MMM yyyy";
  const formatted = format(new Date(cell.getValue() as string), pattern, { locale });
  if (lang === "ar") {
    return formatted.replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]);
  }
  return formatted;
};

export default CreatedAtCell;
