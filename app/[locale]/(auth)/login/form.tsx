"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const formSchema = z.object({
  email: z
    .string()
    .min(2, {
      message: "Email must be at least 2 characters.",
    })
    .email(),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
  userType: z.enum(["user", "agent"], {
    errorMap: () => ({ message: "Please select a user type." }),
  }),
});

const LoginForm = () => {
  const { toast } = useToast();
  const router = useRouter();

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      userType: "user",
    },
  });

  const {
    formState: { isSubmitting },
    watch,
    setValue,
  } = form;

  const onSubmit = form.handleSubmit(async (values) => {
    console.log(values);
    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      userType: values.userType,
      redirect: false,
    });

    if (result?.error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
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

  // 2. Define your login methods.
  const loginWithGoogle = () => {
    // Implement Google login here.
  };
  const loginWithGithub = () => {
    // Implement Github login here.
  };

  return (
    <div className="login-form">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-8">
          <ToggleGroup
            type="single"
            value={watch("userType")}
            onValueChange={(value) => {
              if (value) {
                setValue("userType", value);
              }
            }}
          >
            <ToggleGroupItem value="user">User</ToggleGroupItem>
            <ToggleGroupItem value="agent">Agent</ToggleGroupItem>
          </ToggleGroup>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
            Submit
          </Button>
        </form>
      </Form>

      <div className="flex flex-wrap gap-2">
        <Button onClick={loginWithGoogle} variant="outline">
          Register with Google
        </Button>
        <Button onClick={loginWithGithub} variant="outline">
          Register with Github
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
