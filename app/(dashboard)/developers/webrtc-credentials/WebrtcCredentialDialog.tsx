"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "@/providers/TranslationProvider";
import {
  WebrtcCredentialSchema,
  WebrtcCredentialFormValues,
} from "@/validation/WebrtcCredential";
import { zodResolver } from "@hookform/resolvers/zod";
import PlusIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

type WebrtcCredentialDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (domains: string[]) => Promise<void>;
  initialDomains?: string[];
  isEdit?: boolean;
  isSubmitting?: boolean;
};

const WebrtcCredentialDialog = ({
  open,
  onClose,
  onSubmit,
  initialDomains = [""],
  isEdit = false,
  isSubmitting = false,
}: WebrtcCredentialDialogProps) => {
  const t = useTranslations("developers.webrtc");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<WebrtcCredentialFormValues>({
    resolver: zodResolver(WebrtcCredentialSchema(t)),
    defaultValues: {
      domains: initialDomains.length > 0 ? initialDomains : [""],
    },
  });

  const domains = watch("domains");
  const prevOpen = useRef(open);
  const initialDomainsKey = JSON.stringify(initialDomains);

  useEffect(() => {
    if (open && !prevOpen.current) {
      reset({
        domains: initialDomains.length > 0 ? [...initialDomains] : [""],
      });
    }
    prevOpen.current = open;
  }, [open, initialDomainsKey]);

  const addDomain = () => {
    setValue("domains", [...domains, ""]);
  };

  const removeDomain = (index: number) => {
    setValue(
      "domains",
      domains.filter((_, i) => i !== index),
      { shouldValidate: true },
    );
  };

  const onFormSubmit = async (data: WebrtcCredentialFormValues) => {
    await onSubmit(data.domains.map((d) => d.trim()));
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isEdit
              ? t("credentialDialog.editTitle")
              : t("credentialDialog.createTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isEdit
              ? t("credentialDialog.editDescription")
              : t("credentialDialog.createDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-2 max-h-[40vh] overflow-y-auto">
          <label className="text-sm font-medium">
            {t("credentialDialog.domainsLabel")}
          </label>
          {domains.map((_, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="flex-1">
                <Input
                  {...register(`domains.${index}`)}
                  placeholder={t("credentialDialog.domainPlaceholder")}
                  className={
                    errors.domains?.[index] ? "border-red-500" : ""
                  }
                />
                {errors.domains?.[index]?.message && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.domains[index].message}
                  </p>
                )}
              </div>
              {domains.length > 1 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost-destructive"
                        size="icon"
                        type="button"
                        className="shrink-0 mt-0.5"
                        onClick={() => removeDomain(index)}
                      >
                        <DeleteIcon />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {t("credentialDialog.removeDomain")}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          ))}
          {errors.domains?.root?.message && (
            <p className="text-xs text-red-500">
              {errors.domains.root.message}
            </p>
          )}
          {errors.domains?.message && (
            <p className="text-xs text-red-500">
              {errors.domains.message}
            </p>
          )}
          <Button
            variant="link"
            onClick={addDomain}
            type="button"
            className="self-start"
          >
            <PlusIcon />
            {t("credentialDialog.addDomain")}
          </Button>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>
            {t("confirmations.cancel")}
          </AlertDialogCancel>
          <Button
            onClick={handleSubmit(onFormSubmit)}
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            {isEdit
              ? t("credentialDialog.update")
              : t("credentialDialog.create")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default WebrtcCredentialDialog;
