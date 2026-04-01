"use client";

import { useTranslations } from "@/providers/TranslationProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import withPermission from "@/containers/withPermission";
import withActiveOrganization from "@/containers/withActiveOrganization";
import { useLocalizedQuery } from "@/hooks/use-localized-query";
import callBridgeService from "@/services/call-bridge.service";
import { timezones } from "@/constants/timezones";
import {
  CallBridgeCallCreate,
  CallBridgeCallCreateSchema,
} from "@/validation/CallBridgeCallCreate";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Field from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Select from "@/components/Select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { isAxiosError } from "axios";

type DateTimeLocal = string;

const toApiDateTime = (value: DateTimeLocal) => value.replace("T", " ");

const CreateCallBridgeCallPage = () => {
  const t = useTranslations("callBridge.calls");
  const router = useRouter();

  const form = useForm<CallBridgeCallCreate>({
    resolver: zodResolver(CallBridgeCallCreateSchema(t)),
    defaultValues: {
      conferenceBridgeFlow: "",
      duration: 1,
      timezone: "Africa/Cairo",
      dateTime: "",
      firstRecipient: {
        name: "",
        phone: "",
      },
      secondRecipient: {
        name: "",
        phone: "",
      },
    },
  });

  const { data: bridges, isLoading: isLoadingBridges } = useLocalizedQuery({
    queryKey: ["call-bridge-flows-select"],
    queryFn: () => callBridgeService.fetchBridges({ page: 1, limit: 1000 }),
    gcTime: 0,
  });

  const bridgeOptions = useMemo(
    () =>
      (bridges?.flows || []).map((flow) => ({
        label: flow.name,
        value: flow.id,
      })),
    [bridges?.flows],
  );

  const timezoneOptions = useMemo(
    () =>
      timezones.map((tz) => ({
        label: tz.name,
        value: tz.id,
      })),
    [],
  );

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await callBridgeService.createCall({
        ...values,
        dateTime: toApiDateTime(values.dateTime),
      });

      toast.success(t("toasts.created"), {
        description: t("toasts.createdDescription"),
      });
      router.replace("/call-bridge/calls");
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
    }
  });

  return (
    <div className="page h-full overflow-hidden" id="create-call-bridge-call">
      <div className="mx-auto max-w-4xl p-4 md:p-6 h-full overflow-auto">
        <div className="rounded-xl border bg-white p-4 md:p-6 flex flex-col gap-6">
          <h3>{t("createPage.title")}</h3>

          <Form {...form}>
            <form className="flex flex-col gap-6" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="conferenceBridgeFlow"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Field
                          label={t("form.conferenceBridgeFlow.label")}
                          error={
                            form.formState.errors.conferenceBridgeFlow?.message
                          }
                        >
                          <Select
                            isLoading={isLoadingBridges}
                            options={bridgeOptions}
                            placeholder={t(
                              "form.conferenceBridgeFlow.placeholder",
                            )}
                            value={
                              bridgeOptions.find(
                                (opt) => opt.value === field.value,
                              ) || null
                            }
                            onChange={(data) => {
                              field.onChange(data?.value || "");
                            }}
                          />
                        </Field>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Field
                          label={t("form.duration.label")}
                          error={form.formState.errors.duration?.message}
                        >
                          <Input
                            variant="field"
                            type="number"
                            min={1}
                            step={1}
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </Field>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Field
                          label={t("form.timezone.label")}
                          error={form.formState.errors.timezone?.message}
                        >
                          <Select
                            options={timezoneOptions}
                            placeholder={t("form.timezone.placeholder")}
                            value={
                              timezoneOptions.find(
                                (opt) => opt.value === field.value,
                              ) || null
                            }
                            onChange={(data) => {
                              field.onChange(data?.value || "");
                            }}
                          />
                        </Field>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Field
                          label={t("form.dateTime.label")}
                          error={form.formState.errors.dateTime?.message}
                        >
                          <Input
                            variant="field"
                            type="datetime-local"
                            value={field.value?.replace(" ", "T") || ""}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </Field>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstRecipient.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Field
                          label={t("form.firstRecipient.name.label")}
                          error={
                            form.formState.errors.firstRecipient?.name?.message
                          }
                        >
                          <Input
                            variant="field"
                            placeholder={t(
                              "form.firstRecipient.name.placeholder",
                            )}
                            {...field}
                          />
                        </Field>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="firstRecipient.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Field
                          label={t("form.firstRecipient.phone.label")}
                          error={
                            form.formState.errors.firstRecipient?.phone?.message
                          }
                        >
                          <Input
                            variant="field"
                            placeholder={t(
                              "form.firstRecipient.phone.placeholder",
                            )}
                            {...field}
                          />
                        </Field>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="secondRecipient.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Field
                          label={t("form.secondRecipient.name.label")}
                          error={
                            form.formState.errors.secondRecipient?.name?.message
                          }
                        >
                          <Input
                            variant="field"
                            placeholder={t(
                              "form.secondRecipient.name.placeholder",
                            )}
                            {...field}
                          />
                        </Field>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="secondRecipient.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Field
                          label={t("form.secondRecipient.phone.label")}
                          error={
                            form.formState.errors.secondRecipient?.phone
                              ?.message
                          }
                        >
                          <Input
                            variant="field"
                            placeholder={t(
                              "form.secondRecipient.phone.placeholder",
                            )}
                            {...field}
                          />
                        </Field>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/call-bridge/calls")}
                >
                  {t("actions.cancel")}
                </Button>
                <Button type="submit" loading={form.formState.isSubmitting}>
                  {t("actions.create")}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default withActiveOrganization(
  withPermission(CreateCallBridgeCallPage, "fullAccessConferenceBridge"),
);
