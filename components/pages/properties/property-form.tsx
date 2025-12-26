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
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { useRouter } from "next/navigation";
import { postFeatureSchema } from "@/lib/zod/schema.zod";
import RichTextEditor from "@/components/widgets/editor/RichTextEditor";

const PropertyForm = ({ mode, property }: { mode: 'create' | 'edit', property?: any }) => {
  /* === Local State === */
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState();
  const router = useRouter()

  /* === React Hook Form Setup === */
  const form = useForm<z.infer<typeof postFeatureSchema>>({
    resolver: zodResolver(postFeatureSchema),
    defaultValues: {
      id: null,
      description: "",
      title: "",
    },
  });

  /* === Submit Handler === */
  async function onSubmit(values: z.infer<typeof postFeatureSchema>) {

    setLoading(true);

    toast.loading("Updating profile...", {
      id: "profile-update-loading",
    });

    alert(value)


    try {
      const response = await fetch("/api/profile/update/info-10", {
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
      // onSubmit={form.handleSubmit(onSubmit)}
      className="w-full mx-auto"
    >
      <FieldSet>

        <FieldGroup>
          {/* Name */}

          <div className="flex flex-col sm:flex-row gap-2">

          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <Input
                  id="title"
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
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor="price">Price</FieldLabel>
                <Input
                  id="price"
                  type="number"
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
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor="address">Address</FieldLabel>
                <Input
                  id="address"
                  type="text"
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
          
        </div>


          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={!!fieldState.error}>
                <FieldLabel htmlFor="address">Address</FieldLabel>
                <Input
                  id="address"
                  type="text"
                  placeholder="example123@xyz.com"
                  variant="primary"
                  className="h-14"
                  {...field}
                />
                <RichTextEditor
        onChange={(val) => setValue("description", val)}
        className="w-full h-72"
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
  )
}

export default PropertyForm