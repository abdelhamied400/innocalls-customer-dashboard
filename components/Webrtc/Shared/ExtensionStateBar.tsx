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
import {
  AgentActivity,
  webrtcStoppingActivities,
} from "@/constants/agent-activity";
import useAuthStore from "@/store/auth.slice";
import webrtcService from "@/services/webrtc.service";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

const ExtensionStateBar = () => {
  const t = useTranslations("webrtc");

  const { extension, extensionState, reconnect, extensionLoading } = useSip();
  const { Organization } = useAuthStore();
  const { update, data: session } = useSession();
  const breakType = session?.user.latestActivity.type;

  const handleActivityChange = async (
    activity: AgentActivity["value"],
    breakType?: string
  ) => {
    try {
      await webrtcService.changeAgentState(activity, breakType);
      update({ refreshUser: true });
      // logout();
    } catch (error) {
      console.error(error);
    } finally {
      // optional: any cleanup or state update after the request
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
          extensionState === "connecting" && "bg-warning-200"
        )}
      >
        <p className="">
          {extension?.ext}{" "}
          {extensionState === "disconnected" &&
          !!breakType &&
          webrtcStoppingActivities.includes(breakType)
            ? t("breakTypes." + breakType)
            : t("status." + extensionState)}
        </p>

        {extensionState === "disconnected" &&
          !!breakType &&
          !webrtcStoppingActivities.includes(breakType) && (
            <Button onClick={reconnect} size="sm" variant="link">
              {t("actions.reconnect")}
            </Button>
          )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="link">
              <MoreVert />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              key="ready_accept_call"
              onClick={() => {
                handleActivityChange("ready_accept_call");
              }}
              disabled={
                breakType === "ready_accept_call" ||
                breakType === "break_started"
              }
            >
              <span
                className="inline-block w-2.5 h-2.5 mr-2 rounded-full"
                style={{ backgroundColor: "#22c55e" }}
              />
              Ready To Accept Call
            </DropdownMenuItem>

            <DropdownMenuSeparator className="h-px bg-gray-200" />

            {/* Break */}
            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
                disabled={breakType === "break_started"}
              >
                <DropdownMenuItem key="break_started">
                  <span
                    className="inline-block w-2.5 h-2.5 mr-2 rounded-full"
                    style={{ backgroundColor: "#eab308" }}
                  />
                  Take Break
                </DropdownMenuItem>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {Organization?.allowedBreakTypes.map((breakType: string) => (
                  <DropdownMenuItem
                    key={breakType}
                    onClick={() => {
                      handleActivityChange("break_started", breakType);
                    }}
                  >
                    <span
                      className="inline-block w-2.5 h-2.5 mr-2 rounded-full"
                      style={{ backgroundColor: "#eab308" }}
                    />
                    {breakType}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenuItem
              key="break_ended"
              onClick={() => {
                handleActivityChange("break_ended");
              }}
              disabled={breakType !== "break_started"}
            >
              <span
                className="inline-block w-2.5 h-2.5 mr-2 rounded-full"
                style={{ backgroundColor: "#38bdf8" }}
              />
              End Break
            </DropdownMenuItem>

            <DropdownMenuSeparator className="h-px bg-gray-200" />

            {/* Logout */}
            <DropdownMenuItem
              key="dialpad_logged_out"
              onClick={() => {
                handleActivityChange("dialpad_logged_out");
              }}
              disabled={breakType === "dialpad_logged_out"}
            >
              <span
                className="inline-block w-2.5 h-2.5 mr-2 rounded-full"
                style={{ backgroundColor: "#ef4444" }}
              />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ExtensionStateBar;
