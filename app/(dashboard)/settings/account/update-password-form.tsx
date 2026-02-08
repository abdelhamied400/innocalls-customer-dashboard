"use client";
import { Button } from "@/components/ui/button";
import Field from "@/components/ui/field";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { clientSignout } from "@/lib/auth";
import { apiLogger } from "@/lib/logger";
import { useTranslations } from "@/providers/TranslationProvider";
import authService from "@/services/auth.service";
import { UpdatePasswordSchema } from "@/validation/UpdatePassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";

const UpdatePasswordForm = () => {
  const { toast } = useToast();
  const t = useTranslations("auth.updatePassword");
  const tCommon = useTranslations("common");

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(UpdatePasswordSchema(t, tCommon)),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmedPassword: "",
    },
  });

  const {
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = form.handleSubmit(
    async (values) => {
      try {
        // Call your API to reset the password
        await authService.updateUserPassword(
          values.currentPassword,
          values.newPassword,
        );
        toast({
          title: t("messages.resetSuccess"),
          description: t("messages.resetSuccessDescription"),
        });
        apiLogger.info("Unauthorized! Logging out...");
        await clientSignout();
      } catch (error) {
        if (isAxiosError(error)) {
          toast({
            title: t("messages.resetFailed"),
            description: error.response?.data.message,
            variant: "destructive",
          });
          return;
        }
        // Handle other types of errors
        toast({
          title: t("messages.resetFailed"),
          description: t("messages.defaultErrorDescription"),
          variant: "destructive",
        });
      }
    },
    (errors) => {
      console.log("Form submission errors:", errors);
    },
  );
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-8">
        <div className="border p-4 rounded-lg">
          <div className="grid grid-cols-5 gap-2">
            <div className="col-span-2">
              <h4>{t("title")}</h4>
            </div>
            <div className="col-span-3 flex flex-col gap-2">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Field
                        label={t("form.fields.currentPassword.label")}
                        error={errors.currentPassword?.message}
                        htmlFor="currentPassword"
                      >
                        <Input
                          id="currentPassword"
                          variant="field"
                          placeholder={t(
                            "form.fields.currentPassword.placeholder",
                          )}
                          type="password"
                          {...field}
                        />
                      </Field>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Field
                        label={t("form.fields.newPassword.label")}
                        error={errors.newPassword?.message}
                        htmlFor="newPassword"
                      >
                        <Input
                          id="newPassword"
                          variant="field"
                          placeholder={t("form.fields.newPassword.placeholder")}
                          type="password"
                          {...field}
                        />
                      </Field>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmedPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Field
                        label={t("form.fields.confirmPassword.label")}
                        error={errors.confirmedPassword?.message}
                        htmlFor="confirmedPassword"
                      >
                        <Input
                          id="confirmedPassword"
                          variant="field"
                          placeholder={t(
                            "form.fields.confirmPassword.placeholder",
                          )}
                          type="password"
                          {...field}
                        />
                      </Field>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p>{t("hint")}</p>
          <Button
            className="py-6"
            size="lg"
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {t("actions.submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdatePasswordForm;
