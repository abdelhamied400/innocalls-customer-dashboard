"use client";

import { PostCallSurveyCdr } from "@/types/api/post-call-survey";
import { Cell } from "@/types/cell";

type AgentCellProps = Cell<PostCallSurveyCdr>;
const AgentCell = ({ row }: AgentCellProps) => {
  const cdr = row.original;

  if (cdr.agent) {
    return <span>{cdr.agent.name} ({cdr.agent.ext})</span>;
  }

  return <span>{cdr.ext}</span>;
};

export default AgentCell;
