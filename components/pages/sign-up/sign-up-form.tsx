"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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

export default function SignUpForm() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof SignUpFormSchema>>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof SignUpFormSchema>) {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    console.log(values);
    toast.success("Login Success");
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-80 w-full mx-auto"
    >
      <FieldSet>
        <FieldGroup>

          {/* NAME */}
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="name">Name</FieldLabel>

            <Input
              id="name"
              placeholder="John Doe"
              variant="primary"
              className="h-14"
              {...register("name")}
            />

            
              <FieldError errors={[errors.name]} />
          </Field>

          {/* EMAIL */}
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">Email</FieldLabel>

            <Input
              id="email"
              placeholder="example123@xyz.com"
              variant="primary"
              className="h-14"
              {...register("email")}
            />

            {errors.email && (
              <FieldError>{errors.email.message}</FieldError>
            )}
          </Field>

          {/* PASSWORD */}
          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password">Password</FieldLabel>

            <Input
              id="password"
              type="password"
              placeholder="••••••"
              variant="primary"
              className="h-14"
              {...register("password")}
            />

            {errors.password && (
              <FieldError>{errors.password.message}</FieldError>
            )}
          </Field>

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
            Already have an{" "}
            <Link
              href="/sign-in"
              className="text-primary hover:underline"
            >
              account?
            </Link>
            ?
          </p>

        </FieldGroup>
      </FieldSet>
    </form>
  );
}
