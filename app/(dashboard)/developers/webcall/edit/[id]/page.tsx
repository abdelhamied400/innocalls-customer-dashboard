"use client";

import { useTranslations } from "@/providers/TranslationProvider";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import webcallService from "@/services/webcall.service";
import { WebCallAppFormValues } from "@/validation/WebCallApp";
import WebCallForm from "../../WebCallForm";
import withActiveOrganization from "@/containers/withActiveOrganization";
import withPermission from "@/containers/withPermission";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const EditWebCallPage = () => {
  const t = useTranslations("developers.webcall");
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: app, isLoading, dataUpdatedAt } = useLocalizedQuery({
    queryKey: ["webcall-app", params.id],
    queryFn: () => webcallService.getById(params.id),
    enabled: !!params.id,
    staleTime: 0,
  });

  const handleSubmit = async (data: WebCallAppFormValues) => {
    try {
      setIsSubmitting(true);
      await webcallService.update(params.id, data);
      await queryClient.invalidateQueries({ queryKey: ["webcall-apps"] });
      toast.success(t("messages.updateSuccess"));
      router.push("/developers/webcall");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("messages.updateFailed"), {
          description: error.response?.data?.message,
        });
      } else {
        toast.error(t("messages.updateFailed"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page h-full" id="webcall-edit">
      <div className="flex flex-col h-full gap-4 max-w-3xl mx-auto">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/developers/webcall">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">{t("editPage.title")}</h1>
        </div>
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        )}
        {app && (
          <WebCallForm
            key={dataUpdatedAt}
            defaultValues={{
              iconText: app.iconText ?? "Call Us",
              iconBackgroundColor: app.iconBackgroundColor ?? "#c5d3c5",
              iconBaseColor: app.iconBaseColor ?? "#FFFFFF",
              iconFontColor: app.iconFontColor ?? "#000000",
              concurrentCalls: app.concurrentCalls ?? 10,
              destinationNumber: app.destinationNumber ?? "",
              callerId: app.callerId ?? "",
              domains: app.domains?.length ? app.domains : [""],
            }}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isEdit
          />
        )}
      </div>
    </div>
  );
};

export default withActiveOrganization(
  withPermission(EditWebCallPage, "completeControlDeveloperTools"),
);
