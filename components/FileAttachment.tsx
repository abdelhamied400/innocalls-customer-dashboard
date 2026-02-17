"use client";
import { AttachFile, Download } from "@mui/icons-material";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type FileAttachmentProps = {
  fileName: string;
  fileType: string;
  onDownload: () => void;
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
      <div className="flex items-center flex-warp gap-2">
        <AttachFile />
        <p className="font-bold">{fileName}</p>
        <p className="">({fileType})</p>
      </div>
      <Button variant="unstyled" size="icon" onClick={onDownload}>
        <Download />
      </Button>
    </div>
  );
};

export default FileAttachment;
