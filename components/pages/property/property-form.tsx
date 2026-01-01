"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  FieldSet,
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import RichTextEditor from "@/components/widgets/editor/RichTextEditor";
import { createOrUpdatePostSchema } from "@/lib/zod/schema.zod";

const PropertyForm = ({ mode, property }: { mode: 'create' | 'edit', property?: any }) => {

  /* === Local State === */
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState();

  /* === React Hook Form Setup === */
  const form = useForm<z.input<typeof createOrUpdatePostSchema>>({
    resolver: zodResolver(createOrUpdatePostSchema),
    defaultValues: {
      postData: {
        id: null,
        title: "",
        address: "",
        city: "",
        bedrooms: 0,
        bathrooms: 0,
        latitude: 0,
        longitude: 0,
        price: 0,
        propertyType: "apartment",
        listingType: "rent",
      },
      postDetails: {
        description: "",
        state: "",
        areaSqft: 0,
        utilitiesPolicy: "owner",
        petPolicy: "allowed",
        incomePolicy: "",
        schoolDistance: 0,
        busDistance: 0,
        restaurantDistance: 0,
      },
      postImages: property?.images ?? [],
      postFeatures: property?.features ?? [],
    },
  });

  /* === Submit Handler === */
  async function onSubmit(values: z.infer<typeof createOrUpdatePostSchema>) {

    setLoading(true);

    toast.loading("Saving property...", {
      id: "property-loading",
    });

    console.log(JSON.stringify(values, null, 4))

    try {
      const response = await fetch("/api/property", {
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
        409: result?.error ?? "This Property is already exits.",
      };

      // Handle error responses
      if (!response.ok) {
        const message =
          errorMap[response.status] ??
          result?.error ??
          "Unable to Save Property. Please try again.";
        toast.error(message);
        return;
      }

      // === Success ===
      toast.success(result?.message ?? "Property Saved successfully.");
      router.push(`/properties/${result?.propertyId}`)
    } catch (error) {
      console.error("Profile update failed:", error);

      toast.error(
        "Network error occurred. Please check your connection and try again.", {
        id: "property-loading",
      }
      );
    } finally {
      setLoading(false);
      toast.dismiss("property-loading");
    }
  }

  console.log(errors);
  return (
    <>
      {/* LEFT: User Info Form */}
      <section className="flex-3 lg:h-full">
        <div className="flex flex-col gap-10 py-5 pr-0 pb-12 lg:pr-10 overflow-y-visible lg:overflow-y-auto h-auto lg:h-full">
          <h1 className='text-2xl font-semibold'>{mode === "create" ? "Add New Property" : "Edit Property"}</h1>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldSet>
              <FieldGroup>

                {/* Title + Price + Address */}
                <div className="flex flex-col sm:flex-row gap-2">
                  {/* Title */}
                  <Controller
                    name="postData.title"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel htmlFor="title">Title</FieldLabel>
                        <Input
                          id="title"
                          placeholder="Enter property title"
                          variant="primary"
                          className="h-14"
                          {...field}
                        />
                        {fieldState.error && (
  <p className="text-red-500 text-sm">
    {fieldState.error.message}
  </p>
)}
                        <FieldError
                          errors={fieldState.error ? [fieldState.error] : []}
                        />
                      </Field>
                    )}
                  />

                  {/* Price */}
                  <Controller
                    name="postData.price"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel htmlFor="price">Price</FieldLabel>
                        <Input
                          id="price"
                          type="number"
                          placeholder="Enter price in USD"
                          variant="primary"
                          className="h-14"
                          value={field.value ?? 0}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                        <FieldError
                          errors={fieldState.error ? [fieldState.error] : []}
                        />
                      </Field>
                    )}
                  />

                  {/* Address */}
                  <Controller
                    name="postData.address"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel htmlFor="address">Address</FieldLabel>
                        <Input
                          id="address"
                          type="text"
                          placeholder="Enter property address"
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

                {/* Description */}
                <Controller
                  name="postDetails.description"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel htmlFor="description">Description</FieldLabel>
                      <RichTextEditor
                        className="w-full h-72"
                        placeholder="Enter property description"
                        onChange={(value) => field.onChange(value)}
                      />
                      <FieldError
                        errors={fieldState.error ? [fieldState.error] : []}
                      />
                    </Field>
                  )}
                />

                {/* City + Bedrooms + Bathrooms */}
                <div className="flex flex-col sm:flex-row gap-2">
                  {/* City */}
                  <Controller
                    name="postData.city"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel htmlFor="city">City</FieldLabel>
                        <Input
                          id="city"
                          type="text"
                          placeholder="Enter city"
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

                  {/* Bedrooms */}
                  <Controller
                    name="postData.bedrooms"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel htmlFor="bedrooms">Bedrooms</FieldLabel>
                        <Input
                          id="bedrooms"
                          type="number"
                          placeholder="Number of bedrooms"
                          variant="primary"
                          className="h-14"
                          value={field.value ?? 0}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                        <FieldError
                          errors={fieldState.error ? [fieldState.error] : []}
                        />
                      </Field>
                    )}
                  />

                  {/* Bathrooms */}
                  <Controller
                    name="postData.bathrooms"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel htmlFor="bathrooms">Bathrooms</FieldLabel>
                        <Input
                          id="bathrooms"
                          type="number"
                          placeholder="Number of bathrooms"
                          variant="primary"
                          className="h-14"
                          value={field.value ?? 0}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                        <FieldError
                          errors={fieldState.error ? [fieldState.error] : []}
                        />
                      </Field>
                    )}
                  />
                </div>

                {/* Latitude + Longitude + Property Type */}
                <div className="flex flex-col sm:flex-row gap-2">
                  {/* Latitude */}
                  <Controller
                    name="postData.latitude"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel htmlFor="latitude">Latitude</FieldLabel>
                        <Input
                          id="latitude"
                          type="number"
                          placeholder="Enter latitude"
                          variant="primary"
                          className="h-14"
                          value={field.value ?? 0}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                        <FieldError
                          errors={fieldState.error ? [fieldState.error] : []}
                        />
                      </Field>
                    )}
                  />

                  {/* Longitude */}
                  <Controller
                    name="postData.longitude"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel htmlFor="longitude">Longitude</FieldLabel>
                        <Input
                          id="longitude"
                          type="number"
                          placeholder="Enter longitude"
                          variant="primary"
                          className="h-14"
                          value={field.value ?? 0}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                        <FieldError
                          errors={fieldState.error ? [fieldState.error] : []}
                        />
                      </Field>
                    )}
                  />

                  {/* Property Type */}
                  <Controller
                    name="postData.propertyType"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel htmlFor="propertyType">Property</FieldLabel>
                        <Select value={field.value}
  onValueChange={field.onChange}>
                          <SelectTrigger id="propertyType" className="w-full shrink-0 rounded-xs border shadow min-h-14">
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup className="[&_div:focus]:bg-primary [&_div:focus]:text-primary-foreground">
                              {["apartment", "house", "condo", "land"].map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                  {opt[0].toUpperCase() + opt.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FieldError
                          errors={fieldState.error ? [fieldState.error] : []}
                        />
                      </Field>
                    )}
                  />
                </div>


                {/* Listing Type + Utilities Policy + Pet Policy */}
                <div className="flex flex-col sm:flex-row gap-2">
                  {/* Listing Type */}
                  <Controller
                    name="postData.listingType"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel htmlFor="listingType">Type</FieldLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}>
                          <SelectTrigger id="listingType" className="w-full shrink-0 rounded-xs border shadow min-h-14">
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup className="[&_div:focus]:bg-primary [&_div:focus]:text-primary-foreground">
                              {["buy", "rent"].map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                  {opt[0].toUpperCase() + opt.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FieldError
                          errors={fieldState.error ? [fieldState.error] : []}
                        />
                      </Field>
                    )}
                  />

                  {/* Utilities Policy */}
                  <Controller
                    name="postDetails.utilitiesPolicy"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel htmlFor="utilitiesPolicy">Utilities Policy</FieldLabel>
                        <Select value={field.value}
  onValueChange={field.onChange}>
                          <SelectTrigger id="utilitiesPolicy" className="w-full shrink-0 rounded-xs border shadow min-h-14">
                            <SelectValue placeholder="Select utilities policy" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup className="[&_div:focus]:bg-primary [&_div:focus]:text-primary-foreground">
                              <SelectItem value="owner">Owner is responsible</SelectItem>
                              <SelectItem value="tenant">Tenant is responsible</SelectItem>
                              <SelectItem value="shared">Shared</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FieldError
                          errors={fieldState.error ? [fieldState.error] : []}
                        />
                      </Field>
                    )}
                  />

                  {/* Pet Policy */}
                  <Controller
                    name="postDetails.petPolicy"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel htmlFor="petPolicy">Pet Policy</FieldLabel>
                        <Select value={field.value}
  onValueChange={field.onChange} >
                          <SelectTrigger id="petPolicy" className="w-full shrink-0 rounded-xs border shadow min-h-14">
                            <SelectValue placeholder="Select pet policy" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup className="[&_div:focus]:bg-primary [&_div:focus]:text-primary-foreground">
                              {["allowed", "not-allowed"].map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                  {opt[0].toUpperCase() + opt.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FieldError
                          errors={fieldState.error ? [fieldState.error] : []}
                        />
                      </Field>
                    )}
                  />
                </div>

                {/* Income Policy + Size (sqft) + School Distance */}
                <div className="flex flex-col sm:flex-row gap-2">
                  {/* Income Policy */}
                  <Controller
                    name="postDetails.incomePolicy"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel htmlFor="incomePolicy">Income Policy</FieldLabel>
                        <Input
                          id="incomePolicy"
                          type="text"
                          placeholder="Enter income policy"
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

                  {/* Size (sqft) */}
                  <Controller
                    name="postDetails.areaSqft"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel htmlFor="areaSqft">Size (sqft)</FieldLabel>
                        <Input
                          id="areaSqft"
                          type="number"
                          placeholder="Enter area in square feet"
                          variant="primary"
                          className="h-14"
                          value={field.value ?? 0}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                        <FieldError
                          errors={fieldState.error ? [fieldState.error] : []}
                        />
                      </Field>
                    )}
                  />

                  {/* School Distance */}
                  <Controller
                    name="postDetails.schoolDistance"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel htmlFor="schoolDistance">School Distance (m)</FieldLabel>
                        <Input
                          id="schoolDistance"
                          type="number"
                          placeholder="Enter school distance in meters"
                          variant="primary"
                          className="h-14"
                          value={field.value ?? 0}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                        <FieldError
                          errors={fieldState.error ? [fieldState.error] : []}
                        />
                      </Field>
                    )}
                  />
                </div>

                {/* Bus Distance + Restaurant Distance + Submit Button */}
                <div className="flex flex-col sm:flex-row gap-2 items-end">
                  {/* Bus Distance */}
                  <Controller
                    name="postDetails.busDistance"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel htmlFor="busDistance">Bus Distance (m)</FieldLabel>
                        <Input
                          id="busDistance"
                          type="text"
                          placeholder="Enter bus distance in meters"
                          variant="primary"
                          className="h-14"
                          value={field.value ?? 0}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                        <FieldError
                          errors={fieldState.error ? [fieldState.error] : []}
                        />
                      </Field>
                    )}
                  />

                  {/* Restaurant Distance */}
                  <Controller
                    name="postDetails.restaurantDistance"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel htmlFor="restaurantDistance">Restaurant Distance (m)</FieldLabel>
                        <Input
                          id="restaurantDistance"
                          type="number"
                          placeholder="Enter restaurant distance in meters"
                          variant="primary"
                          className="h-14"
                          value={field.value ?? 0}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                        <FieldError
                          errors={fieldState.error ? [fieldState.error] : []}
                        />
                      </Field>
                    )}
                  />

                  {/* Submit Button */}
                  <Field orientation="horizontal">
                    <Button
                      disabled={loading}
                      type="submit"
                      className="w-full h-14 text-base rounded-none"
                    >
                      Update
                    </Button>
                  </Field>

                </div>

              </FieldGroup>
            </FieldSet>
          </form>
        </div>
      </section>

      {/* RIGHT: User Avatar Panel */}
      <aside className="flex flex-2 h-full bg-side-panel pb-5 lg:pb-0 lg:py-5 rounded-lg lg:rounded-none">
        <div className="p-4 flex h-full w-full">
          {images?.map((image, index) => (
            <div key={index} className="w-20 h-20 relative">
              <Image src={image} alt="Image" fill />
            </div>
          ))}
          {/* <CldUploadWidget
          options={{
            multiple: true,
            cloudName: "lamadev",
            uploadPreset: "estate",
            folder: "posts",
          }}
          setState={setImages}
        /> */}
        </div>
      </aside>
    </>
  )
}

export default PropertyForm