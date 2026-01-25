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
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/providers/TranslationProvider";
import vocabService from "@/services/vocab.service";
import { FullTag } from "@/types/api/tag";
import { Edit, Pause, PlayArrow } from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState } from "react";

type TagActionsCellProps = {
  tag: FullTag;
};

const TagActionsCell = ({ tag }: TagActionsCellProps) => {
  const { toast } = useToast();
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
      await queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast({
        title: tag.isDeleted
          ? t("messages.tagEnabled")
          : t("messages.tagDisabled"),
        variant: "success",
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          title: t("messages.toggleFailed"),
          description: error.response?.data?.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: t("messages.toggleFailed"),
          variant: "destructive",
        });
      }
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button variant="ghost" size="icon" className="text-gray-400">
        <Edit />
      </Button>

      <AlertDialog>
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
  );
};

export default TagActionsCell;
