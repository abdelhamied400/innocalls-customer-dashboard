"use client";

import { Call } from "@/types/api/call-reporting";
import { Cell } from "@/types/cell";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TranscriptionSummaryCell = ({ row }: Cell<Call>) => {
  const transcription = row.original.transcription;

  if (
    !transcription ||
    transcription.status === "pending" ||
    transcription.status === "processing" ||
    !transcription.summary
  ) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <p
            dir="auto"
            className="text-sm text-gray-700 truncate max-w-[200px] cursor-pointer"
          >
            {transcription.summary}
          </p>
        </TooltipTrigger>
        <TooltipContent className="max-w-md p-3">
          <p dir="auto" className="text-sm leading-relaxed whitespace-normal">
            {transcription.summary}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TranscriptionSummaryCell;
