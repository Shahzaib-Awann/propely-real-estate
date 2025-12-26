"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FieldSet,
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { UpdateUserProfileFormSchema } from "@/lib/zod/schema.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { useRouter } from "next/navigation";

interface UpdateUserInfoProps {
  info: {
    name: string;
    email: string;
  };
}

export function UpdateUserInfo({ info }: UpdateUserInfoProps) {
  /* === Local State === */
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  /* === React Hook Form Setup === */
  const form = useForm<z.infer<typeof UpdateUserProfileFormSchema>>({
    resolver: zodResolver(UpdateUserProfileFormSchema),
    defaultValues: {
      name: info.name,
      email: info.email,
    },
  });

  /* === Submit Handler === */
  async function onSubmit(values: z.infer<typeof UpdateUserProfileFormSchema>) {
    
    const isUnchanged =
    values.name?.trim() === info.name?.trim() &&
    values.email?.trim().toLowerCase() === info.email?.trim().toLowerCase();

    if (isUnchanged) {
        toast("No changes detected.", {
          icon: "⚠️",
        });
      return;
    }

    setLoading(true);

    toast.loading("Updating profile...", {
      id: "profile-update-loading",
    });


    try {
      const response = await fetch("/api/profile/update/info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      // Map HTTP status codes to error messages
      const errorMap: Record<number, string> = {
        422: "Invalid profile data. Please check your inputs.",
        401: "Your session has expired. Please sign in again.",
        409: result?.error ?? "This email is already in use.",
      };

      // Handle error responses
      if (!response.ok) {
        const message =
          errorMap[response.status] ??
          result?.error ??
          "Unable to update profile. Please try again.";
        toast.error(message);
        return;
      }

      // === Success ===
      toast.success(result?.message ?? "Profile updated successfully.");
      router.push('/profile')
    } catch (error) {
      console.error("Profile update failed:", error);

      toast.error(
        "Network error occurred. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
      toast.dismiss("profile-update-loading");
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="max-w-80 w-full mx-auto my-auto"
    >
      <FieldSet>
        <h1 className="text-3xl text-center font-medium">Update Profile</h1>

        <FieldGroup>
          {/* Name */}
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  placeholder="example123@xyz.com"
                  variant="primary"
                  className="h-14"
                  {...field}
                />
                <FieldError
                  errors={fieldState.error ? [fieldState.error] : []}
                />
              </Field>
            )}
          />

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
                <FieldError
                  errors={fieldState.error ? [fieldState.error] : []}
                />
              </Field>
            )}
          />

          <Field orientation="horizontal">
            <Button
              disabled={loading}
              type="submit"
              className="w-full h-12 text-base rounded-none"
            >
              Update
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}

export default UpdateUserInfo;