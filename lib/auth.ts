"use client"; // ensures it only runs in the browser
import { setCookie } from "cookies-next/client";
import { signOut } from "next-auth/react";

export const clientSignout = async () => {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  await signOut({ redirect: false });
  setCookie("OrganizationId", "");
  window.location.href = `${baseUrl}/login`;
};
