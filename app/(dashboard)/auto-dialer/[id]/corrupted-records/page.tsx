"use client";
import withPermission from "@/containers/withPermission";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Field from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowDropDown,
  DeleteForever,
  DeleteSweep,
  ErrorOutline,
  Save,
} from "@mui/icons-material";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import useLayoutManager from "@/hooks/use-layout-manager";
import { useTranslations } from "@/providers/TranslationProvider";
import autoDialerService from "@/services/auto-dialer.service";
import { CorruptedRow } from "@/types/autoDialerCampaign";
import {
  CorruptedRowSchema,
  CorruptedRowFormValues,
} from "@/validation/CorruptedRowSchema";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import Spinner from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type CorruptedRecordFormProps = {
  record: CorruptedRow;
  campaignId: string;
  onSaved: () => Promise<void>;
  t: (key: string, params?: Record<string, unknown>) => string;
  isConstrained: boolean;
};

const CorruptedRecordForm = ({
  record,
  campaignId,
  onSaved,
  t,
  isConstrained,
}: CorruptedRecordFormProps) => {
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CorruptedRowFormValues>({
    mode: "onChange",
    resolver: zodResolver(CorruptedRowSchema(t)),
    defaultValues: {
      name: record.row.name,
      phone: record.row.phone,
      information: record.row.information,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsSaving(true);
      await autoDialerService.updateCorruptedRow(campaignId, record.id, data);
      toast.success(t("saveSuccess"), {
        description: t("saveSuccessDescription"),
      });
      await onSaved();
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("saveError"), {
          description:
            error.response?.data?.message || t("saveErrorDescription"),
        });
      } else {
        toast.error(t("saveError"), {
          description: t("saveErrorDescription"),
        });
      }
    } finally {
      setIsSaving(false);
    }
  });

  return (
    <div className={isSaving ? "animate-pulse pointer-events-none" : ""}>
      <form onSubmit={onSubmit}>
        {isConstrained ? (
          <div className="corrupted-record flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label={t("name")}
                htmlFor={`name-${record.id}`}
                error={errors.name?.message}
              >
                <Input
                  id={`name-${record.id}`}
                  variant="field"
                  placeholder={t("namePlaceholder")}
                  {...register("name")}
                />
              </Field>
              <Field
                label={t("phone")}
                htmlFor={`phone-${record.id}`}
                error={errors.phone?.message}
              >
                <Input
                  id={`phone-${record.id}`}
                  variant="field"
                  placeholder={t("phonePlaceholder")}
                  {...register("phone")}
                />
              </Field>
            </div>
            <Field
              label={t("info")}
              htmlFor={`info-${record.id}`}
              error={errors.information?.message}
            >
              <Input
                id={`info-${record.id}`}
                variant="field"
                placeholder={t("infoPlaceholder")}
                {...register("information")}
              />
            </Field>
            <div className="flex justify-end">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="submit" size="icon" disabled={isSaving}>
                      {isSaving ? <Spinner /> : <Save />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("save")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        ) : (
          <div className="corrupted-record flex items-start gap-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
              <Field
                label={t("name")}
                htmlFor={`name-${record.id}`}
                error={errors.name?.message}
              >
                <Input
                  id={`name-${record.id}`}
                  variant="field"
                  placeholder={t("namePlaceholder")}
                  {...register("name")}
                />
              </Field>
              <Field
                label={t("phone")}
                htmlFor={`phone-${record.id}`}
                error={errors.phone?.message}
              >
                <Input
                  id={`phone-${record.id}`}
                  variant="field"
                  placeholder={t("phonePlaceholder")}
                  {...register("phone")}
                />
              </Field>
              <Field
                label={t("info")}
                htmlFor={`info-${record.id}`}
                error={errors.information?.message}
              >
                <Input
                  id={`info-${record.id}`}
                  variant="field"
                  placeholder={t("infoPlaceholder")}
                  {...register("information")}
                />
              </Field>
            </div>
            <div className="pt-6">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="submit" size="icon" disabled={isSaving}>
                      {isSaving ? <Spinner /> : <Save />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("save")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}
      </form>
      {record.reasons.length > 0 && (
        <div className="mt-1 space-y-1">
          {record.reasons.map((reason, idx) => (
            <p
              key={idx}
              className="text-xs text-destructive flex items-center gap-1"
            >
              <ErrorOutline className="!text-sm" />
              {reason}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

const CorruptedRecords = () => {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations("autoDialer.corruptedRecords");
  const { hasExpandedSidebar, hasExpandedWebrtc, screenWidth, isMobile } =
    useLayoutManager();

  const isLaptopScreen = screenWidth >= 1024 && screenWidth < 1536;
  const isConstrained =
    isMobile || (isLaptopScreen && hasExpandedSidebar && hasExpandedWebrtc);

  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, error } = useLocalizedQuery({
    queryKey: ["auto-dialer-corrupted-rows", id, page, limit],
    queryFn: () => autoDialerService.fetchCorruptedRows(id, { page, limit }),
    retry: false,
    staleTime: Infinity,
  });

  const [isIgnoring, setIsIgnoring] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [ignoreDialogOpen, setIgnoreDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    if (isError) {
      toast.error(t("toasts.errorTitle"), {
        description:
          (isAxiosError(error) && error.response?.data?.message) ||
          t("toasts.errorDescription"),
      });
    }
  }, [isError, error, t]);

  const onRecordSaved = async () => {
    try {
      const result = await autoDialerService.fetchCorruptedRows(id, {
        page: 1,
        limit: 1,
      });

      if (result.totalItems === 0) {
        queryClient.invalidateQueries({
          queryKey: ["auto-dialer-active-campaigns"],
        });
        queryClient.invalidateQueries({
          queryKey: ["auto-dialer-campaign", id],
        });
        toast.success(t("allResolved"), {
          description: t("allResolvedDescription"),
        });
        router.push("/auto-dialer/active");
      } else {
        await queryClient.refetchQueries({
          queryKey: ["auto-dialer-corrupted-rows"],
        });
      }
    } catch {
      toast.success(t("allResolved"), {
        description: t("allResolvedDescription"),
      });
      router.push("/auto-dialer/active");
      queryClient.invalidateQueries({
        queryKey: ["auto-dialer-active-campaigns"],
      });
      queryClient.invalidateQueries({
        queryKey: ["auto-dialer-campaign", id],
      });
    }
  };

  const onIgnoreCorrupted = async () => {
    try {
      setIsIgnoring(true);
      await autoDialerService.ignoreCorrupted(id);
      queryClient.invalidateQueries({
        queryKey: ["auto-dialer-active-campaigns"],
      });
      queryClient.invalidateQueries({
        queryKey: ["auto-dialer-campaign", id],
      });
      toast.success(t("ignoreCorruptedModal.success"), {
        description: t("ignoreCorruptedModal.successDescription"),
      });
      router.push(`/auto-dialer`);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("ignoreCorruptedModal.error"), {
          description:
            error.response?.data?.message ||
            t("ignoreCorruptedModal.errorDescription"),
        });
        return;
      }
      toast.error(t("ignoreCorruptedModal.error"), {
        description: t("ignoreCorruptedModal.errorDescription"),
      });
    } finally {
      setIsIgnoring(false);
    }
  };

  const onCancelCampaign = async () => {
    try {
      setIsCancelling(true);
      await autoDialerService.cancelCampaign(id);
      queryClient.invalidateQueries({
        queryKey: ["auto-dialer-active-campaigns"],
      });
      toast.success(t("cancelCampaignModal.success"), {
        description: t("cancelCampaignModal.successDescription"),
      });
      router.push("/auto-dialer");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("cancelCampaignModal.error"), {
          description:
            error.response?.data?.message ||
            t("cancelCampaignModal.errorDescription"),
        });
        return;
      }
      toast.error(t("cancelCampaignModal.error"), {
        description: t("cancelCampaignModal.errorDescription"),
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const totalPages = data?.totalPages ?? 1;
  const totalItems = data?.totalItems ?? 0;

  const getPages = () => {
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== -1) {
        pages.push(-1);
      }
    }
    return pages;
  };

  return (
    <div className="page" id="corrupted-records">
      <div className="head flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <Badge
          className="rounded text-xs text-icons font-normal inline"
          variant="warning"
        >
          {t("badgePrefix")}{" "}
          <span className="font-bold">
            {t("badgeRecords", { count: totalItems })}
          </span>{" "}
          {t("badgeSuffix")}
        </Badge>
        <div className="actions flex items-center gap-2 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {t("delete")}
                <ArrowDropDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="p-3"
                onClick={() => setIgnoreDialogOpen(true)}
              >
                <DeleteSweep />
                {t("deleteCorruptedData")}
              </DropdownMenuItem>
              <hr />
              <DropdownMenuItem
                className="p-3"
                onClick={() => setCancelDialogOpen(true)}
              >
                <DeleteForever />
                {t("deleteCampaign")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialog
            open={ignoreDialogOpen}
            onOpenChange={setIgnoreDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("deleteCorruptedData")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("ignoreCorruptedModal.message")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {t("ignoreCorruptedModal.cancel")}
                </AlertDialogCancel>
                <AlertDialogAction onClick={onIgnoreCorrupted}>
                  {t("ignoreCorruptedModal.confirm")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog
            open={cancelDialogOpen}
            onOpenChange={setCancelDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("deleteCampaign")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("cancelCampaignModal.message")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {t("cancelCampaignModal.cancel")}
                </AlertDialogCancel>
                <AlertDialogAction onClick={onCancelCampaign}>
                  {t("cancelCampaignModal.confirm")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 space-y-4">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) =>
            isConstrained ? (
              <div key={i} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-9 w-16 self-end" />
              </div>
            ) : (
              <div key={i} className="flex items-center gap-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
                <Skeleton className="h-9 w-16" />
              </div>
            ),
          )}

        {!isLoading && data?.corruptedRows?.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            {t("noRecords")}
          </p>
        )}

        {!isLoading &&
          data?.corruptedRows?.map((record: CorruptedRow) => (
            <CorruptedRecordForm
              key={record.id}
              record={record}
              campaignId={id}
              onSaved={onRecordSaved}
              t={t}
              isConstrained={isConstrained}
            />
          ))}
      </div>

      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                />
              </PaginationItem>
              {getPages().map((p, idx) => (
                <PaginationItem key={`page-${p}-${idx}`}>
                  {p === -1 ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationButton
                      isActive={page === p}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </PaginationButton>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default withPermission(
  CorruptedRecords,
  "fullAccessAutoDialerCampaigns",
);
