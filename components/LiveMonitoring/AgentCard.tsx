import { cva, VariantProps } from "class-variance-authority";

const agentCardVariants = cva(
  "rounded-lg border p-2 hover:shadow-md transition-all duration-200 group",
  {
    variants: {
      status: {
        onCall:
          "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 hover:border-blue-500",
        idle: "bg-gradient-to-r from-green-50 to-green-100 border-green-200 hover:border-green-500",
        onBreak:
          "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 hover:border-yellow-500",
      },
    },
    defaultVariants: {
      status: "idle",
    },
  }
);

const agentInitialsVariants = cva(
  "w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold transition-colors",
  {
    variants: {
      status: {
        onCall: "bg-blue-500 text-white",
        idle: "bg-green-500 text-white",
        onBreak: "bg-yellow-500 text-white",
      },
    },
    defaultVariants: {
      status: "idle",
    },
  }
);

const agentNameVariants = cva("text-sm font-medium truncate", {
  variants: {
    status: {
      onCall: "text-blue-700",
      idle: "text-green-700",
      onBreak: "text-yellow-700",
    },
  },
  defaultVariants: {
    status: "idle",
  },
});

type AgentCardProps = {
  name: string;
  initials: string;
  extension: string | number;
  calls: number;
  avgTime: string;
  status?: VariantProps<typeof agentCardVariants>["status"];
};

const AgentCard: React.FC<AgentCardProps> = ({
  name,
  initials,
  extension,
  calls,
  avgTime,
  status = "idle",
}) => {
  return (
    <div className={agentCardVariants({ status })}>
      <div className="flex items-center gap-2 mb-1">
        <div className={agentInitialsVariants({ status })}>
          <span className="text-xs transition-colors">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={agentNameVariants({ status })}>{name}</h4>
          <p className="text-[10px] text-gray-600">Ext: {extension}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1 text-[10px]">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Calls</span>
          <span className="font-semibold text-gray-900">{calls}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Avg Time</span>
          <span className="font-semibold text-gray-900">{avgTime}</span>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;
