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
import { setCookie } from "cookies-next/client";
import { Organization } from "next-auth";
import useAuthStore from "@/store/auth.slice";

const ProfileMenu = () => {
  const { data: session } = useSession();
  const { setOrganization } = useAuthStore();

  const handleLogout = () => {
    signOut();
  };

  const handleOrganizationChange = async (org: Organization) => {
    console.log("Selected organization:", org);
    setCookie("OrganizationId", org.id);
    await fetch("/api/set-org", {
      method: "POST",
      body: JSON.stringify({ orgId: org.id }),
      headers: { "Content-Type": "application/json" },
    });
    setOrganization(org);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center gap-2">
          <span className="border-[3px] border-primary p-0.5 rounded-full w-14 h-14">
            <img
              src="https://randomuser.me/api/portraits/women/54.jpg"
              alt="avatar"
              className="rounded-full"
            />
          </span>
          <div className="flex flex-col items-start">
            <p className="font-semibold text-lg">{session?.user.name}</p>
            <p className="text-neutral-400 text-sm">{session?.user.role}</p>
          </div>

          <ExpandCircleDownOutlinedIcon className="text-neutral-300" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Organizations</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {session?.user.organizations?.map((org) => (
          <DropdownMenuItem
            key={org.name}
            className="flex flex-col items-start gap-0"
            onClick={() => handleOrganizationChange(org)}
          >
            <span>{org.name}</span>
            <span className="text-xs text-gray-600">
              {org.hasTenant ? "Tenant" : "No Tenant"}
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
            Logout
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
