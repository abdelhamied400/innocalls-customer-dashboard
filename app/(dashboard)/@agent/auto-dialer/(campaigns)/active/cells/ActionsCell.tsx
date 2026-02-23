import { Cell } from "@/types/cell";
import { AgentCampaignCols } from "../columns";
import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Headset, Login, Logout } from "@mui/icons-material";
import { useTranslations } from "@/providers/TranslationProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import autoDialerAgentService from "@/services/auto-dialer-agent.service";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";

type ActionsCellProps = Cell<AgentCampaignCols, ReactNode>;
const ActionsCell = ({ row }: ActionsCellProps) => {
  const campaign = row.original;
  const t = useTranslations("autoDialerAgent");
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const isActive = campaign.status === "active";
  const isAgentJoined = campaign.agentStatus === "joined";
  const canLeaveAndJoin = campaign.agentCanLogoutAndRejoin;

  const handleLeave = async () => {
    try {
      setIsLoading(true);
      await autoDialerAgentService.leaveCampaign(campaign.id);
      toast.success(t("toasts.leaveSuccess"));
      queryClient.invalidateQueries({
        queryKey: ["agent-auto-dialer-active-campaigns"],
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("toasts.leaveError"), {
          description: error.response?.data?.message || t("toasts.leaveErrorDescription"),
        });
      } else {
        toast.error(t("toasts.leaveError"), {
          description: t("toasts.leaveErrorDescription"),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = async () => {
    try {
      setIsLoading(true);
      await autoDialerAgentService.joinCampaign(campaign.id);
      toast.success(t("toasts.joinSuccess"));
      queryClient.invalidateQueries({
        queryKey: ["agent-auto-dialer-active-campaigns"],
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("toasts.joinError"), {
          description: error.response?.data?.message || t("toasts.joinErrorDescription"),
        });
      } else {
        toast.error(t("toasts.joinError"), {
          description: t("toasts.joinErrorDescription"),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={`/auto-dialer/${campaign.id}/cdrs`}>
              <Button size="sm" variant="ghost-primary">
                <Headset className="mr-1" />
                {t("actions.cdrs")}
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("tooltips.viewCdrs")}</p>
          </TooltipContent>
        </Tooltip>
        {isActive && canLeaveAndJoin && isAgentJoined && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost-destructive"
                onClick={handleLeave}
                disabled={isLoading}
              >
                <Logout className="mr-1" />
                {t("actions.leave")}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("tooltips.leaveCampaign")}</p>
            </TooltipContent>
          </Tooltip>
        )}
        {isActive && canLeaveAndJoin && !isAgentJoined && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost-primary"
                onClick={handleJoin}
                disabled={isLoading}
              >
                <Login className="mr-1" />
                {t("actions.join")}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("tooltips.joinCampaign")}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
};

export default ActionsCell;
