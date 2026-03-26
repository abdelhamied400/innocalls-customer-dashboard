"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ExpandCircleDownOutlinedIcon from "@mui/icons-material/ExpandCircleDownOutlined";
import { Button } from "./ui/button";
import { useSession } from "@/hooks/useSession";
import { getCookie, setCookie, deleteCookie } from "cookies-next/client";
import useAuthStore from "@/store/auth.slice";
import { useRouter } from "next/navigation";
import { Skeleton } from "./ui/skeleton";
import { useEffect } from "react";
import { useTranslations } from "@/providers/TranslationProvider";
import { agentActivitiesColors } from "@/constants/agent-activity";
import { AgentActivity } from "@/types/webrtc";
import webrtcService from "@/services/webrtc.service";
import useAuth from "@/hooks/useAuth";
import { Organization } from "@/types/api/organization";
import useSessionStore from "@/store/session.slice";
import { clientSignout } from "@/lib/auth";

const ProfileMenu = () => {
  const { data: session, status } = useSession();
  const { data: auth } = useAuth();

  const { Organization, setOrganization } = useAuthStore();
  const router = useRouter();
  const t = useTranslations("components.profileMenu");
  const tActions = useTranslations("common.actions");
  const tWebRTC = useTranslations("webrtc");

  // Get activity type only for agents
  const breakType =
    session?.userType === "agent"
      ? auth?.user.latestActivity?.type || AgentActivity.CONNECTED_NOT_READY
      : null;

  const breakSubType =
    session?.userType === "agent"
      ? auth?.user.latestActivity?.subType?.toLocaleLowerCase() || ""
      : null;

  const handleLogout = async () => {
    if (session?.userType === "agent") {
      await webrtcService
        .changeAgentState(AgentActivity.PORTAL_LOGGED_OUT)
        .catch((err) => {
          console.error("Error changing agent state on logout:", err);
        });
    }
    await clientSignout("/login");
  };

  const handleOrganizationChange = async (org: Organization) => {
    setCookie("OrganizationId", org.id);
    setOrganization(org);
  };

  useEffect(() => {
    const orgId = getCookie("OrganizationId");
    if (orgId) {
      setOrganization({
        id: orgId,
        name: "",
        hasTenant: false,
        enableAfterCallTags: false,
        enableCallTranscription: false,
        isDemo: false,
        listenToCallEvents: false,
        provider: "",
        allowedBreakTypes: [],
        paymentCurrency: "SAR",
        status: "pending",
      });
    }
    const org = auth?.organizations?.find((org) => org.id === orgId);
    if (org) {
      setOrganization(org);
      return;
    }
    const defaultOrg = auth?.organizations?.[0];
    if (defaultOrg) {
      setOrganization(defaultOrg);
      setCookie("OrganizationId", defaultOrg.id);
      return;
    }
  }, []);

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="w-14 h-14 rounded-full" />
        <div className="flex-col items-start gap-1 hidden md:flex">
          <Skeleton className="w-24 h-4 rounded" />
          <Skeleton className="w-16 h-4 rounded" />
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex items-center gap-2">
            {session?.userType === "agent" && breakType ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className="p-0.5 rounded-full w-14 h-14 relative border-[3px] transition-colors duration-200"
                    style={{
                      borderColor: agentActivitiesColors[breakType],
                    }}
                  >
                    <img
                      src="/assets/images/avatar.png"
                      alt="avatar"
                      className="rounded-full"
                    />
                    <span
                      className="absolute bottom-0 right-0 border-4 border-white w-4 h-4 rounded-full transition-colors"
                      style={{
                        backgroundColor: agentActivitiesColors[breakType],
                        boxShadow: `0 0 20 0 ${agentActivitiesColors[breakType]}`,
                      }}
                    ></span>
                    <span
                      className="absolute bottom-0 right-0 border-4 border-white w-4 h-4 rounded-full transition-colors animate-ping duration-[2000ms]"
                      style={{
                        backgroundColor: agentActivitiesColors[breakType],
                      }}
                    ></span>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {breakSubType ? (
                    <p>
                      {tWebRTC(`activity.${breakType}`)} ({" "}
                      {tWebRTC(`activity.breakTypes.${breakSubType}`) !==
                      `activity.breakTypes.${breakSubType}`
                        ? tWebRTC(`activity.breakTypes.${breakSubType}`)
                        : breakSubType}{" "}
                      )
                    </p>
                  ) : (
                    <p>{tWebRTC(`activity.${breakType}`)}</p>
                  )}
                </TooltipContent>
              </Tooltip>
            ) : (
              <span className="border-[3px] border-primary p-0.5 rounded-full w-14 h-14 relative">
                <img
                  src="/assets/images/avatar.png"
                  alt="avatar"
                  className="rounded-full"
                />
              </span>
            )}

            <div className="flex-col items-start gap-1 hidden md:flex">
              <p className="font-semibold text-lg">{auth?.user?.name}</p>
              <p className="text-neutral-400 text-sm">{Organization?.name}</p>
            </div>

            <ExpandCircleDownOutlinedIcon className="text-neutral-300" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex flex-col max-h-60">
          <DropdownMenuLabel>{t("organizations")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="overflow-y-auto flex-1">
            {auth?.organizations?.map((org) => (
              <DropdownMenuItem
                key={org.name}
                className="flex flex-col items-start gap-0"
                onClick={() => handleOrganizationChange(org)}
              >
                <span>{org.name}</span>
                <span className="text-xs text-gray-600"></span>
              </DropdownMenuItem>
            ))}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Button
              className="w-full"
              variant="ghost-destructive"
              onClick={handleLogout}
            >
              {tActions("logout")}
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
};

export default ProfileMenu;
