"use client";

import { useTranslations } from "@/providers/TranslationProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import webcallService from "@/services/webcall.service";
import { WebCallAppFormValues } from "@/validation/WebCallApp";
import WebCallForm from "../WebCallForm";
import withActiveOrganization from "@/containers/withActiveOrganization";
import withPermission from "@/containers/withPermission";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const CreateWebCallPage = () => {
  const t = useTranslations("developers.webcall");
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: WebCallAppFormValues) => {
    try {
      setIsSubmitting(true);
      await webcallService.create(data);
      await queryClient.invalidateQueries({ queryKey: ["webcall-apps"] });
      toast.success(t("messages.createSuccess"));
      router.push("/developers/webcall");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(t("messages.createFailed"), {
          description: error.response?.data?.message,
        });
      } else {
        toast.error(t("messages.createFailed"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page h-full" id="webcall-create">
      <div className="flex flex-col h-full gap-4 max-w-3xl mx-auto">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/developers/webcall">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">{t("createPage.title")}</h1>
        </div>
        <WebCallForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default withActiveOrganization(
  withPermission(CreateWebCallPage, "completeControlDeveloperTools"),
);
