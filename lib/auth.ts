import { setCookie } from "cookies-next/client";
import { signOut } from "next-auth/react";

export const clientSignout = async () => {
  await signOut();
  setCookie("OrganizationId", "");
};
