"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface AnalyticsTabsProps {
  tabs: Tab[];
  children: React.ReactNode[];
  defaultTab?: string;
}

const AnalyticsTabs: React.FC<AnalyticsTabsProps> = ({ tabs, children, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <Card>
      <CardHeader>
        <div className="flex space-x-1 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                activeTab === tab.id
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {React.Children.toArray(children).map((child, index) => (
          <div key={tabs[index]?.id} className={activeTab === tabs[index]?.id ? "block" : "hidden"}>
            {child}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AnalyticsTabs; 