"use client";
import PaginatedTable from "@/components/Table/PaginatedTable";
import PaginatedTableBody from "@/components/Table/PaginatedTableBody";
import PaginatedTableContent from "@/components/Table/PaginatedTableContent";
import PaginatedTableHead from "@/components/Table/PaginatedTableHead";
import PaginatedTablePagination from "@/components/Table/PaginatedTablePagination";
import PaginatedTableSkeleton from "@/components/Table/PaginatedTableSkeleton";
import { columns } from "./columns";
import { useTranslations } from "@/providers/TranslationProvider";
import TagsTableHead from "./head";
import { useQuery } from "@tanstack/react-query";
import vocabService from "@/services/vocab.service";

const TagsTable = () => {
  const t = useTranslations();
  const { data: tags = [], isLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: vocabService.getAllTags,
  });

  return (
    <div className="border rounded-lg">
      <PaginatedTable data={tags} columns={columns(t)} manualPagination={false}>
        <TagsTableHead />
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

export default TagsTable;
