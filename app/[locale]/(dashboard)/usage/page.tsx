"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Usage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/usage/summary");
  }, [router]);
  return null; // This component redirects to the summary page
};

export default Usage;
