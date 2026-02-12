"use client";
import UpdateAutoDialerCampaignSheet from "../../../[id]/update/page";
import { useEffect } from "react";

export default function ParallelUpdateSheet() {
  useEffect(() => {
    console.log("🎯 Parallel update sheet is rendering!");
  }, []);

  return <UpdateAutoDialerCampaignSheet />;
}
