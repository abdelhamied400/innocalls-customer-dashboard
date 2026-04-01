"use client";

import { useTranslations } from "@/providers/TranslationProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import withPermission from "@/containers/withPermission";
import withActiveOrganization from "@/containers/withActiveOrganization";
import callBridgeService from "@/services/call-bridge.service";
import { timezones } from "@/constants/timezones";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
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
import VirtualizedSelect from "@/components/VirtualizedSelect";
import DateTimePicker from "@/components/ui/date-time-picker";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import Stepper, {
  StepperHeader,
  StepperHeaderTitle,
  StepperPrevious,
  StepperStep,
  StepperSteps,
} from "@/components/ui/stepper";
import { ChevronLeftIcon, X } from "lucide-react";

type DateTimeLocal = string;

const toApiDateTime = (value: DateTimeLocal) => value.replace("T", " ");

const CreateCallBridgeCallPage = () => {
  const t = useTranslations("callBridge.calls");
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(true);

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

  const {
    data: bridges,
    isLoading: isLoadingBridges,
    isFetchingNextPage: isFetchingMoreBridges,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["call-bridge-flows-select"],
    queryFn: ({ pageParam = 1 }) =>
      callBridgeService.fetchBridges({ page: pageParam, limit: 20 }),
    getNextPageParam: (lastPage, _pages, lastPageParam) => {
      if (lastPageParam < lastPage.totalPages) {
        return lastPageParam + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  const bridgeOptions = useMemo(() => {
    const allFlows = bridges?.pages.flatMap((page) => page.flows || []) || [];
    const uniqueFlows = new Map<string, { label: string; value: string }>();

    allFlows.forEach((flow) => {
      const value = flow.id || flow._id || "";
      if (!flow.name || !value || uniqueFlows.has(value)) return;
      uniqueFlows.set(value, {
        label: flow.name,
        value,
      });
    });

    return Array.from(uniqueFlows.values());
  }, [bridges?.pages]);

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

      await queryClient.invalidateQueries({
        queryKey: ["call-bridge-calls-list"],
      });

      toast.success(t("toasts.created"), {
        description: t("toasts.createdDescription"),
      });
      setIsOpen(false);
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

  const handleClose = () => {
    setIsOpen(false);
    router.replace("/call-bridge/calls");
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent side="bottom" className="h-screen p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>{t("createPage.title")}</SheetTitle>
          <SheetDescription>{t("createPage.title")}</SheetDescription>
        </SheetHeader>
        <Stepper
          steps={[t("createPage.title")]}
          currentStep={0}
          className="h-full flex flex-col"
        >
          <StepperHeader>
            <StepperPrevious>
              <ChevronLeftIcon className="rtl:rotate-180" />
            </StepperPrevious>

            <div className="flex flex-1 justify-center gap-2">
              <StepperHeaderTitle idx={0}>
                <p>{t("createPage.title")}</p>
              </StepperHeaderTitle>
            </div>

            <Button size="icon" variant="unstyled" onClick={handleClose}>
              <X className="h-4 w-4" />
              <span className="sr-only">{t("actions.cancel")}</span>
            </Button>
          </StepperHeader>

          <StepperSteps className="flex-1 mx-auto my-8 w-75 md:w-150 max-h-[calc(100vh-200px)] overflow-auto">
            <StepperStep
              idx={0}
              className="p-4 rounded-xl bg-white flex flex-col gap-6"
            >
              <Form {...form}>
                <form className="flex flex-col gap-6" onSubmit={onSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="conferenceBridgeFlow"
                      render={({ field }) => {
                        return (
                          <VirtualizedSelect
                            label={t("form.conferenceBridgeFlow.label")}
                            hint={t("form.conferenceBridgeFlow.hint")}
                            error={
                              form.formState.errors.conferenceBridgeFlow
                                ?.message
                            }
                            isLoading={
                              isLoadingBridges || isFetchingMoreBridges
                            }
                            options={bridgeOptions}
                            placeholder={t(
                              "form.conferenceBridgeFlow.placeholder",
                            )}
                            value={
                              bridgeOptions.find(
                                (opt) => opt.value === field.value,
                              ) || null
                            }
                            onChange={(
                              data: { value: string | number } | null,
                            ) => {
                              field.onChange(data?.value || "");
                            }}
                            onMenuScrollToBottom={() => {
                              if (hasNextPage && !isFetchingMoreBridges) {
                                fetchNextPage();
                              }
                            }}
                          />
                        );
                      }}
                    />

                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Field
                              label={t("form.duration.label")}
                              hint={t("form.duration.hint")}
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
                        <VirtualizedSelect
                          label={t("form.timezone.label")}
                          hint={t("form.timezone.hint")}
                          error={form.formState.errors.timezone?.message}
                          options={timezoneOptions}
                          placeholder={t("form.timezone.placeholder")}
                          value={
                            timezoneOptions.find(
                              (opt) => opt.value === field.value,
                            ) || null
                          }
                          onChange={(
                            data: { value: string | number } | null,
                          ) => {
                            field.onChange(data?.value || "");
                          }}
                        />
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
                              hint={t("form.dateTime.hint")}
                              error={form.formState.errors.dateTime?.message}
                            >
                              <DateTimePicker
                                value={field.value?.replace(" ", "T") || ""}
                                onChange={(val) => field.onChange(val)}
                                placeholder="DD/MM/YYYY HH:MM"
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
                              hint={t("form.firstRecipient.name.hint")}
                              error={
                                form.formState.errors.firstRecipient?.name
                                  ?.message
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
                              hint={t("form.firstRecipient.phone.hint")}
                              error={
                                form.formState.errors.firstRecipient?.phone
                                  ?.message
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
                              hint={t("form.secondRecipient.name.hint")}
                              error={
                                form.formState.errors.secondRecipient?.name
                                  ?.message
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
                              hint={t("form.secondRecipient.phone.hint")}
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
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                    >
                      {t("actions.cancel")}
                    </Button>
                    <Button type="submit" loading={form.formState.isSubmitting}>
                      {t("actions.create")}
                    </Button>
                  </div>
                </form>
              </Form>
            </StepperStep>
          </StepperSteps>
        </Stepper>
      </SheetContent>
    </Sheet>
  );
};

export default withActiveOrganization(
  withPermission(CreateCallBridgeCallPage, "fullAccessConferenceBridge"),
);
