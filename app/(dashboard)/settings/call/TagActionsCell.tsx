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
import vocabService from "@/services/vocab.service";
import { FullTag } from "@/types/api/tag";
import { Edit, Pause, PlayArrow } from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import Link from "next/link";
import { useState } from "react";

type TagActionsCellProps = {
  tag: FullTag;
};

const TagActionsCell = ({ tag }: TagActionsCellProps) => {
  const queryClient = useQueryClient();
  const [isToggling, setIsToggling] = useState(false);
  const t = useTranslations("settings.call.tags");

  const handleToggle = async () => {
    try {
      setIsToggling(true);
      if (tag.isDeleted) {
        await vocabService.restoreTag(tag.id);
      } else {
        await vocabService.deleteTag(tag.id);
      }

      // Optimistic update
      queryClient.setQueryData<FullTag[]>(["tags"], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((t) =>
          t.id === tag.id ? { ...t, isDeleted: !tag.isDeleted } : t,
        );
      });

      toast.success(tag.isDeleted
          ? t("messages.tagEnabled")
          : t("messages.tagDisabled"));

      // Refetch in background to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ["tags"] });
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
            <Link href={`/settings/call/edit-tag?id=${tag.id}`}>
              <Button variant="ghost" size="icon" className="text-gray-400">
                <Edit />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>{t("actions.edit")}</TooltipContent>
        </Tooltip>

        <AlertDialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button
                  variant={tag.isDeleted ? "ghost-success" : "ghost-warning"}
                  size="icon"
                  disabled={isToggling}
                  loading={isToggling}
                >
                  {tag.isDeleted ? <PlayArrow /> : <Pause />}
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              {tag.isDeleted ? t("actions.enable") : t("actions.disable")}
            </TooltipContent>
          </Tooltip>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {tag.isDeleted
                  ? t("confirmations.enableTitle", { name: tag.nameEN })
                  : t("confirmations.disableTitle", { name: tag.nameEN })}
              </AlertDialogTitle>
              <AlertDialogX />
              <AlertDialogDescription>
                {tag.isDeleted
                  ? t("confirmations.enableDescription")
                  : t("confirmations.disableDescription")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("confirmations.cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={handleToggle}>
                {tag.isDeleted
                  ? t("confirmations.yesEnable")
                  : t("confirmations.yesDisable")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
};

export default TagActionsCell;
