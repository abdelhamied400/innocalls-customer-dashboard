"use client";
import { AttachFile, Download } from "@mui/icons-material";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

type FileAttachmentProps = {
  fileName: string;
  fileType: string;
  onDownload?: () => void;
  className?: string;
};

const FileAttachment = ({
  fileName,
  fileType,
  onDownload,
  className,
}: FileAttachmentProps) => {
  return (
    <div
      className={cn(
        "attachment bg-neutral-100 rounded-lg p-2 flex justify-between items-center",
        className,
      )}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <AttachFile />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="truncate min-w-0">
                <span className="font-bold">{fileName}</span> ({fileType})
              </p>
            </TooltipTrigger>
            <TooltipContent>
              {fileName} ({fileType})
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {onDownload && (
        <Button variant="unstyled" size="icon" onClick={onDownload}>
          <Download />
        </Button>
      )}
    </div>
  );
};

export default FileAttachment;
