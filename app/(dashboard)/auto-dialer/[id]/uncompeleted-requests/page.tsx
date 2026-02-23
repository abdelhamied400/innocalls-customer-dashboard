"use client";
import withPermission from "@/containers/withPermission";

import { useState } from "react";
import { useParams } from "next/navigation";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { FileDownload } from "@mui/icons-material";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/providers/TranslationProvider";
import autoDialerService from "@/services/auto-dialer.service";
import UncompletedRequestsTable from "./table";

const UncompletedRequests = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations("autoDialer.uncompletedRequests");
  const [isExporting, setIsExporting] = useState(false);

  const onExport = async () => {
    try {
      setIsExporting(true);
      await autoDialerService.exportUncompletedRequests(id);
      toast.success(t("exportSuccess"), {
        description: t("exportSuccessDescription"),
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("exportError"), {
          description:
            error.response?.data?.message || t("exportErrorDescription"),
        });
        return;
      }
      toast.error(t("exportError"), {
        description: t("exportErrorDescription"),
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="page" id="uncompleted-requests">
      <div className="bg-white p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h1 className="page-title">{t("title")}</h1>
          <Button onClick={onExport} disabled={isExporting}>
            <FileDownload />
            {t("export")}
          </Button>
        </div>
        <UncompletedRequestsTable />
      </div>
    </div>
  );
};

export default withPermission(UncompletedRequests, "fullAccessAutoDialerCampaigns");
