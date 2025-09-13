"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ExpandCircleDownOutlinedIcon from "@mui/icons-material/ExpandCircleDownOutlined";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { getCookie, setCookie } from "cookies-next/client";
import { Organization } from "next-auth";
import useAuthStore from "@/store/auth.slice";
import { useRouter } from "next/navigation";
import { Skeleton } from "./ui/skeleton";
import { useEffect } from "react";
import { useTranslations } from "@/providers/TranslationProvider";
import { agentActivitiesColors } from "@/constants/agent-activity";
import { AgentActivity } from "@/types/webrtc";
import webrtcService from "@/services/webrtc.service";

const ProfileMenu = () => {
  const { data: session, status } = useSession();
  const { Organization, setOrganization } = useAuthStore();
  const router = useRouter();
  const t = useTranslations("components.profileMenu");
  const tActions = useTranslations("common.actions");
  const breakType =
    session?.user.latestActivity?.type || AgentActivity.CONNECTED_NOT_READY;

  const handleLogout = async () => {
    // TODO: FIND ANOTHER WAY TP LOGOUT ...
    // Get the current base URL
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

    // Sign out without redirect first
    if (session?.user.userType === "agent") {
      await webrtcService
        .changeAgentState(AgentActivity.PORTAL_LOGGED_OUT)
        .catch((err) => {
          console.error("Error changing agent state on logout:", err);
        });
    }
    await signOut({ redirect: false });
    // Then manually redirect to the login page using the correct base URL
    window.location.href = `${baseUrl}/login`;
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
        isDemo: false,
        listenToCallEvents: false,
        provider: "",
        allowedBreakTypes: [],
      });
    }
    const org = session?.user?.organizations?.find((org) => org.id === orgId);
    if (org) {
      setOrganization(org);
      return;
    }
    const defaultOrg = session?.user?.organizations?.[0];
    if (defaultOrg) {
      setCookie("OrganizationId", defaultOrg.id);
      setOrganization(defaultOrg);
    }
  }, [session, setOrganization, setCookie, getCookie, router]);

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
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center gap-2">
          <span className="border-[3px] border-primary p-0.5 rounded-full w-14 h-14 relative">
            <img
              src="/assets/images/avatar.png"
              alt="avatar"
              className="rounded-full"
            />
            {session?.user.userType === "agent" && breakType && (
              <span
                className="absolute bottom-0 right-0 border-4 border-white w-4 h-4 rounded-full"
                style={{
                  backgroundColor: agentActivitiesColors[breakType],
                }}
              ></span>
            )}
          </span>
          <div className="flex-col items-start gap-1 hidden md:flex">
            <p className="font-semibold text-lg">{session?.user?.name}</p>
            <p className="text-neutral-400 text-sm">{Organization?.name}</p>
            {/* <p className="text-neutral-400 text-sm">{session?.user.userType}</p> */}
          </div>

          <ExpandCircleDownOutlinedIcon className="text-neutral-300" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{t("organizations")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {session?.user?.organizations?.map((org) => (
          <DropdownMenuItem
            key={org.name}
            className="flex flex-col items-start gap-0"
            onClick={() => handleOrganizationChange(org)}
          >
            <span>{org.name}</span>
            <span className="text-xs text-gray-600">
              {/* {org.hasTenant ? t("tenant") : t("noTenant")} */}
            </span>
          </DropdownMenuItem>
        ))}
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
  );
};

export default ProfileMenu;
