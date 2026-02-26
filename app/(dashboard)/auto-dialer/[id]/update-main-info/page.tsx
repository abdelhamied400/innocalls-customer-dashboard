"use client";
import withPermission from "@/containers/withPermission";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type AutoDialerUpdateMainInfo,
  AutoDialerUpdateMainInfoSchema,
} from "@/validation/AutoDialerUpdateMainInfo";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import autoDialerService from "@/services/auto-dialer.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import queryExtensions from "@/queries/queryExtensions";
import { useTranslations } from "@/providers/TranslationProvider";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Field from "@/components/ui/field";
import Select from "@/components/Select";
import CallerIdSelector from "@/components/CallerIdSelector";

const UpdateMainInfoSheet = () => {
  const { id } = useParams();
  const campaignId = Array.isArray(id) ? id[0] : id;
  const t = useTranslations("autoDialer.updateMainInfo");
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: extensions, isLoading: isExtensionsLoading } =
    useLocalizedQuery(queryExtensions({}));

  const { data: campaign, isLoading } = useLocalizedQuery({
    queryKey: ["auto-dialer-campaign", campaignId],
    queryFn: () => autoDialerService.getCampaign(campaignId as string),
    enabled: isMounted && !!campaignId,
  });

  const form = useForm<AutoDialerUpdateMainInfo>({
    mode: "onChange",
    resolver: zodResolver(AutoDialerUpdateMainInfoSchema(t)),
    defaultValues: {
      name: "",
      agents: [],
      callers: [
        {
          destination: "",
          callerNumber: "",
        },
      ],
    },
  });

  useEffect(() => {
    if (isExtensionsLoading || !extensions || !campaign) return;

    const selectedAgents = campaign?.assignedAgents.map(
      (ex: number) => `${ex}`,
    );

    form.reset({
      name: campaign.name,
      agents: selectedAgents,
      callers: campaign.callers,
    });
  }, [isExtensionsLoading, extensions, campaign, form]);

  const onSubmit = form.handleSubmit(
    async (data) => {
      try {
        setIsSubmitting(true);
        await autoDialerService.updateCampaignMainInfo(campaignId as string, {
          ...data,
          agents: data.agents.map(Number),
        });
        queryClient.invalidateQueries({
          queryKey: ["auto-dialer-active-campaigns"],
        });
        queryClient.invalidateQueries({
          queryKey: ["auto-dialer-campaign", campaignId],
        });
        toast.success(t("toasts.success"), {
          description: t("toasts.successDescription"),
        });
        setIsOpen(false);
        router.back();
      } catch (error) {
        if (isAxiosError(error)) {
          toast.error(t("toasts.error"), {
            description:
              error.response?.data?.message || t("toasts.errorDescription"),
          });
          return;
        }
        toast.error(t("toasts.error"), {
          description: t("toasts.errorDescription"),
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    () => {},
  );

  const {
    control,
    formState: { errors },
  } = form;

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(newOpen) => {
        setIsOpen(newOpen);
        router.back();
      }}
    >
      <SheetContent
        side="bottom"
        className="h-screen p-0"
        onPointerDownOutside={(event) => {
          event.preventDefault();
        }}
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>{t("title")}</SheetTitle>
          <SheetDescription>{t("description")}</SheetDescription>
        </SheetHeader>

        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">{t("title")}</h2>
            <Button
              size="icon"
              variant="unstyled"
              onClick={() => {
                setIsOpen(false);
                router.back();
              }}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          <div className="flex-1 mx-auto my-8 w-[300px] md:w-[600px] max-h-[calc(100vh-200px)] overflow-auto">
            {(!isMounted || isLoading) && <div>{t("loading")}</div>}
            {isMounted && !isLoading && !campaign && (
              <div className="text-center text-muted-foreground">
                {t("notFound")}
              </div>
            )}
            {isMounted && !isLoading && campaign && (
              <FormProvider {...form}>
                <Form {...form}>
                  <form
                    className="p-4 rounded-xl bg-white h-full"
                    onSubmit={onSubmit}
                  >
                    <div className="flex flex-col gap-4">
                      <FormField
                        control={control}
                        name="name"
                        render={({ field }) => (
                          <Field
                            label={t("form.campaignName.label")}
                            error={errors.name?.message}
                            htmlFor="name"
                          >
                            <FormItem className="w-full">
                              <FormControl>
                                <Input
                                  id="name"
                                  variant="field"
                                  placeholder={t(
                                    "form.campaignName.placeholder",
                                  )}
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          </Field>
                        )}
                      />

                      <hr />

                      <FormField
                        control={control}
                        name="agents"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start gap-2 w-full">
                            <FormControl>
                              <Select
                                className="w-full"
                                label={t("form.agents.label")}
                                error={errors.agents?.message}
                                options={
                                  extensions?.map((ext) => ({
                                    label: `${ext.name} (${ext.ext})`,
                                    value: ext.ext,
                                  })) || []
                                }
                                placeholder={t("form.agents.placeholder")}
                                value={
                                  extensions
                                    ? extensions
                                        .filter((ext) =>
                                          Array.isArray(field.value)
                                            ? field.value.includes(ext.ext)
                                            : false,
                                        )
                                        .map((ext) => ({
                                          label: `${ext.name} (${ext.ext})`,
                                          value: ext.ext,
                                        }))
                                    : []
                                }
                                onChange={(data) =>
                                  field.onChange(data.map((d) => d.value))
                                }
                                isMulti
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <hr />

                      <div className="flex-1">
                        <h3>{t("form.callerIds.label")}</h3>
                        <CallerIdSelector />
                        {errors.callers?.message && (
                          <p className="text-destructive mt-2">
                            {errors.callers.message}
                          </p>
                        )}
                      </div>

                      <Button size="lg" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? t("form.submitting") : t("form.submit")}
                      </Button>
                    </div>
                  </form>
                </Form>
              </FormProvider>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default withPermission(
  UpdateMainInfoSheet,
  "fullAccessAutoDialerCampaigns",
);
