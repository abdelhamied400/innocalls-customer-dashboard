import { deleteCookie } from "cookies-next/client";
import { signOut } from "next-auth/react";

export const clientSignout = async (callbackUrl?: string) => {
  deleteCookie("OrganizationId");
  await signOut({ callbackUrl: callbackUrl || undefined });
};
