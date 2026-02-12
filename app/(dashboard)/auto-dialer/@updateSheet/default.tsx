"use client";

export default function Default() {
  if (typeof window !== "undefined") {
    console.log("📋 UpdateSheet default is rendering");
  }
  return null;
}
