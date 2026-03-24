"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Field from "@/components/ui/field";
import Link from "next/link";
import { LoginSchema } from "@/validation/Login";
import { useTranslations } from "@/providers/TranslationProvider";
import { useEffect, useState } from "react";
import authService from "@/services/auth.service";
import useSessionStore from "@/store/session.slice";
import { setCookie } from "cookies-next";

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("auth.login");
  const tCommon = useTranslations("common");
  const [clientIp, setClientIp] = useState<string>("");
  const { setSession } = useSessionStore();

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
    try {
      const res = await authService.login({
        email: values.email,
        password: values.password,
        userType: values.userType as "user" | "agent",
        clientIp,
      });

      const organizations =
        res.organizations || (res.agent?.organization ? [res.agent.organization] : []);

      setCookie("OrganizationId", organizations?.[0]?.id || "");

      setSession({
        accessToken: res.accessToken,
        userType: values.userType as "user" | "agent",
        organizations,
        user: {
          email: res.user?.email || res.agent?.email,
          id: res.user?.id || res.agent?.id,
        },
      });

      toast.info(t("messages.loginSuccess"), {
        description: t("messages.loginSuccessDescription"),
      });

      const redirectTo = searchParams.get("next") || "/";
      router.push(redirectTo);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        t("messages.loginFailed");
      toast.error(t("messages.loginFailed"), {
        description: message,
      });
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
