"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Field from "@/components/ui/field";
import authService from "@/services/auth.service";
import { VerifyDemoSchema } from "@/validation/VerifyDemo";
import { AxiosError } from "axios";
import { useTranslations } from "@/providers/TranslationProvider";

type VerifyDemoFormProps = {
  token: string;
};
const VerifyDemoForm = ({ token }: VerifyDemoFormProps) => {
  const router = useRouter();
  const t = useTranslations("auth.verifyDemo");
  const tCommon = useTranslations("common");

  const form = useForm({
    resolver: zodResolver(VerifyDemoSchema(t, tCommon)),
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });

  const {
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await authService.verifyDemoAccount(token, values.password);
      toast.info(t("messages.verifySuccess"), {
        description: t("messages.verifySuccessDescription"),
      });
      router.push("/login");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(t("messages.verifyFailed"), {
          description: error.response?.data.message,
        });
        return;
      }
      toast.error(t("messages.verifyFailed"), {
        description: t("messages.defaultErrorDescription"),
      });
    }
  });

  return (
    <div className="login-form md:min-w-[400px] lg:min-w-[500px]">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-8">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Field
                    label={t("form.fields.password.label")}
                    error={errors.password?.message}
                    htmlFor="password"
                  >
                    <Input
                      id="password"
                      variant="field"
                      placeholder={t("form.fields.password.label")}
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
            name="passwordConfirm"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Field
                    label={t("form.fields.passwordConfirm.label")}
                    error={errors.passwordConfirm?.message}
                    htmlFor="passwordConfirm"
                  >
                    <Input
                      id="passwordConfirm"
                      variant="field"
                      placeholder={t("form.fields.passwordConfirm.label")}
                      type="password"
                      {...field}
                    />
                  </Field>
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            className="w-full py-6"
            size="lg"
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {t("actions.submit")}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default VerifyDemoForm;
