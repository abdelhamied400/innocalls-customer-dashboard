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
import { useTranslations } from "next-intl";

const ProfileMenu = () => {
  const { data: session, status } = useSession();
  const { Organization, setOrganization } = useAuthStore();
  const router = useRouter();
  const t = useTranslations("components.profileMenu");
  const tActions = useTranslations("common.actions");

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
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
      });
    }
    const org = session?.user.organizations?.find((org) => org.id === orgId);
    if (org) {
      setOrganization(org);
      return;
    }
    const defaultOrg = session?.user.organizations?.[0];
    if (defaultOrg) {
      setCookie("OrganizationId", defaultOrg.id);
      setOrganization(defaultOrg);
    }
  }, [session, setOrganization, setCookie, getCookie, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="w-14 h-14 rounded-full" />
        <div className="flex flex-col items-start gap-1">
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
          <span className="border-[3px] border-primary p-0.5 rounded-full w-14 h-14">
            <img
              src="/assets/images/avatar.png"
              alt="avatar"
              className="rounded-full"
            />
          </span>
          <div className="flex flex-col items-start">
            <p className="font-semibold text-lg">{session?.user.name}</p>
            <p className="text-neutral-400 text-sm">{Organization?.name}</p>
            <p className="text-neutral-400 text-sm">{session?.user.role}</p>
          </div>

          <ExpandCircleDownOutlinedIcon className="text-neutral-300" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{t("organizations")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {session?.user.organizations?.map((org) => (
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
