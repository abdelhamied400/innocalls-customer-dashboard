"use client";
import hasTenant from "@/containers/hasTenant";

const AnalyticsLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="h-full w-full">{children}</div>
);

export default hasTenant(AnalyticsLayout);
