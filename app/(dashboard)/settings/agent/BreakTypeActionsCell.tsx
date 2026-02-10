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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useTranslations } from "@/providers/TranslationProvider";
import breakTypesService from "@/services/break-types.service";
import { BreakType } from "@/types/api/break-type";
import { Delete, Edit, Restore } from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import Link from "next/link";
import { useState } from "react";

type BreakTypeActionsCellProps = {
  breakType: BreakType;
};

const BreakTypeActionsCell = ({ breakType }: BreakTypeActionsCellProps) => {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const t = useTranslations("settings.agent.breaks");

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await breakTypesService.deleteBreakType(breakType.id);

      // Optimistic update
      queryClient.setQueryData<BreakType[]>(["break-types"], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((bt) =>
          bt.id === breakType.id ? { ...bt, isDeleted: true } : bt,
        );
      });

      toast.success(t("messages.deleteSuccess"));

      queryClient.invalidateQueries({ queryKey: ["break-types"] });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("messages.deleteFailed"), {
          description: error.response?.data?.message,
        });
      } else {
        toast.error(t("messages.deleteFailed"));
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestore = async () => {
    try {
      setIsRestoring(true);
      await breakTypesService.restoreBreakType(breakType.id);

      // Optimistic update
      queryClient.setQueryData<BreakType[]>(["break-types"], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((bt) =>
          bt.id === breakType.id ? { ...bt, isDeleted: false } : bt,
        );
      });

      toast.success(t("messages.restoreSuccess"));

      queryClient.invalidateQueries({ queryKey: ["break-types"] });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("messages.restoreFailed"), {
          description: error.response?.data?.message,
        });
      } else {
        toast.error(t("messages.restoreFailed"));
      }
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={`/settings/agent/edit-break?id=${breakType.id}`}>
              <Button variant="ghost" size="icon" className="text-gray-400">
                <Edit />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>{t("actions.edit")}</TooltipContent>
        </Tooltip>

        {breakType.isDeleted ? (
          <AlertDialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost-success"
                    size="icon"
                    disabled={isRestoring}
                    loading={isRestoring}
                  >
                    <Restore />
                  </Button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent>{t("actions.restore")}</TooltipContent>
            </Tooltip>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t("confirmations.restoreTitle", { name: breakType.nameEN })}
                </AlertDialogTitle>
                <AlertDialogX />
                <AlertDialogDescription>
                  {t("confirmations.restoreDescription")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {t("confirmations.cancel")}
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleRestore}>
                  {t("confirmations.yesRestore")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <AlertDialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost-destructive"
                    size="icon"
                    disabled={isDeleting}
                    loading={isDeleting}
                  >
                    <Delete />
                  </Button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent>{t("actions.delete")}</TooltipContent>
            </Tooltip>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t("confirmations.deleteTitle", { name: breakType.nameEN })}
                </AlertDialogTitle>
                <AlertDialogX />
                <AlertDialogDescription>
                  {t("confirmations.deleteDescription")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {t("confirmations.cancel")}
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  {t("confirmations.yesDelete")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </TooltipProvider>
  );
};

export default BreakTypeActionsCell;
