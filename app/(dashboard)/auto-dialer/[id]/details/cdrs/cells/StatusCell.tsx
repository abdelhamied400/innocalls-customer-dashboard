import { Cell } from "@/types/cell";
import { CampaignCdrsCols } from "../columns";
import { ReactNode } from "react";
import { useTranslations } from "@/providers/TranslationProvider";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CampaignCdr } from "@/types/autoDialerCampaign";

const classNames: Record<CampaignCdr["status"], string> = {
  "User did not answer": "bg-yellow-200 text-yellow-600 hover:bg-yellow-200",
  "Airplane Mode Enabled": "bg-red-200 text-red-600 hover:bg-red-200",
  Initiated: "bg-blue-200 text-blue-600 hover:bg-blue-200",
  Processing: "bg-cyan-200 text-cyan-600 hover:bg-cyan-200",
  "Call Failed": "bg-red-200 text-red-600 hover:bg-red-200",
  "User Busy/Rejected By User":
    "bg-yellow-200 text-yellow-600 hover:bg-yellow-200",
  "User Connected": "bg-green-200 text-green-600 hover:bg-green-200",
  "User Unreachable (Out of Network Coverage or Airplane Mode)":
    "bg-red-200 text-red-600 hover:bg-red-200",
  Completed: "bg-green-200 text-green-600 hover:bg-green-200",
  Timeout: "bg-yellow-200 text-yellow-600 hover:bg-yellow-200",
  Abandoned: "bg-red-200 text-red-600 hover:bg-red-200",
};

type StatusCellProps = Cell<CampaignCdrsCols, ReactNode>;
const StatusCell = ({ cell }: StatusCellProps) => {
  const status = cell.getValue() as CampaignCdr["status"];
  const t = useTranslations("autoDialer.campaignCdrs");
  return (
    <Badge className={cn("border-0", classNames[status])}>
      <span className="flex items-center gap-2">{t(`statuses.${status}`)}</span>
    </Badge>
  );
};

export default StatusCell;
