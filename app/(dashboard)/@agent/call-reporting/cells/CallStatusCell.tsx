import { Badge } from "@/components/ui/badge";
import { AgentCall } from "@/types/api/call-reporting";
import { Cell } from "@/types/cell";
import { useTranslations } from "@/providers/TranslationProvider";

const CallStatusCell = ({ row }: Cell<AgentCall>) => {
  const t = useTranslations("callReporting.status");

  const isAnswered = row.original.isAnswered;

  if (isAnswered) {
    return (
      <Badge variant="success" className="capitalize">
        {t("answered")}
      </Badge>
    );
  } else {
    return (
      <Badge variant="muted" className="capitalize">
        {t("notAnswered")}
      </Badge>
    );
  }
};

export default CallStatusCell;
