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
import webcallService from "@/services/webcall.service";
import { WebCallApp } from "@/types/api/webcall";
import { Edit, PowerSettingsNew } from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState } from "react";
import Link from "next/link";

type WebCallActionsCellProps = {
  app: WebCallApp;
};

const WebCallActionsCell = ({ app }: WebCallActionsCellProps) => {
  const queryClient = useQueryClient();
  const [isToggling, setIsToggling] = useState(false);
  const t = useTranslations("developers.webcall");

  const handleToggle = async () => {
    try {
      setIsToggling(true);
      if (app.serviceEnabled) {
        await webcallService.disable(app.id);
      } else {
        await webcallService.enable(app.id);
      }

      queryClient.setQueryData<WebCallApp[]>(
        ["webcall-apps"],
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.map((a) =>
            a.id === app.id
              ? { ...a, serviceEnabled: !app.serviceEnabled }
              : a,
          );
        },
      );

      toast.success(
        app.serviceEnabled
          ? t("messages.disabled")
          : t("messages.enabled"),
      );

      queryClient.invalidateQueries({ queryKey: ["webcall-apps"] });
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
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <Link href={`/developers/webcall/edit/${app.id}`}>
                <Edit />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t("actions.edit")}</TooltipContent>
        </Tooltip>

        <AlertDialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button
                  variant={app.serviceEnabled ? "ghost" : "ghost-success"}
                  size="icon"
                  className={app.serviceEnabled ? "text-red-500 hover:text-red-600" : ""}
                  disabled={isToggling}
                  loading={isToggling}
                >
                  <PowerSettingsNew />
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              {app.serviceEnabled
                ? t("actions.disable")
                : t("actions.enable")}
            </TooltipContent>
          </Tooltip>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {app.serviceEnabled
                  ? t("confirmations.disableTitle")
                  : t("confirmations.enableTitle")}
              </AlertDialogTitle>
              <AlertDialogX />
              <AlertDialogDescription>
                {app.serviceEnabled
                  ? t("confirmations.disableDescription")
                  : t("confirmations.enableDescription")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {t("confirmations.cancel")}
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleToggle}>
                {app.serviceEnabled
                  ? t("confirmations.yesDisable")
                  : t("confirmations.yesEnable")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
};

export default WebCallActionsCell;
