"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import Field from "@/components/ui/field";
import authService from "@/services/auth.service";
import { AxiosError } from "axios";
import { ForgotPasswordSchema } from "@/validation/ForgotPassword";
import { useTranslations } from "next-intl";

const ForgotPasswordForm = () => {
  const { toast } = useToast();
  const t = useTranslations("auth.forgotPassword");

  // 1. Define your form.
  const schema = ForgotPasswordSchema(t);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const {
    formState: { errors, isSubmitting, isDirty },
  } = form;

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await authService.forgotPassword(data.email);
      toast({
        title: t("messages.emailSent"),
        description: t("messages.emailSentDescription"),
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: t("messages.couldNotSendEmail"),

          description: error.response?.data.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: t("messages.somethingWentWrong"),
        description: t("messages.defaultErrorDescription"),
        variant: "destructive",
      });
    }
  });

  return (
    <div className="forgot-password-form md:min-w-[400px] lg:min-w-[500px]">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-8 w-full">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <Field
                label={t("form.fields.email.label")}
                error={errors.email?.message}
                htmlFor="email"
              >
                <FormItem>
                  <FormControl>
                    <Input
                      id="email"
                      variant="field"
                      placeholder={t("form.fields.email.placeholder")}
                      type="email"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              </Field>
            )}
          />
          <Button
            className="w-full py-6"
            size="lg"
            variant="secondary"
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting || !isDirty}
          >
            {t("actions.submit")}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPasswordForm;
