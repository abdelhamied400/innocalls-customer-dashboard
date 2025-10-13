"use client";

import { Button } from "@/components/ui/button";
import Field from "@/components/ui/field";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SheetClose } from "@/components/ui/sheet";
import Stepper, {
  StepperHeader,
  StepperHeaderTitle,
  StepperPrevious,
  StepperStep,
  StepperSteps,
} from "@/components/ui/stepper";
import { useToast } from "@/hooks/use-toast";
import StripeProvider from "@/providers/StripeProvider";
import billingService from "@/services/billing.service";
import {
  RefillBalanceSchema,
  refillBalanceSchema,
} from "@/validation/RefillBalance";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { ChevronLeftIcon, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import CheckoutForm from "./checkout-form";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "@/providers/TranslationProvider";
import useAuthStore from "@/store/auth.slice";

const RefillBalanceForm = () => {
  const { toast } = useToast();
  const [paymentReference, setPaymentReference] = useState<string>();
  const [paymentProvider, setPaymentProvider] = useState<string>();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const { Organization } = useAuthStore();

  const closeSheetRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();

  const t = useTranslations("billing.refillBalance");
  const tCommon = useTranslations("common");

  const form = useForm<RefillBalanceSchema>({
    resolver: zodResolver(
      refillBalanceSchema(t, tCommon, {
        currency: Organization?.paymentCurrency,
      })
    ),
    defaultValues: { amount: 5 },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      form.reset(form.getValues());

      const res = await billingService.getPaymentReference(Number(data.amount));
      setPaymentReference(res.paymentReference);
      setPaymentProvider(res.paymentProvider);
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          variant: "destructive",
          title: t("messages.refillError"),
          description:
            error.response?.data?.message || t("messages.unknownError"),
        });
      } else {
        toast({
          variant: "destructive",
          title: t("messages.refillError"),
          description:
            error instanceof Error ? error.message : t("messages.unknownError"),
        });
      }
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Stepper
      steps={[t("title")]}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      className="h-full flex flex-col"
    >
      <StepperHeader>
        <StepperPrevious>
          <ChevronLeftIcon />
        </StepperPrevious>

        <div className="flex flex-1 justify-center gap-2">
          <StepperHeaderTitle idx={0}>
            <p>{t("title")}</p>
          </StepperHeaderTitle>
        </div>
        <Button size="icon" asChild variant="unstyled">
          <SheetClose ref={closeSheetRef}>
            <X className="h-4 w-4" />
            <span className="sr-only">{t("actions.close")}</span>
          </SheetClose>
        </Button>
      </StepperHeader>

      <StepperSteps className="flex-1 mx-auto my-8 w-[300px] md:w-[600px] max-h-[calc(100vh - 200px)] overflow-auto">
        <Form {...form}>
          <form onSubmit={onSubmit} className="h-full">
            <StepperStep
              idx={0}
              className="p-4 rounded-xl bg-white flex flex-col gap-2"
            >
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Field
                        label={`${t("form.fields.amount.label")} (${tCommon(
                          `currencies.${Organization?.paymentCurrency}`
                        )})`}
                        error={
                          form.formState.errors.amount?.message?.toString() ||
                          ""
                        }
                        htmlFor="amount"
                      >
                        <Input
                          id="amount"
                          variant="field"
                          placeholder={t("form.fields.amount.placeholder")}
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Ensure the value is a valid number
                            if (isNaN(Number(value))) {
                              return;
                            }
                            field.onChange(Number(value));
                            setPaymentReference(undefined); // Reset payment reference when amount changes
                          }}
                        />
                      </Field>
                    </FormControl>
                  </FormItem>
                )}
              />

              {paymentReference && paymentProvider === "paytabs" && (
                <div className="w-full h-[600px]">
                  <iframe
                    src={paymentReference}
                    title="Payment"
                    className="w-full h-full border rounded"
                  ></iframe>
                </div>
              )}

              {paymentReference && paymentProvider === "stripe" && (
                <StripeProvider clientSecret={paymentReference}>
                  <CheckoutForm
                    clientSecret={paymentReference}
                    onSuccess={() => {
                      closeSheetRef.current?.click();
                      setTimeout(() => {
                        queryClient.invalidateQueries({
                          queryKey: ["payment-history"],
                        });
                      }, 3000);
                    }}
                  />
                </StripeProvider>
              )}

              {!paymentReference && (
                <Button type="submit" disabled={submitting}>
                  {t("actions.refillBalance")}
                </Button>
              )}
            </StepperStep>
          </form>
        </Form>
      </StepperSteps>
    </Stepper>
  );
};

export default RefillBalanceForm;
