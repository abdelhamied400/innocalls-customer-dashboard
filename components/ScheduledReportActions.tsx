import scheduledReportsService from "@/services/scheduled-reports.service";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Autorenew,
  Block,
  DeleteOutline,
  Edit,
  MoreVert,
  PlayCircle,
} from "@mui/icons-material";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ScheduledReport } from "@/types/api/report";
import { useTranslations } from "@/providers/TranslationProvider";

const ScheduledReportActions = ({
  report,
}: {
  report: ScheduledReport | undefined;
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggleDialogOpen, setIsToggleDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations("reports.scheduled");

  const handleDelete = async () => {
    if (!report) return;
    try {
      setIsDeleting(true);
      await scheduledReportsService.delete(report.id);

      toast({
        title: t("messages.deleteSuccess"),
        variant: "success",
      });

      queryClient.invalidateQueries({ queryKey: ["scheduled-reports"] });
      router.push("/reports/scheduled");
    } catch (error) {
      toast({
        title: t("messages.deleteFailed"),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleGenerateNow = async () => {
    if (!report) return;
    try {
      setIsGenerating(true);
      await scheduledReportsService.generateNow(report.id);

      toast({
        title: t("messages.generateSuccess"),
        variant: "success",
      });

      queryClient.invalidateQueries({
        queryKey: ["scheduled-report-history", report.id],
      });
    } catch (error) {
      toast({
        title: t("messages.generateFailed"),
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!report) return;
    try {
      setIsToggling(true);
      if (report.status === "active") {
        await scheduledReportsService.deactivate(report.id);
      } else {
        await scheduledReportsService.activate(report.id);
      }

      toast({
        title:
          report.status === "active"
            ? t("messages.deactivateSuccess")
            : t("messages.activateSuccess"),
        variant: "success",
      });

      queryClient.invalidateQueries({ queryKey: ["scheduled-reports"] });
      queryClient.invalidateQueries({
        queryKey: ["scheduled-report", report.id],
      });
    } catch (error) {
      toast({
        title:
          report.status === "active"
            ? t("messages.deactivateFailed")
            : t("messages.activateFailed"),
        variant: "destructive",
      });
    } finally {
      setIsToggling(false);
      setIsToggleDialogOpen(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Edit Button */}
      <a
        href={`/reports/scheduled/${report?.id}/edit?from=/reports/scheduled/${report?.id}/history`}
      >
        <Button variant="ghost-info" size="icon">
          <Edit className="text-info-500" />
        </Button>
      </a>

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
            onClick={handleGenerateNow}
            disabled={isGenerating}
          >
            <PlayCircle className="text-icons" />
            <span>
              {isGenerating
                ? t("actions.generating")
                : t("actions.generateNow")}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="p-3 rounded-none text-base font-semibold flex items-center gap-2"
            onClick={(e) => {
              e.preventDefault();
              setIsToggleDialogOpen(true);
            }}
            disabled={isToggling}
          >
            {report?.status === "active" ? (
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
              {report?.status === "active"
                ? t("confirmations.deactivateTitle")
                : t("confirmations.activateTitle")}
            </AlertDialogTitle>
            <AlertDialogX />
            <AlertDialogDescription>
              {report?.status === "active"
                ? t("confirmations.deactivateDescription", { name: report?.name })
                : t("confirmations.activateDescription", { name: report?.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("confirmations.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleStatus} disabled={isToggling}>
              {report?.status === "active"
                ? t("confirmations.yesDeactivate")
                : t("confirmations.yesActivate")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ScheduledReportActions;
