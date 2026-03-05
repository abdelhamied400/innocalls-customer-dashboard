"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "@/providers/TranslationProvider";
import { Check, ContentCopy, Download } from "@mui/icons-material";
import { toast } from "sonner";
import { useState } from "react";

type ApiKeyDialogProps = {
  apiKey: string | null;
  onClose: () => void;
};

const ApiKeyDialog = ({ apiKey, onClose }: ApiKeyDialogProps) => {
  const t = useTranslations("developers.freshdesk");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!apiKey) return;
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast.success(t("messages.copiedToClipboard"));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!apiKey) return;
    const blob = new Blob([apiKey], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "freshdesk-api-key.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(t("messages.downloaded"));
  };

  const handleClose = () => {
    setCopied(false);
    onClose();
  };

  return (
    <AlertDialog open={!!apiKey} onOpenChange={(open) => !open && handleClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("apiKeyDialog.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("apiKeyDialog.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted-foreground">
            {t("columns.apiKey")}
          </label>
          <div className="flex items-center gap-2 p-3 bg-muted border rounded-lg">
            <code className="flex-1 text-sm font-mono break-all select-all">
              {apiKey}
            </code>
            <div className="flex items-center gap-1 shrink-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={copied ? "ghost-success" : "ghost"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleCopy}
                    >
                      {copied ? <Check /> : <ContentCopy />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {copied ? t("messages.copiedToClipboard") : t("actions.copy")}
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleDownload}
                    >
                      <Download />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t("actions.download")}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogAction onClick={handleClose}>
            {t("apiKeyDialog.close")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ApiKeyDialog;
