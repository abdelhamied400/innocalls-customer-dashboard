import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSip } from "@/providers/webrtc/SipProvider";
import { useTranslations } from "@/providers/TranslationProvider";
import { MoreVert } from "@mui/icons-material";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { agentActivities, AgentActivity } from "@/constants/agent-activity";
import useAuthStore from "@/store/auth.slice";
import webrtcService from "@/services/webrtc.service";

const ExtensionStateBar = () => {
  const t = useTranslations("webrtc");

  const { extension, extensionState, reconnect } = useSip();
  const { Organization } = useAuthStore();

  const handleActivityChange = async (
    activity: AgentActivity,
    breakType?: string
  ) => {
    try {
      const res = await webrtcService.changeAgentState(
        activity.value,
        breakType
      );
      console.log(res);
    } catch (error) {
      console.error(error);
    } finally {
      // optional: any cleanup or state update after the request
    }
  };

  if (!extension) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between p-4",
        extensionState === "disconnected" && "bg-destructive-200",
        extensionState === "connected" && "bg-success-200",
        extensionState === "connecting" && "bg-warning-200"
      )}
    >
      <p className="">
        {extension?.ext} {t("status." + extensionState)}
      </p>
      {extensionState === "disconnected" && (
        <Button onClick={reconnect} size="sm" variant="link">
          {t("actions.reconnect")}
        </Button>
      )}
      {extensionState === "connected" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="link">
              <MoreVert />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>change state</DropdownMenuLabel>

            {agentActivities.map((activity) =>
              activity.value === "break_started" ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <DropdownMenuItem key={activity.value}>
                      <span
                        className="inline-block w-2.5 h-2.5 mr-2 rounded-full"
                        style={{ backgroundColor: activity.color }}
                      />
                      {activity.label}
                    </DropdownMenuItem>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {Organization?.allowedBreakTypes.map((breakType) => (
                      <DropdownMenuItem
                        key={breakType}
                        onClick={() => {
                          handleActivityChange(activity, breakType);
                        }}
                      >
                        <span
                          className="inline-block w-2.5 h-2.5 mr-2 rounded-full"
                          style={{ backgroundColor: activity.color }}
                        />
                        {breakType}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <DropdownMenuItem
                  key={activity.value}
                  onClick={() => {
                    handleActivityChange(activity);
                  }}
                >
                  <span
                    className="inline-block w-2.5 h-2.5 mr-2 rounded-full"
                    style={{ backgroundColor: activity.color }}
                  />
                  {activity.label}
                </DropdownMenuItem>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default ExtensionStateBar;
