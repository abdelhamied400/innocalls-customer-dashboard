"use client";

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
  AlertDialogX,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTranslations } from "@/providers/TranslationProvider";
import { OneTimeReport } from "@/types/api/report";
import { DeleteOutline } from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";
import { CellContext } from "@tanstack/react-table";
import { useState } from "react";

const ActionsCell = ({ row }: CellContext<OneTimeReport, unknown>) => {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const t = useTranslations("reports.oneTime");

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      // TODO: Call delete API when available
      // await reportsService.deleteReport(row.original.id);

      // Optimistic update
      queryClient.setQueryData<OneTimeReport[]>(["one-time-reports"], (oldData) => {
        if (!oldData) return oldData;
        return oldData.filter((report) => report.id !== row.original.id);
      });

      toast.success(t("messages.deleteSuccess"));

      queryClient.invalidateQueries({ queryKey: ["one-time-reports"] });
    } catch (error) {
      toast.error(t("messages.deleteFailed"));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={isDeleting}
            loading={isDeleting}
          >
            <DeleteOutline className="text-gray-500" />
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmations.deleteTitle")}</AlertDialogTitle>
            <AlertDialogX />
            <AlertDialogDescription>
              {t("confirmations.deleteDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("confirmations.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              {t("confirmations.yesDelete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ActionsCell;
