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
import { toast } from "sonner";
import { useTranslations } from "@/providers/TranslationProvider";
import { ScheduledReport } from "@/types/api/report";
import {
  DeleteOutline,
  MoreVert,
  Edit,
  Visibility,
  PlayCircle,
  Block,
  Autorenew,
} from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";
import { CellContext } from "@tanstack/react-table";
import { useState } from "react";
import scheduledReportsService from "@/services/scheduled-reports.service";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ActionsCell = ({ row }: CellContext<ScheduledReport, unknown>) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggleDialogOpen, setIsToggleDialogOpen] = useState(false);
  const t = useTranslations("reports.scheduled");

  const report = row.original;
  const isActive = report.status === "active";

  const [isGenerating, setIsGenerating] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await scheduledReportsService.delete(report.id);

      toast.success(t("messages.deleteSuccess"));

      queryClient.invalidateQueries({ queryKey: ["scheduled-reports"] });
    } catch (error) {
      toast.error(t("messages.deleteFailed"));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewHistory = () => {
    router.push(`/reports/scheduled/${report.id}/history`);
  };

  const handleGenerateNow = async () => {
    try {
      setIsGenerating(true);
      await scheduledReportsService.generateNow(report.id);

      toast.success(t("messages.generateSuccess"));

      queryClient.invalidateQueries({
        queryKey: ["scheduled-report-history", report.id],
      });
    } catch (error) {
      toast.error(t("messages.generateFailed"));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      setIsToggling(true);
      if (isActive) {
        await scheduledReportsService.deactivate(report.id);
      } else {
        await scheduledReportsService.activate(report.id);
      }

      toast.success(isActive
          ? t("messages.deactivateSuccess")
          : t("messages.activateSuccess"));

      queryClient.invalidateQueries({ queryKey: ["scheduled-reports"] });
    } catch (error) {
      toast.error(isActive
          ? t("messages.deactivateFailed")
          : t("messages.activateFailed"));
    } finally {
      setIsToggling(false);
      setIsToggleDialogOpen(false);
    }
  };

  return (
    <div className="flex gap-1">
      {/* Edit Button */}
      <Button variant="ghost-info" size="icon" asChild>
        <Link href={`/reports/scheduled/${report.id}/edit`}>
          <Edit className="text-info-500" />
        </Link>
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
            disabled={isGenerating}
          >
            <PlayCircle className="text-icons" />
            <span>{isGenerating ? t("actions.generating") : t("actions.generateNow")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="p-3 rounded-none text-base font-semibold flex items-center gap-2"
            onClick={(e) => {
              e.preventDefault();
              setIsToggleDialogOpen(true);
            }}
            disabled={isToggling}
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

      {/* Activate/Deactivate Confirmation Dialog */}
      <AlertDialog open={isToggleDialogOpen} onOpenChange={setIsToggleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isActive
                ? t("confirmations.deactivateTitle")
                : t("confirmations.activateTitle")}
            </AlertDialogTitle>
            <AlertDialogX />
            <AlertDialogDescription>
              {isActive
                ? t("confirmations.deactivateDescription", { name: report.name })
                : t("confirmations.activateDescription", { name: report.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("confirmations.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleStatus} disabled={isToggling}>
              {isActive
                ? t("confirmations.yesDeactivate")
                : t("confirmations.yesActivate")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ActionsCell;
