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
import freshdeskCredentialService from "@/services/freshdesk-credential.service";
import { FreshdeskCredential } from "@/types/api/freshdesk-credential";
import { Delete, RestoreFromTrash } from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState } from "react";

type FreshdeskActionsCellProps = {
  credential: FreshdeskCredential;
};

const FreshdeskActionsCell = ({ credential }: FreshdeskActionsCellProps) => {
  const queryClient = useQueryClient();
  const [isToggling, setIsToggling] = useState(false);
  const t = useTranslations("developers.freshdesk");

  const handleToggle = async () => {
    try {
      setIsToggling(true);
      if (credential.isDeleted) {
        await freshdeskCredentialService.restore(credential.id);
      } else {
        await freshdeskCredentialService.delete(credential.id);
      }

      queryClient.setQueryData<FreshdeskCredential[]>(
        ["freshdesk-credentials"],
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.map((c) =>
            c.id === credential.id
              ? { ...c, isDeleted: !credential.isDeleted }
              : c,
          );
        },
      );

      toast.success(
        credential.isDeleted
          ? t("messages.restored")
          : t("messages.deleted"),
      );

      queryClient.invalidateQueries({ queryKey: ["freshdesk-credentials"] });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("messages.toggleFailed"), {
          description: error.response?.data?.message,
        });
      } else {
        toast.error(t("messages.toggleFailed"));
      }
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex gap-2">
        <AlertDialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button
                  variant={
                    credential.isDeleted ? "ghost-success" : "ghost"
                  }
                  size="icon"
                  className={credential.isDeleted ? "" : "text-red-500 hover:text-red-600"}
                  disabled={isToggling}
                  loading={isToggling}
                >
                  {credential.isDeleted ? <RestoreFromTrash /> : <Delete />}
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              {credential.isDeleted
                ? t("actions.restore")
                : t("actions.delete")}
            </TooltipContent>
          </Tooltip>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {credential.isDeleted
                  ? t("confirmations.restoreTitle")
                  : t("confirmations.deleteTitle")}
              </AlertDialogTitle>
              <AlertDialogX />
              <AlertDialogDescription>
                {credential.isDeleted
                  ? t("confirmations.restoreDescription")
                  : t("confirmations.deleteDescription")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {t("confirmations.cancel")}
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleToggle}>
                {credential.isDeleted
                  ? t("confirmations.yesRestore")
                  : t("confirmations.yesDelete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
};

export default FreshdeskActionsCell;
