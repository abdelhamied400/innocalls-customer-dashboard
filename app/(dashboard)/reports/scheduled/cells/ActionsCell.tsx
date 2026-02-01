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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/providers/TranslationProvider";
import { ScheduledReport } from "@/types/api/report";
import {
  DeleteOutline,
  EditOutlined,
  MoreVert,
  History,
  PlayArrow,
  ToggleOn,
  ToggleOff,
  Edit,
  Visibility,
  PlayCircle,
  Block,
  Autorenew,
} from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";
import { CellContext } from "@tanstack/react-table";
import { useState } from "react";

const ActionsCell = ({ row }: CellContext<ScheduledReport, unknown>) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const t = useTranslations("reports.scheduled");

  const report = row.original;
  const isActive = report.status === "active";

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      // TODO: Call delete API when available
      // await reportsService.deleteScheduledReport(report.id);

      // Optimistic update
      queryClient.setQueryData<ScheduledReport[]>(
        ["scheduled-reports"],
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.filter((r) => r.id !== report.id);
        },
      );

      toast({
        title: t("messages.deleteSuccess"),
        variant: "success",
      });

      queryClient.invalidateQueries({ queryKey: ["scheduled-reports"] });
    } catch (error) {
      toast({
        title: t("messages.deleteFailed"),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    // TODO: Navigate to edit page or open edit modal
    console.log("Edit report:", report.id);
  };

  const handleViewHistory = () => {
    // TODO: Navigate to history page or open history modal
    console.log("View history:", report.id);
  };

  const handleGenerateNow = async () => {
    try {
      // TODO: Call generate API when available
      // await reportsService.generateScheduledReport(report.id);

      toast({
        title: t("messages.generateSuccess"),
        variant: "success",
      });
    } catch (error) {
      toast({
        title: t("messages.generateFailed"),
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async () => {
    try {
      // TODO: Call toggle status API when available
      // await reportsService.toggleScheduledReportStatus(report.id);

      // Optimistic update
      queryClient.setQueryData<ScheduledReport[]>(
        ["scheduled-reports"],
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.map((r) =>
            r.id === report.id
              ? { ...r, status: isActive ? "inactive" : "active" }
              : r,
          );
        },
      );

      toast({
        title: isActive
          ? t("messages.deactivateSuccess")
          : t("messages.activateSuccess"),
        variant: "success",
      });

      queryClient.invalidateQueries({ queryKey: ["scheduled-reports"] });
    } catch (error) {
      toast({
        title: isActive
          ? t("messages.deactivateFailed")
          : t("messages.activateFailed"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-1">
      {/* Edit Button */}
      <Button variant="ghost-info" size="icon" onClick={handleEdit}>
        <Edit className="text-info-500" />
      </Button>

      {/* Delete Button */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={isDeleting}
            loading={isDeleting}
          >
            <DeleteOutline className="text-neutral-500" />
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("confirmations.deleteTitle")}
            </AlertDialogTitle>
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

      {/* More Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="unstyled" size="icon">
            <MoreVert className="text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="p-3 border-b rounded-none text-base font-semibold flex items-center gap-2"
            onClick={handleViewHistory}
          >
            <Visibility className="text-icons" />
            <span>{t("actions.viewHistory")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="p-3 border-b rounded-none text-base font-semibold flex items-center gap-2"
            onClick={handleGenerateNow}
          >
            <PlayCircle className="text-icons" />
            <span>{t("actions.generateNow")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="p-3 rounded-none text-base font-semibold flex items-center gap-2"
            onClick={handleToggleStatus}
          >
            {isActive ? (
              <>
                <Block className="text-icons" />
                <span>{t("actions.deactivate")}</span>
              </>
            ) : (
              <>
                <Autorenew className="text-icons" />
                <span>{t("actions.activate")}</span>
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ActionsCell;
