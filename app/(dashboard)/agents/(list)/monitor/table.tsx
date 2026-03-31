"use client";

import { useEffect, useState } from "react";
import { columns } from "./columns";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import usersService from "@/services/users.service";
import { useTranslations } from "@/providers/TranslationProvider";
import MonitorUsersHead from "./head";
import PaginatedTable from "@/components/Table/PaginatedTable";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useSip } from "@/providers/webrtc/SipProvider";
import useAppStore from "@/store/app.slice";

const UsersMonitorTable = ({}) => {
  const t = useTranslations("users.monitor");
  const { extensionState, spy } = useSip();
  const { setWebrtcOpen } = useAppStore();

  const {
    data = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useLocalizedQuery({
    queryKey: ["monitor-users"],
    queryFn: async () => usersService.getUsersMonitor(),
    refetchInterval: 30000,
  });

  const onSpy = (ext: string) => {
    setWebrtcOpen(true);
    if (extensionState !== "connected") {
      toast.error("Error", {
        description: t("sipConnectionError"),
      });
      return;
    }
    spy(ext);
  };

  useEffect(() => {
    if (isError) {
      let message = "An unexpected error occurred";
      if (isAxiosError(error)) {
        message = error?.response?.data.message;
      } else {
        message = error?.message;
      }
      toast.error("Error fetching data", {
        description: message,
      });
      setTimeout(() => {
        refetch();
      }, 0);
    }
  }, [isError, error, refetch]);

  return (
    <div className="flex flex-col gap-0 h-full border rounded-xl">
      <PaginatedTable
        data={data || []}
        columns={columns(t)}
        manualPagination={false}
        meta={{
          onSpy,
        }}
      >
        <MonitorUsersHead />

        <PaginatedTableContent>
          <PaginatedTableHead />
          {isLoading && <PaginatedTableSkeleton />}
          {!isLoading && <PaginatedTableBody />}
        </PaginatedTableContent>
        {!isLoading && <PaginatedTablePagination />}
      </PaginatedTable>
    </div>
  );
};

export default UsersMonitorTable;
