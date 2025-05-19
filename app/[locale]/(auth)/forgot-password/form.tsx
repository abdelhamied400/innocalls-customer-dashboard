"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Field from "@/components/ui/field";
import authService from "@/services/auth.service";
import { AxiosError } from "axios";

const formSchema = z.object({
  email: z
    .string()
    .min(2, {
      message: "Email must be at least 2 characters.",
    })
    .email(),
});

const ForgotPasswordForm = () => {
  const { toast } = useToast();
  const router = useRouter();

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
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
        title: "Email Sent",
        description: "Check your inbox for a reset link.",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: "Could not send email",
          description: error.response?.data.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Something went wrong",
        description: "We have a problem on our side. Please try again later.",
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
          <Button
            className="w-full py-6"
            size="lg"
            variant="secondary"
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting || !isDirty}
          >
            Send Reset Email Link
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPasswordForm;
