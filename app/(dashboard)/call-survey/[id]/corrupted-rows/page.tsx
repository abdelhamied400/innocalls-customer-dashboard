"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "@/providers/TranslationProvider";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle } from "@/components/ui/alert";
import Field from "@/components/ui/field";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Warning, Close, DeleteOutline, Check } from "@mui/icons-material";
import { PaginationState } from "@tanstack/react-table";
import callSurveyService from "@/services/call-survey.service";
import { CorruptedRowSchema } from "@/validation/CorruptedRowSchema";

type RowEditState = Record<string, { name: string; phone: string }>;
type RowErrorState = Record<string, Record<string, string>>;

const CorruptedRowsPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const t = useTranslations("callSurvey.corruptedRows");
  const queryClient = useQueryClient();
  const [editModels, setEditModels] = useState<RowEditState>({});
  const [editErrors, setEditErrors] = useState<RowErrorState>({});
  const [fixingRowId, setFixingRowId] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, refetch } = useLocalizedQuery({
    queryKey: ["call-survey-corrupted-rows", id, pagination],
    queryFn: () =>
      callSurveyService.fetchCorruptedRows(
        id,
        pagination.pageIndex + 1,
        pagination.pageSize,
      ),
    enabled: !!id,
    gcTime: 0,
  });

  // Initialize edit models from data
  const getEditModel = (rowId: string, row: { name: string; phone: string }) =>
    editModels[rowId] || { name: row.name, phone: row.phone };

  const updateEditModel = (
    rowId: string,
    field: "name" | "phone",
    value: string,
    originalRow: { name: string; phone: string },
  ) => {
    setEditModels((prev) => {
      const current = prev[rowId] || { name: originalRow.name, phone: originalRow.phone };
      return { ...prev, [rowId]: { ...current, [field]: value } };
    });
    setEditErrors((prev) => ({
      ...prev,
      [rowId]: { ...prev[rowId], [field]: "" },
    }));
  };

  const handleFix = async (
    rowId: string,
    originalRow: { name: string; phone: string },
  ) => {
    const model = getEditModel(rowId, originalRow);
    const schema = CorruptedRowSchema(t);
    const result = schema.safeParse(model);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setEditErrors((prev) => ({ ...prev, [rowId]: fieldErrors }));
      return;
    }

    try {
      setFixingRowId(rowId);
      await callSurveyService.fixCorruptedRow(id, rowId, model);
      toast.success(t("toasts.fixed"), {
        description: t("toasts.fixedDescription"),
      });
      refetch();
      queryClient.invalidateQueries({
        queryKey: ["call-survey-active-list"],
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("toasts.error"), {
          description:
            error.response?.data?.message || t("toasts.errorDescription"),
        });
        return;
      }
      toast.error(t("toasts.error"), {
        description: t("toasts.errorDescription"),
      });
    } finally {
      setFixingRowId(null);
    }
  };

  const handleIgnoreAll = async () => {
    try {
      await callSurveyService.ignoreAllCorrupted(id);
      toast.success(t("toasts.ignored"), {
        description: t("toasts.ignoredDescription"),
      });
      queryClient.invalidateQueries({
        queryKey: ["call-survey-active-list"],
      });
      router.replace("/call-survey/active");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("toasts.error"), {
          description:
            error.response?.data?.message || t("toasts.errorDescription"),
        });
        return;
      }
      toast.error(t("toasts.error"), {
        description: t("toasts.errorDescription"),
      });
    }
  };

  const handleCancel = async () => {
    try {
      await callSurveyService.cancelSurvey(id);
      toast.success(t("toasts.cancelled"), {
        description: t("toasts.cancelledDescription"),
      });
      queryClient.invalidateQueries({
        queryKey: ["call-survey-active-list"],
      });
      router.replace("/call-survey/active");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("toasts.error"), {
          description:
            error.response?.data?.message || t("toasts.errorDescription"),
        });
        return;
      }
      toast.error(t("toasts.error"), {
        description: t("toasts.errorDescription"),
      });
    }
  };

  const totalItems = data?.totalItems || 0;
  const totalPages = data?.totalPages || 0;

  return (
    <div className="page flex flex-col gap-4">
      {/* Header: Alert + Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Alert variant="warning" className="flex-1">
          <Warning />
          <AlertTitle>
            {t("alertPrefix")}{" "}
            <strong>{t("alertCount", { count: totalItems })}</strong>{" "}
            {t("alertSuffix")}
          </AlertTitle>
        </Alert>

        <div className="flex items-center gap-2 shrink-0">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="outline">
                <DeleteOutline sx={{ fontSize: 16 }} className="me-1" />
                {t("actions.ignoreAll")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("actions.ignoreAll")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("confirmations.ignoreAll")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("actions.dismiss")}</AlertDialogCancel>
                <AlertDialogAction onClick={handleIgnoreAll}>
                  {t("actions.ignoreAll")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="destructive">
                <Close sx={{ fontSize: 16 }} className="me-1" />
                {t("actions.cancel")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("actions.cancel")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("confirmations.cancel")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("actions.dismiss")}</AlertDialogCancel>
                <AlertDialogAction onClick={handleCancel}>
                  {t("actions.cancel")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Corrupted Rows List */}
      <div className="flex flex-col gap-3">
        {isLoading &&
          [...Array(3)].map((_, i) => (
            <div
              key={i}
              className="border rounded-lg p-4 h-32 animate-pulse bg-neutral-100"
            />
          ))}

        {!isLoading &&
          data?.corruptedRows.map((row) => {
            const model = getEditModel(row.id, row.row);
            const errors = editErrors[row.id] || {};
            const isFixingThis = fixingRowId === row.id;

            return (
              <div
                key={row.id}
                className="border rounded-lg p-4 flex flex-col gap-3"
              >
                {/* Error reasons */}
                <Alert variant="destructive">
                  <Warning />
                  <AlertTitle>{row.reasons.join(". ")}</AlertTitle>
                </Alert>

                {/* Inline form */}
                <div className="flex flex-col sm:flex-row items-end gap-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 w-full">
                    <Field label={t("form.name.label")} error={errors.name}>
                      <Input
                        variant="field"
                        placeholder={t("form.name.placeholder")}
                        value={model.name}
                        onChange={(e) =>
                          updateEditModel(row.id, "name", e.target.value, row.row)
                        }
                      />
                    </Field>
                    <Field label={t("form.phone.label")} error={errors.phone}>
                      <Input
                        variant="field"
                        placeholder={t("form.phone.placeholder")}
                        value={model.phone}
                        onChange={(e) =>
                          updateEditModel(row.id, "phone", e.target.value, row.row)
                        }
                      />
                    </Field>
                  </div>
                  <Button
                    type="button"
                    onClick={() => handleFix(row.id, row.row)}
                    disabled={isFixingThis}
                  >
                    <Check sx={{ fontSize: 16 }} className="me-1" />
                    {t("form.fix")}
                  </Button>
                </div>
              </div>
            );
          })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pagination.pageIndex === 0}
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                pageIndex: prev.pageIndex - 1,
              }))
            }
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            {pagination.pageIndex + 1} / {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pagination.pageIndex >= totalPages - 1}
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                pageIndex: prev.pageIndex + 1,
              }))
            }
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default CorruptedRowsPage;
