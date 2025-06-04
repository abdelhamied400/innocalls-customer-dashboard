"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Field from "@/components/ui/field";
import authService from "@/services/auth.service";
import { ResetPasswordSchema } from "@/validation/ResetPassword";
import { AxiosError } from "axios";

type ResetPasswordFormProps = {
  token: string;
};
const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const { toast } = useToast();
  const router = useRouter();

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(ResetPasswordSchema),
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
      // Call your API to reset the password
      await authService.resetPassword(token, values.password);
      toast({
        title: "Password Reset",
        description: "Your password has been reset successfully.",
      });
      router.push("/login");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: "Error",
          description: error.response?.data.message,
          variant: "destructive",
        });
        return;
      }
      // Handle other types of errors
      toast({
        title: "Error",
        description: "An error occurred while resetting your password.",
        variant: "destructive",
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
                    label="Password"
                    error={errors.password?.message}
                    htmlFor="password"
                  >
                    <Input
                      id="password"
                      variant="field"
                      placeholder="Enter password..."
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
                    label="Confirm Password"
                    error={errors.passwordConfirm?.message}
                    htmlFor="passwordConfirm"
                  >
                    <Input
                      id="passwordConfirm"
                      variant="field"
                      placeholder="Re-enter password..."
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
            variant="secondary"
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Reset Password
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordForm;
