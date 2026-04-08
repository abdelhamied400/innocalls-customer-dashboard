"use client";

import { PaginationState } from "@tanstack/react-table";
import { useState } from "react";
import { columns } from "./columns";
import PaginatedTable from "@/components/Table/PaginatedTable";
import PostCallSurveyHead from "./head";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import postCallSurveyService from "@/services/post-call-survey.service";
import { useTranslations } from "@/providers/TranslationProvider";

const PostCallSurveyTable = () => {
  const t = useTranslations("postCallSurvey");
  const [name, setName] = useState("");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: response, isLoading } = useLocalizedQuery({
    queryKey: ["post-call-surveys", pagination.pageIndex, pagination.pageSize, name],
    queryFn: () =>
      postCallSurveyService.fetchAll({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        name: name || undefined,
      }),
  });

  const data = response?.data?.surveys ?? [];
  const totalItems = response?.data?.totalItems ?? 0;
  const totalPages = response?.data?.totalPages ?? 1;

  const handleNameChange = (value: string) => {
    setName(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  return (
    <div className="h-full flex flex-col">
      <PaginatedTable
        data={data}
        columns={columns(t)}
        pagination={{
          totalItems,
          totalPages,
          from: totalItems > 0 ? pagination.pageIndex * pagination.pageSize + 1 : 0,
          to: Math.min(
            (pagination.pageIndex + 1) * pagination.pageSize,
            totalItems,
          ),
        }}
        paginationState={pagination}
        onPaginationChange={setPagination}
      >
        <PostCallSurveyHead name={name} onNameChange={handleNameChange} />
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

export default PostCallSurveyTable;
