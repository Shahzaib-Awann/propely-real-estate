"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Field,
  FieldGroup,
  FieldSet,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SignInFormSchema } from "@/lib/zod/schema.zod";
import Link from "next/link";
import toast from "react-hot-toast";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { signIn } from "next-auth/react"

export default function SignInForm({ callbackUrl, email }: { callbackUrl: string, email?: string }) {

  /* === Local State === */
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /* Toggle password visibility */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /* === React Hook Form Setup === */
  const form = useForm<z.infer<typeof SignInFormSchema>>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: { 
      email: email ?? "",
      password: ""
    },
  });

  /* === Submit Handler === */
  async function onSubmit(values: z.infer<typeof SignInFormSchema>) {
    try {

      setLoading(true)
      toast.loading("Signing you in...", {
        id: "signin-loading",
      });

      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl,
      });

      /* Handle sign-in result */
      if (result?.error) {
        const message = result.error === "CredentialsSignin"
            ? "Login failed. Check your email and password."
            : `Error: ${result.error}. Try again.`;
        toast.error(message);
      } else if (result?.ok) {
        toast.success("Logged in successfully! Welcome back.");
        window.location.href = result.url || callbackUrl || "/";
      }

    } catch (e) {
      console.log("Error from login page: ", e)
    } finally {
      setLoading(false)
      toast.dismiss("signin-loading")
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="max-w-80 w-full mx-auto"
    >
      <FieldSet>
        <FieldGroup>

          {/* EMAIL */}
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  placeholder="example123@xyz.com"
                  variant="primary"
                  className="h-14"
                  {...field}
                />
                <FieldError errors={fieldState.error ? [fieldState.error] : []} />
              </Field>
            )}
          />

          {/* PASSWORD */}
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative w-full">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={showPassword ? "Password" : "••••••"}
                    variant="primary"
                    className="h-14 pr-12"
                    {...field}
                  />

                  <Button
                    type="button"
                    variant="link"
                    onClick={togglePasswordVisibility}
                    className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword
                      ? <EyeOffIcon className="h-5 w-5 text-muted-foreground" />
                      : <EyeIcon className="h-5 w-5 text-muted-foreground" />
                    }
                  </Button>
                </div>
                <FieldError errors={fieldState.error ? [fieldState.error] : []} />
              </Field>
            )}
          />

          {/* SUBMIT */}
          <Field orientation="horizontal">
            <Button
              disabled={loading}
              type="submit"
              className="w-full h-12 text-base rounded-none"
            >
              Sign In
            </Button>
          </Field>

          {/* SIGN-UP LINK */}
          <p className="text-sm text-center mt-2">
            Don&apos;t have an{" "}
            <Link href="/sign-up" className="text-primary hover:underline">
              account?
            </Link>
          </p>

        </FieldGroup>
      </FieldSet>
    </form>
  );
}