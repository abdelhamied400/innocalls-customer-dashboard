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

const PhoneHistoryModal = ({
  open,
  onOpenChange,
  phoneNumber,
}: PhoneHistoryModalProps) => {
  const [data, setData] = useState<PhoneHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
            err?.response?.data?.message ||
              err.message ||
              "Failed to fetch phone history."
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
      return <EmptyState />;
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
          <Add className="!w-4" /> / <Remove className="!w-4" /> Click a row to
          expand/collapse call details
        </div>
      </PaginatedTable>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[80vw] max-w-[80vw] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Phone History for {phoneNumber}</DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default PhoneHistoryModal;
