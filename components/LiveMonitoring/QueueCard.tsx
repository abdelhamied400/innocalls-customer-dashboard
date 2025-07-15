import { Call, HourglassBottom, Support } from "@mui/icons-material";
import { cva, VariantProps } from "class-variance-authority";
import QueueSummaryStatsCard from "./QueueSummaryStatsCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import QueueCallCard from "./QueueCallCard";

// Variants using cva
const queueCardVariants = cva(
  "queue-card border bg-white p-2 rounded-lg hover:border-gray-300 transition-colors group/queue-card",
  {
    variants: {
      variant: {
        default: "bg-gray-100",
      },
      color: {
        default: "",
        primary: "border-br-red-400",
      },
    },
    defaultVariants: {
      variant: "default",
      color: "default",
    },
  }
);

const queueCardIconVariants = cva("icon transition-colors rounded-full p-1", {
  variants: {
    color: {
      default:
        "bg-gray-100 text-gray-500 group-hover/queue-card:bg-gray-500 group-hover/queue-card:text-white",
      primary:
        "bg-blue-100 text-blue-500 group-hover/queue-card:bg-blue-500 group-hover/queue-card:text-white",
    },
  },
  defaultVariants: {
    color: "default",
  },
});

const queueCardValueVariants = cva("font-bold", {
  variants: {
    color: {
      default: "text-gray-700",
      primary: "text-blue-500",
    },
  },
  defaultVariants: {
    color: "default",
  },
});

type QueueCardProps = VariantProps<typeof queueCardVariants> & {
  title?: string;
  subtitle?: string;
  sla?: string;
  activeCount?: number;
  waitingCount?: number;
  activeCalls?: Array<{
    phoneNumber: string;
    agentName: string;
    status: "active" | "waiting";
    callDuration: string;
  }>;
  waitingCalls?: Array<{
    phoneNumber: string;
    agentName: string;
    status: "active" | "waiting";
    callDuration: string;
  }>;
};

const QueueCard = ({
  variant = "default",
  color = "primary",
  title,
  subtitle,
  sla,
  activeCount,
  waitingCount,
  activeCalls = [],
  waitingCalls = [],
}: QueueCardProps) => {
  return (
    <div className={queueCardVariants({ variant, color })}>
      <div className="head flex justify-between items-center gap-1">
        <div className="flex items-center gap-2">
          <div className={queueCardIconVariants({ color })}>
            <Support />
          </div>
          <div className="details">
            <h3 className="font-semibold">{title ?? "Support"}</h3>
            <p className="text-sm">
              {activeCount !== undefined
                ? `${activeCount} active call${activeCount === 1 ? "" : "s"}`
                : `${activeCalls.length} active call${
                    activeCalls.length === 1 ? "" : "s"
                  }`}
            </p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
        </div>
        <div className="sla">
          <h3 className={queueCardValueVariants({ color })}>{sla ?? "99%"}</h3>
          <p>SLA</p>
        </div>
      </div>

      <div className="queue-stats grid grid-cols-2 gap-1">
        <QueueSummaryStatsCard
          label="In Progress"
          count={activeCount ?? activeCalls.length}
          unit="calls"
          color="success"
        />
        <QueueSummaryStatsCard
          label="Waiting"
          count={waitingCount ?? waitingCalls.length}
          unit="calls"
          color="warning"
        />
      </div>

      <div className="active-calls">
        <Accordion
          type="multiple"
          defaultValue={["active-calls", "waiting-calls"]}
        >
          <AccordionItem value="active-calls">
            <AccordionTrigger className="flex items-center">
              <div className="flex gap-2 items-center">
                <span className="block w-4 h-4 bg-green-500 rounded-full animate-pulse"></span>
                <span>
                  Active Calls (
                  {activeCount !== undefined ? activeCount : activeCalls.length}
                  )
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-2 flex flex-col gap-2 max-h-60 overflow-y-auto">
              {activeCalls.length > 0 ? (
                activeCalls.map((call, idx) => (
                  <QueueCallCard
                    key={idx}
                    phoneNumber={call.phoneNumber}
                    agentName={call.agentName}
                    status={call.status}
                    callDuration={call.callDuration}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-400 p-4 h-40 flex flex-col justify-center items-center border rounded-lg">
                  <div className="p-2 bg-gray-200 rounded-full">
                    <Call />
                  </div>
                  <span>No active calls</span>
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="waiting-calls">
            <AccordionTrigger className="flex items-center">
              <div className="flex gap-2 items-center">
                <span className="block w-4 h-4 bg-warning-500 rounded-full animate-pulse"></span>
                <span>
                  Waiting Calls (
                  {waitingCount !== undefined
                    ? waitingCount
                    : waitingCalls.length}
                  )
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-2 flex flex-col gap-2 max-h-60 overflow-y-auto">
              {waitingCalls.length > 0 ? (
                waitingCalls.map((call, idx) => (
                  <QueueCallCard
                    key={idx}
                    phoneNumber={call.phoneNumber}
                    agentName={call.agentName}
                    status={call.status}
                    callDuration={call.callDuration}
                    variant="warning"
                  />
                ))
              ) : (
                <p className="text-sm text-gray-400 p-4 h-40 flex flex-col justify-center items-center border rounded-lg">
                  <div className="p-2 bg-gray-200 rounded-full">
                    <HourglassBottom />
                  </div>
                  <span>No waiting calls</span>
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default QueueCard;
