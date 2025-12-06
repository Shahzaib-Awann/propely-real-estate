"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormControl,
} from "@/components/ui/form";

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

  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof SignUpFormSchema>) {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    console.log(values);
    toast.success("Login Success")
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-80 w-full mx-auto"
      >
        <FieldSet>
          <FieldGroup>

            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="name">Name</FieldLabel>

                  <FormControl>
                    <Input
                      id="name"
                      placeholder="jhon Doe"
                      variant="primary"
                      className="h-14"
                      {...field}
                    />
                  </FormControl>

                  <FieldError errors={fieldState.error ? [fieldState.error] : []} />
                </Field>
              )}
            />
            
            {/* EMAIL */}
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>

                  <FormControl>
                    <Input
                      id="email"
                      placeholder="example123@xyz.com"
                      variant="primary"
                      className="h-14"
                      {...field}
                    />
                  </FormControl>

                  <FieldError errors={fieldState.error ? [fieldState.error] : []} />
                </Field>
              )}
            />

            {/* PASSWORD */}
            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>

                  <FormControl>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••"
                      variant="primary"
                      className="h-14"
                      {...field}
                    />
                  </FormControl>

                  <FieldError errors={fieldState.error ? [fieldState.error] : []} />
                </Field>
              )}
            />

            {/* SUBMIT */}
            <Field orientation="horizontal">
              <Button disabled={loading} type="submit" className="w-full h-14 text-base rounded-sm">
                {loading ? "Submitting…" : "Submit"}
              </Button>
            </Field>

            <p className="text-sm text-center">Already have an <Link href="/sign-in" className="text-primary hover:underline">account?</Link></p>

          </FieldGroup>
        </FieldSet>
      </form>
    </Form>
  );
}
