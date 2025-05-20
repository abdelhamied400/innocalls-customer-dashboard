"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Field from "@/components/ui/field";
import Link from "next/link";
import { LoginSchema } from "@/validation/Login";

const LoginForm = () => {
  const { toast } = useToast();
  const router = useRouter();

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(LoginSchema),
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
      redirect: false,
    });

    if (result?.error) {
      toast({
        title: "Login failed",
        description: result.code,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Logged in successfully",
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
            <ToggleGroupItem value="user">Admin</ToggleGroupItem>
            <ToggleGroupItem value="agent">Agent</ToggleGroupItem>
          </ToggleGroup>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <Field
                label="Work Email"
                error={errors.email?.message}
                htmlFor="email"
              >
                <FormItem>
                  <FormControl>
                    <Input
                      id="email"
                      variant="field"
                      placeholder="Enter email..."
                      type="email"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              </Field>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <Field
                label="Password"
                error={errors.password?.message}
                htmlFor="password"
              >
                <FormItem>
                  <FormControl>
                    <Input
                      id="password"
                      variant="field"
                      placeholder="Enter password..."
                      type="password"
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
            disabled={isSubmitting}
          >
            Login
          </Button>

          <p className="text-center">
            Forget Password?{" "}
            <Link href="/forgot-password" className="text-secondary">
              Reset Password
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
