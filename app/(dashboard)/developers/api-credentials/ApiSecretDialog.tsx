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
import { useState, useRef, useEffect } from "react";

type ApiSecretDialogProps = {
  credentials: { apiId: string; apiSecret: string } | null;
  onClose: () => void;
};

const ApiSecretDialog = ({ credentials, onClose }: ApiSecretDialogProps) => {
  const t = useTranslations("developers.apiCredentials");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const displayedCredentials = useRef<{
    apiId: string;
    apiSecret: string;
  } | null>(null);

  useEffect(() => {
    if (credentials) {
      displayedCredentials.current = credentials;
      setIsOpen(true);
    }
  }, [credentials]);

  const handleCopy = async (value: string, field: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
    toast.success(t("messages.copiedToClipboard"));
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownload = () => {
    if (!displayedCredentials.current) return;
    const content = `API ID: ${displayedCredentials.current.apiId}\nAPI Secret: ${displayedCredentials.current.apiSecret}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "api-credentials.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(t("messages.downloaded"));
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setCopiedField(null);
      onClose();
    }, 200);
  };

  const creds = displayedCredentials.current;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("secretDialog.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("secretDialog.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-muted-foreground">
              {t("columns.apiId")}
            </label>
            <div className="flex items-center gap-2 p-3 bg-muted border rounded-lg">
              <code
                className="flex-1 text-sm font-mono break-all select-all"
                dir="ltr"
              >
                {creds?.apiId}
              </code>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={
                        copiedField === "apiId" ? "ghost-success" : "ghost"
                      }
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() =>
                        creds && handleCopy(creds.apiId, "apiId")
                      }
                    >
                      {copiedField === "apiId" ? (
                        <Check />
                      ) : (
                        <ContentCopy />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t("actions.copy")}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-muted-foreground">
              {t("columns.apiSecret")}
            </label>
            <div className="flex items-center gap-2 p-3 bg-muted border rounded-lg">
              <code
                className="flex-1 text-sm font-mono break-all select-all"
                dir="ltr"
              >
                {creds?.apiSecret}
              </code>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={
                        copiedField === "apiSecret"
                          ? "ghost-success"
                          : "ghost"
                      }
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() =>
                        creds &&
                        handleCopy(creds.apiSecret, "apiSecret")
                      }
                    >
                      {copiedField === "apiSecret" ? (
                        <Check />
                      ) : (
                        <ContentCopy />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t("actions.copy")}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        <AlertDialogFooter className="flex-row gap-2 sm:justify-between">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={handleDownload}>
                  <Download />
                  {t("actions.download")}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("actions.download")}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <AlertDialogAction onClick={handleClose}>
            {t("secretDialog.close")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ApiSecretDialog;
