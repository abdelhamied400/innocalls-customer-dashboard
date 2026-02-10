"use client";

import { useTranslations } from "@/providers/TranslationProvider";
import BreakTypesTable from "./table";
import withActiveOrganization from "@/containers/withActiveOrganization";

const AgentSettings = () => {
  const t = useTranslations("settings.agent");

  return (
    <div className="page overflow-y-auto" id="agent-settings">
      <div className="border rounded-lg">
        <BreakTypesTable />
      </div>
    </div>
  );
};

export default withActiveOrganization(AgentSettings);
