"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Field from "@/components/ui/field";
import Link from "next/link";
import { LoginSchema } from "@/validation/Login";
import { useTranslations } from "@/providers/TranslationProvider";
import { useEffect, useState } from "react";

const LoginForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const t = useTranslations("auth.login");
  const tCommon = useTranslations("common");
  const [clientIp, setClientIp] = useState<string>("");

  useEffect(() => {
    let isActive = true;
    (async () => {
      try {
        const res = await fetch("/api/get-ip");
        const data = await res.json();
        if (isActive && data?.ip) setClientIp(String(data.ip));
      } catch {}
    })();
    return () => {
      isActive = false;
    };
  }, []);

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(LoginSchema(t, tCommon)),
    defaultValues: {
      email: "",
      password: "",
      userType: "user",
    },
  });

  const {
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = form;

  const onSubmit = form.handleSubmit(async (values) => {
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      userType: values.userType,
      clientIp,
      redirect: false,
    });

    if (result?.error) {
      toast({
        title: t("messages.loginFailed"),
        description: result.code,
        variant: "destructive",
      });
    } else {
      toast({
        title: t("messages.loginSuccess"),
        description: t("messages.loginSuccessDescription"),
      });
      router.push("/");
    }
  });

  return (
    <div className="login-form md:min-w-[400px] lg:min-w-[500px]">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-8">
          <ToggleGroup
            className="w-full grid grid-cols-2"
            type="single"
            value={watch("userType")}
            onValueChange={(value) => {
              if (value) {
                setValue("userType", value);
              }
            }}
          >
            <ToggleGroupItem value="user">
              {t("form.fields.userType.admin")}
            </ToggleGroupItem>
            <ToggleGroupItem value="agent">
              {t("form.fields.userType.agent")}
            </ToggleGroupItem>
          </ToggleGroup>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Field
                    label={t("form.fields.email.label")}
                    error={errors.email?.message}
                    htmlFor="email"
                  >
                    <Input
                      id="email"
                      variant="field"
                      placeholder={t("form.fields.email.placeholder")}
                      type="email"
                      {...field}
                    />
                  </Field>
                </FormControl>
              </FormItem>
            )}
          />
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
                      placeholder={t("form.fields.password.placeholder")}
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

          <p className="text-center">
            {t("actions.forgotPassword")}{" "}
            <Link href="/forgot-password" className="text-primary">
              {t("actions.resetPassword")}
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
