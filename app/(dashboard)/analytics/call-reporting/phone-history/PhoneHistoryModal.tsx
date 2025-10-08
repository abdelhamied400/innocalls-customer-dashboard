import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PaginatedTable from "@/components/Table/PaginatedTable";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import { ChevronDown } from "lucide-react";
import callReportingService from "@/services/call-reporting.service";
import {
  PhoneHistoryResponse,
  PhoneHistoryItem,
} from "@/types/api/call-reporting";
import { usePhoneHistoryColumns } from "./hooks";
import {
  PhoneHistoryTableBody,
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
} from "./components";
import { PhoneHistoryModalProps } from "./types";
import { Add, Remove } from "@mui/icons-material";
import { useTranslations } from "@/providers/TranslationProvider";
import NoData from "@/components/Analytics/NoData";

const PhoneHistoryModal = ({
  open,
  onOpenChange,
  phoneNumber,
}: PhoneHistoryModalProps) => {
  const [data, setData] = useState<PhoneHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const t = useTranslations("callReporting.phoneHistory");

  const columns = usePhoneHistoryColumns();

  useEffect(() => {
    if (open && phoneNumber) {
      setLoading(true);
      setError(null);
      callReportingService
        .getPhoneHistory(encodeURIComponent(phoneNumber))
        .then((res: PhoneHistoryResponse) => {
          setData(res.callsHistory || []);
        })
        .catch((err) => {
          setError(
            err?.response?.data?.message || err.message || t("states.error")
          );
        })
        .finally(() => setLoading(false));
    }
    if (!open) {
      setData([]);
      setExpanded(null);
      setError(null);
    }
  }, [open, phoneNumber]);

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <ErrorMessage message={error} />;
    }

    if (data.length === 0) {
      return <NoData />;
    }

    return (
      <PaginatedTable
        data={data}
        columns={columns}
        pagination={{
          totalItems: data.length,
          totalPages: Math.ceil(data.length / 10),
        }}
        manualPagination={false}
      >
        <PaginatedTableContent>
          <PaginatedTableHead />
          <PhoneHistoryTableBody
            data={data}
            expanded={expanded}
            setExpanded={setExpanded}
            columns={columns}
          />
        </PaginatedTableContent>
        <PaginatedTablePagination />
        <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
          <Add className="!w-4" /> / <Remove className="!w-4" />{" "}
          {t("actions.clickToToggle")}
        </div>
      </PaginatedTable>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[80vw] max-w-[80vw] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {t("title", { phoneNumber: `\u200E  ${phoneNumber}` })}
          </DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default PhoneHistoryModal;
