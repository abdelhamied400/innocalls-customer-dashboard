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
import useAuthStore from "@/store/auth.slice";
import webrtcService from "@/services/webrtc.service";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { isValidTransition } from "@/lib/webrtc";
import { AgentActivity } from "@/types/webrtc";
import { isAxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";

const ExtensionStateBar = () => {
  const t = useTranslations("webrtc");

  const { extension, extensionState, reconnect, extensionLoading } = useSip();
  const { Organization } = useAuthStore();
  const { update, data: session } = useSession();
  const breakType =
    session?.user?.latestActivity?.type || AgentActivity.CONNECTED_NOT_READY;
  const { toast } = useToast();

  const handleActivityChange = async (
    activity: AgentActivity,
    breakType?: AgentActivity
  ) => {
    try {
      await webrtcService.changeAgentState(activity, breakType);
      update({ refreshUser: true });
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    } finally {
    }
  };

  console.log(extension);

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
          extensionState === "connecting" && "bg-warning-200"
        )}
      >
        <p className="">
          {extension?.ext}{" "}
          {extensionState === "disconnected" &&
          !!breakType &&
          webrtcStoppingActivities.includes(breakType)
            ? t("activity." + breakType)
            : t("status." + extensionState)}
        </p>

        {extensionState === "disconnected" &&
          !!breakType &&
          !webrtcStoppingActivities.includes(breakType) && (
            <Button onClick={reconnect} size="sm" variant="link">
              {t("actions.reconnect")}
            </Button>
          )}

        {session?.user.userType === "agent" && breakType && (
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
                  {Organization?.allowedBreakTypes.map(
                    (type: AgentActivity) => (
                      <DropdownMenuItem
                        key={type}
                        onClick={() => {
                          handleActivityChange(
                            AgentActivity.BREAK_STARTED,
                            type
                          );
                        }}
                      >
                        <span
                          className="inline-block w-2.5 h-2.5 mr-2 rounded-full"
                          style={{ backgroundColor: "#eab308" }}
                        />
                        {t(
                          `activity.breakTypes.${type.toLocaleLowerCase()}`
                        ) !== `activity.breakTypes.${type.toLocaleLowerCase()}`
                          ? t(`activity.breakTypes.${type.toLocaleLowerCase()}`)
                          : type}
                      </DropdownMenuItem>
                    )
                  )}
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
                    AgentActivity.DIALPAD_LOGGED_OUT
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
