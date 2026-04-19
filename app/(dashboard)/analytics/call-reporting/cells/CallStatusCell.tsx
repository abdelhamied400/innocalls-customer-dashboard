import { Badge } from "@/components/ui/badge";
import { Call } from "@/types/api/call-reporting";
import { Cell } from "@/types/cell";
import { useTranslations } from "@/providers/TranslationProvider";

const CallStatusCell = ({ row }: Cell<Call>) => {
  const t = useTranslations("callReporting.status");

  const status = row.getValue("call_status") as string;

  if (status === "Answered") {
    return (
      <Badge variant="success" className="capitalize">
        {t("answered")}
      </Badge>
    );
  }
  if (status === "Busy") {
    return (
      <Badge variant="warning" className="capitalize">
        {t("busy")}
      </Badge>
    );
  }
  if (status === "Failed") {
    return (
      <Badge variant="destructive" className="capitalize">
        {t("failed")}
      </Badge>
    );
  }
  if (status === "Not Answered") {
    return (
      <Badge variant="muted" className="capitalize">
        {t("notAnswered")}
      </Badge>
    );
  }
  if (status === "Rejected") {
    return (
      <Badge variant="destructive" className="capitalize">
        {t("rejected")}
      </Badge>
    );
  }
  if (status === "Canceled") {
    return (
      <Badge variant="neutral" className="capitalize">
        {t("canceled")}
      </Badge>
    );
  }
  return (
    <Badge variant="default" className="capitalize">
      {status}
    </Badge>
  );
};

export default CallStatusCell;
