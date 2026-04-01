"use client";

import { Button } from "@/components/ui/button";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "@/providers/TranslationProvider";
import callBridgeService from "@/services/call-bridge.service";
import { CallBridgeCall } from "@/types/callBridge";
import { Cell } from "@/types/cell";
import { DeleteOutline, Visibility, VisibilityOff } from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

type ActionsCellProps = Cell<CallBridgeCall>;

const ActionsCell = ({ row }: ActionsCellProps) => {
  const t = useTranslations("callBridge.calls");
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const isExpanded = row.getIsExpanded();
  const call = row.original;
  const isPending = call.status === "pending";

  const onDelete = async () => {
    try {
      setIsDeleting(true);
      await callBridgeService.deleteCall(call.id);
      toast.success(t("toasts.deleted"), {
        description: t("toasts.deletedDescription"),
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("toasts.deleteError"), {
          description:
            error.response?.data?.message || t("toasts.deleteErrorDescription"),
        });
        return;
      }
      toast.error(t("toasts.deleteError"), {
        description: t("toasts.deleteErrorDescription"),
      });
    } finally {
      await queryClient.invalidateQueries({
        queryKey: ["call-bridge-calls-list"],
      });
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost-primary"
              size="icon"
              onClick={() => row.toggleExpanded()}
            >
              {isExpanded ? (
                <VisibilityOff fontSize="small" />
              ) : (
                <Visibility fontSize="small" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isExpanded ? t("actions.hideDetails") : t("actions.viewDetails")}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {isPending && (
        <AlertDialog>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost-destructive"
                    size="icon"
                    disabled={isDeleting}
                  >
                    <DeleteOutline fontSize="small" />
                  </Button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent>{t("actions.delete")}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("actions.deleteConfirmTitle")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("actions.deleteConfirmDescription")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("actions.cancel")}</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={onDelete}
              >
                {t("actions.delete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default ActionsCell;
