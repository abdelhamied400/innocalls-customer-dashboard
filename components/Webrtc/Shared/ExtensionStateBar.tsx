import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSip } from "@/providers/webrtc/SipProvider";
import { useTranslations } from "@/providers/TranslationProvider";
import { MoreVert } from "@mui/icons-material";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { webrtcStoppingActivities } from "@/constants/agent-activity";
import webrtcService from "@/services/webrtc.service";
import breakTypesService from "@/services/break-types.service";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { isValidTransition } from "@/lib/webrtc";
import { AgentActivity } from "@/types/webrtc";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

const ExtensionStateBar = () => {
  const t = useTranslations("webrtc");

  const {
    extension,
    extensionState,
    reconnect,
    extensionLoading,
    currentSession,
  } = useSip();
  const { data: auth, refetch: refetchUser } = useAuth();
  const { data: session } = useSession();
  const { onActivityChange } = useSip();

  const { data: availableBreakTypes = [] } = useQuery({
    queryKey: ["agent-available-break-types"],
    queryFn: breakTypesService.getAgentAvailableBreakTypes,
    enabled: session?.userType === "agent",
  });

  const breakType =
    auth?.user?.latestActivity?.type || AgentActivity.CONNECTED_NOT_READY;

  // Agent is on a call if there's an active session
  const isOnCall = !!currentSession;

  const handleActivityChange = async (
    activity: AgentActivity,
    breakType?: AgentActivity,
  ) => {
    if (isOnCall) {
      toast.error(t("activity.messages.error"), {
        description: t("activity.messages.cannotChangeWhileOnCall"),
      });
      return;
    }

    try {
      await webrtcService.changeAgentState(activity, breakType);
      await refetchUser();
      onActivityChange(activity);
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error(t("activity.messages.error"), {
          description: errorMessage,
        });
      } else {
        toast.error(t("activity.messages.error"), {
          description: t("activity.messages.unexpectedError"),
        });
      }
    } finally {
    }
  };

  if (extensionLoading) {
    return <Skeleton className="h-16 w-full" />;
  }

  if (!extension) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <div
        className={cn(
          "flex items-center justify-between p-4",
          extensionState === "disconnected" && "bg-destructive-200",
          extensionState === "connected" && "bg-success-200",
          extensionState === "connecting" && "bg-warning-200",
        )}
      >
        <p className="">
          {extension?.ext}{" "}
          {session?.userType === "agent" &&
          extensionState === "disconnected" &&
          !!breakType &&
          webrtcStoppingActivities.includes(breakType)
            ? t("activity." + breakType)
            : t("status." + extensionState)}
        </p>

        {session?.userType === "agent" &&
          extensionState === "disconnected" &&
          !!breakType &&
          !webrtcStoppingActivities.includes(breakType) && (
            <Button onClick={reconnect} size="sm" variant="link">
              {t("actions.reconnect")}
            </Button>
          )}

        {session?.userType === "user" && extensionState === "disconnected" && (
          <Button onClick={reconnect} size="sm" variant="link">
            {t("actions.reconnect")}
          </Button>
        )}

        {session?.userType === "agent" && breakType && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="link">
                <MoreVert />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                key={AgentActivity.READY_ACCEPT_CALL}
                onClick={() => {
                  handleActivityChange(AgentActivity.READY_ACCEPT_CALL);
                }}
                disabled={
                  !isValidTransition(breakType, AgentActivity.READY_ACCEPT_CALL)
                }
              >
                <span
                  className="inline-block w-2.5 h-2.5 mr-2 rounded-full"
                  style={{ backgroundColor: "#22c55e" }}
                />
                {t("activity.actions.ready")}
              </DropdownMenuItem>

              <DropdownMenuSeparator className="h-px bg-gray-200" />

              {/* Break */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  disabled={
                    !isValidTransition(breakType, AgentActivity.BREAK_STARTED)
                  }
                >
                  <DropdownMenuItem key={AgentActivity.BREAK_STARTED}>
                    <span
                      className="inline-block w-2.5 h-2.5 mr-2 rounded-full"
                      style={{ backgroundColor: "#eab308" }}
                    />
                    {t("activity.actions.takeBreak")}
                  </DropdownMenuItem>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {availableBreakTypes.map((breakType) => (
                    <DropdownMenuItem
                      key={breakType.id}
                      onClick={() => {
                        handleActivityChange(
                          AgentActivity.BREAK_STARTED,
                          breakType.id as AgentActivity,
                        );
                      }}
                    >
                      <span
                        className="inline-block w-2.5 h-2.5 mr-2 rounded-full"
                        style={{ backgroundColor: "#eab308" }}
                      />
                      {breakType.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenuItem
                key={AgentActivity.BREAK_ENDED}
                onClick={() => {
                  handleActivityChange(AgentActivity.BREAK_ENDED);
                }}
                disabled={
                  !isValidTransition(breakType, AgentActivity.BREAK_ENDED)
                }
              >
                <span
                  className="inline-block w-2.5 h-2.5 mr-2 rounded-full"
                  style={{ backgroundColor: "#38bdf8" }}
                />
                {t("activity.actions.returnFromBreak")}
              </DropdownMenuItem>

              <DropdownMenuSeparator className="h-px bg-gray-200" />

              {/* Logout */}
              <DropdownMenuItem
                key={AgentActivity.DIALPAD_LOGGED_OUT}
                onClick={() => {
                  handleActivityChange(AgentActivity.DIALPAD_LOGGED_OUT);
                }}
                disabled={
                  !isValidTransition(
                    breakType,
                    AgentActivity.DIALPAD_LOGGED_OUT,
                  )
                }
              >
                <span
                  className="inline-block w-2.5 h-2.5 mr-2 rounded-full"
                  style={{ backgroundColor: "#ef4444" }}
                />
                {t("activity.actions.logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default ExtensionStateBar;
