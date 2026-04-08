import { useDateFnsLocale, useLocale } from "@/providers/TranslationProvider";
import { PostCallSurveyCdr } from "@/types/api/post-call-survey";
import { Cell } from "@/types/cell";
import { format } from "date-fns";

type CreatedAtCellProps = Cell<PostCallSurveyCdr>;
const CreatedAtCell = ({ cell }: CreatedAtCellProps) => {
  const locale = useDateFnsLocale();
  const lang = useLocale();
  const pattern = lang === "ar" ? "d MMMM yyyy HH:mm" : "d MMM yyyy HH:mm";
  const formatted = format(new Date(cell.getValue() as string), pattern, {
    locale,
  });
  if (lang === "ar") {
    return formatted.replace(
      /\d/g,
      (d) => "\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669"[+d],
    );
  }
  return formatted;
};

export default CreatedAtCell;
