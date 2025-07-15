import AgentCard from "@/components/LiveMonitoring/AgentCard";
import StatsDetailedCard from "@/components/StatsDetailedCard";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Group } from "@mui/icons-material";

const Agents = () => {
  return (
    <div className="agents sticky top-0">
      <StatsDetailedCard
        title="Agents"
        subtitle="Live status & performance"
        value="10"
        valueSubtitle="Total"
        icon={<Group />}
        color="primary"
      >
        <div className="max-h-[calc(100vh-280px)] overflow-y-auto pe-1">
          <Accordion
            type="multiple"
            defaultValue={["idle", "onCall", "onBreak"]}
          >
            <AccordionItem value="idle">
              <AccordionTrigger className="flex items-center justify-between">
                <span className="text-lg font-semibold">Idle Agents</span>
                <span className="text-sm text-gray-500">1</span>
              </AccordionTrigger>
              <AccordionContent className="p-2 flex flex-col gap-2 max-h-[150px] overflow-y-auto">
                <AgentCard
                  name="John Doe"
                  status="idle"
                  avgTime="5:30"
                  calls={12}
                  extension={"1234"}
                  initials="JD"
                />
                <AgentCard
                  name="John Doe"
                  status="idle"
                  avgTime="5:30"
                  calls={12}
                  extension={"1234"}
                  initials="JD"
                />
                <AgentCard
                  name="John Doe"
                  status="idle"
                  avgTime="5:30"
                  calls={12}
                  extension={"1234"}
                  initials="JD"
                />
                <AgentCard
                  name="John Doe"
                  status="idle"
                  avgTime="5:30"
                  calls={12}
                  extension={"1234"}
                  initials="JD"
                />
                <AgentCard
                  name="John Doe"
                  status="idle"
                  avgTime="5:30"
                  calls={12}
                  extension={"1234"}
                  initials="JD"
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="onCall">
              <AccordionTrigger className="flex items-center justify-between">
                <span className="text-lg font-semibold">On Call Agents</span>
                <span className="text-sm text-gray-500">1</span>
              </AccordionTrigger>
              <AccordionContent className="p-2 flex flex-col gap-2 max-h-[150px] overflow-y-auto">
                <AgentCard
                  name="Jane Smith"
                  status="onCall"
                  avgTime="8:15"
                  calls={8}
                  extension={"5678"}
                  initials="JS"
                />
                <AgentCard
                  name="Jane Smith"
                  status="onCall"
                  avgTime="8:15"
                  calls={8}
                  extension={"5678"}
                  initials="JS"
                />
                <AgentCard
                  name="Jane Smith"
                  status="onCall"
                  avgTime="8:15"
                  calls={8}
                  extension={"5678"}
                  initials="JS"
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="onBreak">
              <AccordionTrigger className="flex items-center justify-between">
                <span className="text-lg font-semibold">On Break Agents</span>
                <span className="text-sm text-gray-500">1</span>
              </AccordionTrigger>
              <AccordionContent className="p-2 flex flex-col gap-2 max-h-[150px] overflow-y-auto">
                <AgentCard
                  name="Alice Johnson"
                  status="onBreak"
                  avgTime="3:45"
                  calls={5}
                  extension={"9101"}
                  initials="AJ"
                />
                <AgentCard
                  name="Alice Johnson"
                  status="onBreak"
                  avgTime="3:45"
                  calls={5}
                  extension={"9101"}
                  initials="AJ"
                />
                <AgentCard
                  name="Alice Johnson"
                  status="onBreak"
                  avgTime="3:45"
                  calls={5}
                  extension={"9101"}
                  initials="AJ"
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </StatsDetailedCard>
    </div>
  );
};

export default Agents;
