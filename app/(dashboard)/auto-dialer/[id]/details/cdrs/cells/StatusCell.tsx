import { Cell } from "@/types/cell";
import { CampaignCdrsCols } from "../columns";
import { ReactNode } from "react";
import { useTranslations } from "@/providers/TranslationProvider";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CampaignCdr } from "@/types/autoDialerCampaign";

const classNames: Record<CampaignCdr["status"], string> = {
  Completed: "bg-green-200 text-green-700 hover:bg-green-200",
  "User Connected": "bg-emerald-200 text-emerald-700 hover:bg-emerald-200",
  Initiated: "bg-blue-200 text-blue-700 hover:bg-blue-200",
  Processing: "bg-cyan-200 text-cyan-700 hover:bg-cyan-200",
  "User did not answer": "bg-amber-200 text-amber-700 hover:bg-amber-200",
  "User Busy/Rejected By User":
    "bg-orange-200 text-orange-700 hover:bg-orange-200",
  Timeout: "bg-slate-200 text-slate-700 hover:bg-slate-200",
  "Call Failed": "bg-red-200 text-red-700 hover:bg-red-200",
  "Airplane Mode Enabled":
    "bg-purple-200 text-purple-700 hover:bg-purple-200",
  "User Unreachable (Out of Network Coverage or Airplane Mode)":
    "bg-pink-200 text-pink-700 hover:bg-pink-200",
  Abandoned: "bg-rose-200 text-rose-700 hover:bg-rose-200",
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
