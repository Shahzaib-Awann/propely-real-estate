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

interface UpdateUserInfoProps {
  info: {
    avatar: string | null;
    name: string;
    email: string;
  };
}

export function UpdateUserInfo({ info }: UpdateUserInfoProps) {
  /* === Local State === */
  const [loading, setLoading] = useState(false);

  /* === React Hook Form Setup === */
  const form = useForm<z.infer<typeof UpdateUserProfileFormSchema>>({
    resolver: zodResolver(UpdateUserProfileFormSchema),
    defaultValues: {
      avatar: null,
      name: info.name,
      email: info.email,
    },
  });

  /* === Submit Handler === */
  async function onSubmit(values: z.infer<typeof UpdateUserProfileFormSchema>) {
    try {
      setLoading(true);
      toast.loading("Signing you in...", {
        id: "signin-loading",
      });

      console.log({ values });
      //   const result = true

      toast.success("Logged in successfully! Welcome back.");
    } catch (e) {
      console.log("Error from login page: ", e);
    } finally {
      setLoading(false);
      toast.dismiss("signin-loading");
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
              className="w-full h-14 text-base rounded-none"
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

{
  /* <UploadWidget uwConfig={{
            cloudName:"shahzaib-awan",
            uploadPreset:"propely-real-estate",
            multiple:false,
            maxImageFileSize:(1 * 1024 * 1024) // 1Mb
            folder:"avatars"
          }} /> */
}
