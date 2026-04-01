import { useDateFnsLocale, useLocale } from "@/providers/TranslationProvider";
import { CallBridgeCall } from "@/types/callBridge";
import { Cell } from "@/types/cell";
import { format } from "date-fns";

type DateTimeCellProps = Cell<CallBridgeCall>;

const DateTimeCell = ({ cell }: DateTimeCellProps) => {
  const locale = useDateFnsLocale();
  const lang = useLocale();
  const raw = String(cell.getValue() || "");
  const parsed = new Date(raw.replace(" ", "T"));

  if (Number.isNaN(parsed.getTime())) {
    return raw;
  }

  const pattern = lang === "ar" ? "d MMMM yyyy HH:mm" : "d MMM yyyy HH:mm";
  const formatted = format(parsed, pattern, { locale });
  if (lang === "ar") {
    return formatted.replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]);
  }
  return formatted;
};

export default DateTimeCell;
