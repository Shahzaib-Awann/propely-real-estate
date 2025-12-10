"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { SignUpFormSchema } from "@/lib/zod/schema.zod";
import Link from "next/link";
import toast from "react-hot-toast";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignUpForm() {

  /* === Local State === */
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter()

  /* Toggle password visibility */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /* === React Hook Form Setup === */
  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  /* === Submit Handler === */
  async function onSubmit(values: z.infer<typeof SignUpFormSchema>) {
    try {
      
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
  
      const result = await res.json();
  
      /* Handle auto-login failure */
      if (result?.error === "AUTO_LOGIN_FAILED") {
        toast.error("Your account is created, but please sign in manually.");
        router.push(`/sign-in?email=${values.email}`);
        return;
      }
  
      /** Handle submission errors */
      if (!res.ok) {
        toast.error(result.error || "Sign-up failed");
        return;
      }
  
      /** Success handling */
      toast.success("Account created and logged in!");
      window.location.href = "/properties";
  
    } catch (e) {
      console.error(e);
      toast.error("Unexpected error");
    } finally {
      setLoading(false);
    }
  }
  

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-80 w-full mx-auto">
      <FieldSet>
        <FieldGroup>

          {/* NAME */}
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="name">Name</FieldLabel>

                <Input
                  id="name"
                  placeholder="John Doe"
                  variant="primary"
                  className="h-14"
                  {...field}
                />

                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          {/* EMAIL */}
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">Email</FieldLabel>

                <Input
                  id="email"
                  placeholder="example123@xyz.com"
                  variant="primary"
                  className="h-14"
                  {...field}
                />

                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          {/* PASSWORD */}
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
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

                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          {/* SUBMIT BUTTON */}
          <Field orientation="horizontal">
            <Button
              disabled={loading}
              type="submit"
              className="w-full h-14 text-base rounded-none"
            >
              {loading ? "Submitting…" : "Submit"}
            </Button>
          </Field>

          {/* SIGN-IN LINK */}
          <p className="text-sm text-center">
            Already have an <Link href="/sign-in" className="text-primary hover:underline">account?</Link>
          </p>

        </FieldGroup>
      </FieldSet>
    </form>
  );
}