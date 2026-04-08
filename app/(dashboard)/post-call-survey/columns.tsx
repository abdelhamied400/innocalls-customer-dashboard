"use client";

import { PostCallSurvey } from "@/types/api/post-call-survey";
import { useTranslations } from "@/providers/TranslationProvider";
import { ColumnDef } from "@tanstack/react-table";
import ActionsCell from "./cells/ActionsCell";
import CreatedAtCell from "./cells/CreatedAtCell";

export const columns = (
  t: ReturnType<typeof useTranslations>,
): ColumnDef<PostCallSurvey>[] => [
  {
    accessorKey: "name",
    header: t("columns.name"),
  },
  {
    accessorKey: "createdAt",
    header: t("columns.createdAt"),
    cell: CreatedAtCell,
  },
  {
    accessorKey: "actions",
    header: t("columns.actions"),
    cell: ActionsCell,
  },
];
