"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import billingService from "@/services/billing.service";
import { Download, MonetizationOn } from "@mui/icons-material";
import { AxiosError } from "axios";
import { useTranslations } from "@/providers/TranslationProvider";
import { useState } from "react";
import { Tooltip } from "@mui/material";
import { Cell } from "@/types/cell";
import { Invoice } from "../columns";

const ActionsCell = ({ row }: Cell<Invoice>) => {
  const { toast } = useToast();
  const t = useTranslations("billing.invoices");
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const invoiceId = row.original.id;
  const status = row.original.status;

  const getInvoiceUrl = async () => {
    try {
      setIsLoading(true);
      const url = await billingService.getInvoiceUrl(invoiceId);
      window.open(url.toString(), "_blank");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          variant: "destructive",
          title: t("messages.error"),
          description:
            error.response?.data?.message || t("messages.unknownError"),
        });
      } else {
        toast({
          variant: "destructive",
          title: t("messages.error"),
          description:
            error instanceof Error ? error.message : t("messages.unknownError"),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const downloadFile = async () => {
    try {
      setIsDownloading(true);
      const url = await billingService.getInvoiceFileUrl(invoiceId);
      const link = document.createElement("a");
      link.href = url.toString();
      link.download = "file.pdf";
      link.click();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          variant: "destructive",
          title: t("messages.downloadError"),
          description:
            error.response?.data?.message || t("messages.unknownError"),
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error instanceof Error ? error.message : t("messages.unknownError"),
        });
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {status === "overdue" && (
        <Tooltip title={t("tooltips.pay")} arrow>
          <Button
            size="icon"
            variant="ghost-success"
            onClick={getInvoiceUrl}
            loading={isLoading}
          >
            <MonetizationOn className="h-4 w-4" />
          </Button>
        </Tooltip>
      )}

      {["paid", "overdue"].includes(status) && (
        <Tooltip title={t("tooltips.download")} arrow>
          <Button
            size="icon"
            variant="ghost"
            onClick={downloadFile}
            loading={isDownloading}
          >
            <Download className="h-4 w-4" />
          </Button>
        </Tooltip>
      )}
    </div>
  );
};

export default ActionsCell;
