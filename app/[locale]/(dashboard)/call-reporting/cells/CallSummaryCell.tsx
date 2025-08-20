import { Call } from "@/types/api/call-reporting";
import { Cell } from "@/types/cell";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Message } from "@mui/icons-material";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

type CallSummaryCellProps = Cell<Call, unknown>;

const CallSummaryCell = ({ row }: CallSummaryCellProps) => {
  const t = useTranslations("callReporting.summary");

  const summary = row.original.callSummary;

  if (!summary) {
    return <></>;
  }

  return (
    <div className="call-summary-cell">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost-primary" size="icon">
            <Message />
          </Button>
        </SheetTrigger>
        <SheetContent className="p-0">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between border-b p-4">
              <span>
                {t("title")} {summary?.addedBy}
              </span>
              <SheetClose />
            </SheetTitle>
          </SheetHeader>
          <div className="content p-4">
            <div className="flex flex-col gap-2">
              <div className="bg-gray-100 min-h-64 p-4 rounded-lg">
                <label className="text-sm text-gray-600">{t("comment")}</label>
                {summary?.comment && (
                  <p className="text-gray-600 font-bold text-sm">
                    {summary.comment}
                  </p>
                )}
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <label className="text-sm text-gray-600">{t("addedBy")}</label>
                {summary?.comment && (
                  <p className="text-gray-600 font-bold text-sm">
                    {summary.addedBy}
                  </p>
                )}
              </div>
              <p>{t("tags")}</p>
              {summary?.postCallTags && (
                <div className="flex flex-wrap gap-1">
                  {summary.postCallTags.map((tag) => (
                    <Badge key={tag} variant="success">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CallSummaryCell;
