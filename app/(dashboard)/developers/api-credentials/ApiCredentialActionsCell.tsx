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
import apiCredentialService from "@/services/api-credential.service";
import { ApiCredential } from "@/types/api/api-credential";
import { Delete, RestoreFromTrash, Edit } from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState } from "react";
import ApiCredentialDialog from "./ApiCredentialDialog";

type ApiCredentialActionsCellProps = {
  credential: ApiCredential;
};

const ApiCredentialActionsCell = ({
  credential,
}: ApiCredentialActionsCellProps) => {
  const queryClient = useQueryClient();
  const [isToggling, setIsToggling] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const t = useTranslations("developers.apiCredentials");

  const handleToggle = async () => {
    try {
      setIsToggling(true);
      if (credential.isDeleted) {
        await apiCredentialService.restore(credential.id);
      } else {
        await apiCredentialService.delete(credential.id);
      }

      queryClient.setQueryData<ApiCredential[]>(
        ["api-credentials"],
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

      queryClient.invalidateQueries({ queryKey: ["api-credentials"] });
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

  const handleUpdate = async (data: { services: string[] }) => {
    try {
      setIsUpdating(true);
      await apiCredentialService.update(credential.id, data.services);

      queryClient.setQueryData<ApiCredential[]>(
        ["api-credentials"],
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.map((c) =>
            c.id === credential.id
              ? { ...c, services: data.services }
              : c,
          );
        },
      );

      toast.success(t("messages.updateSuccess"));
      queryClient.invalidateQueries({ queryKey: ["api-credentials"] });
      setIsEditing(false);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("messages.updateFailed"), {
          description: error.response?.data?.message,
        });
      } else {
        toast.error(t("messages.updateFailed"));
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex gap-2">
        {!credential.isDeleted && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
              >
                <Edit />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("actions.edit")}</TooltipContent>
          </Tooltip>
        )}

        <AlertDialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button
                  variant={
                    credential.isDeleted ? "ghost-success" : "ghost"
                  }
                  size="icon"
                  className={
                    credential.isDeleted
                      ? ""
                      : "text-red-500 hover:text-red-600"
                  }
                  disabled={isToggling}
                  loading={isToggling}
                >
                  {credential.isDeleted ? (
                    <RestoreFromTrash />
                  ) : (
                    <Delete />
                  )}
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

        <ApiCredentialDialog
          open={isEditing}
          onClose={() => setIsEditing(false)}
          onSubmit={handleUpdate}
          initialServices={credential.services}
          isEdit={true}
          isSubmitting={isUpdating}
        />
      </div>
    </TooltipProvider>
  );
};

export default ApiCredentialActionsCell;
