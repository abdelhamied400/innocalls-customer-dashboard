"use client";

import { Button } from "@/components/ui/button";
import Field from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import useAuth from "@/hooks/useAuth";
import { useTranslations } from "@/providers/TranslationProvider";
import organizationsService from "@/services/organizations.service";
import useAuthStore from "@/store/auth.slice";
import { Organization } from "@/types/api/organization";
import {
  OrganizationDetailsFormValues,
  OrganizationDetailsSchema,
} from "@/validation/OrganizationDetails";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const OrganizationDetailsForm = () => {
  const { Organization, setOrganization } = useAuthStore();
  const { toast } = useToast();
  const { refetch } = useAuth();
  const t = useTranslations("settings.account.organizationInfo");

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<OrganizationDetailsFormValues>({
    resolver: zodResolver(OrganizationDetailsSchema(t)),
    defaultValues: {
      organizationName: Organization?.name || "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await organizationsService.updateOrganizationName({
        name: data.organizationName,
      });
      setOrganization({
        ...(Organization || ({} as Organization)),
        name: data.organizationName,
      });
      toast({
        title: t("messages.success"),
        description: t("messages.successDescription"),
        variant: "success",
      });
      refetch();
    } catch (error: any) {
      console.error("Failed to update organization name:", error);
      toast({
        title: t("messages.error"),
        description: error.response?.data?.message,
        variant: "destructive",
      });
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="border p-4 rounded-lg">
        <div className="grid grid-cols-5 gap-2">
          <div className="col-span-2">
            <h4>{t("title")}</h4>
          </div>
          <div className="col-span-3">
            <Field
              label={t("form.fields.organizationName.label")}
              htmlFor="organizationName"
              error={errors.organizationName?.message}
            >
              <Input
                id="organizationName"
                placeholder={t("form.fields.organizationName.placeholder")}
                variant="field"
                {...register("organizationName")}
              />
            </Field>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button className="py-6" size="lg" type="submit">
          {t("actions.submit")}
        </Button>
      </div>
    </form>
  );
};

export default OrganizationDetailsForm;
