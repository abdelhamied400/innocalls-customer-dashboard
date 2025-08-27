"use client"; // ensures it only runs in the browser
import { signOut } from "next-auth/react";

export const clientSignout = async () => {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  console.log("WE ARE HERE ....");

  console.log({ baseUrl, lo: `${baseUrl}/login` });
  // Now safe: window is always defined here
  await signOut({ redirect: false });
  window.location.href = `${baseUrl}/login`;
};
