import React, { useState, useMemo } from "react";
import { Search } from "@mui/icons-material";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useVocab } from "@/hooks/useVocab";
import { useTranslations } from "@/providers/TranslationProvider";

type Option = {
  value: string;
  label: string;
};

interface AgentsPickerProps {
  selectedAgents: Option[];
  onAgentsChange: (agents: Option[]) => void;
  placeholder?: string;
}

const AgentsPicker = ({
  selectedAgents,
  onAgentsChange,
  placeholder,
}: AgentsPickerProps) => {
  const { extensions } = useVocab();
  const tCommon = useTranslations("analytics.common");
  const [agentSearch, setAgentSearch] = useState("");

  // Filter extensions based on search
  const filteredExtensions = useMemo(() => {
    return (
      extensions?.filter(
        (ext) =>
          ext.name.toLowerCase().includes(agentSearch.toLowerCase()) ||
          ext.ext.toLowerCase().includes(agentSearch.toLowerCase())
      ) || []
    );
  }, [extensions, agentSearch]);

  const handleAgentToggle = (ext: { ext: string; name: string }) => {
    const isChecked = selectedAgents.some((agent) => agent.value === ext.ext);
    const newAgents = isChecked
      ? selectedAgents.filter((agent) => agent.value !== ext.ext)
      : [
          ...selectedAgents,
          {
            value: ext.ext,
            label: `${ext.name} (${ext.ext})`,
          },
        ];
    onAgentsChange(newAgents);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Input
          placeholder={placeholder || tCommon("form.fields.agents.placeholder")}
          value={agentSearch}
          onChange={(e) => setAgentSearch(e.target.value)}
          className="pe-10"
        />
        <Search className="absolute end-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      </div>
      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
        {filteredExtensions.map((ext) => (
          <div
            key={ext.ext}
            className="flex items-center gap-2 border-b last:border-0 py-1"
          >
            <Checkbox
              id={`agent-${ext.ext}`}
              checked={selectedAgents.some((agent) => agent.value === ext.ext)}
              onCheckedChange={() => handleAgentToggle(ext)}
            />
            <Label
              htmlFor={`agent-${ext.ext}`}
              className="text-sm font-normal cursor-pointer"
            >
              {ext.name} ({ext.ext})
            </Label>
          </div>
        ))}
        {filteredExtensions.length === 0 &&
          extensions &&
          extensions.length > 0 && (
            <p className="text-sm text-gray-500">
              No agents match your search.
            </p>
          )}
        {extensions?.length === 0 && (
          <p className="text-sm text-gray-500">
            {tCommon("form.fields.agents.noOptions")}
          </p>
        )}
      </div>
    </div>
  );
};

export default AgentsPicker;
