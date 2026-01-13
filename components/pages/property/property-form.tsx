"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

import { useForm, Controller, useFieldArray } from "react-hook-form";
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
import { Trash, X } from "lucide-react";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { cn } from "@/lib/utils/general";



type PropertyFormProps = {
  mode: "create" | "edit";
  property?: Partial<z.output<typeof createOrUpdatePostSchema>>;
};



const PropertyForm = ({ mode, property }: PropertyFormProps) => {

  /* === Local State === */
  const [loading, setLoading] = useState(false);
  const [imagesUploadLoading, setImagesUploadLoading] = useState(false);
  const router = useRouter()
  const [images, setImages] = useState<{ id: number | null; imageUrl: string; publicId: string }[]>([]);
  const [imageRemoveLoading, setImageRemoveLoading] = useState(false);

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
      postImages: property?.postImages ?? [],
      postFeatures: property?.postFeatures ?? [{
        id: null,
        title: "",
        description: ""
      }],
    },
  });

  /* === Dynamic Property Features === */
  const { fields: featureFields, append: addFeature, remove: removeFeature } = useFieldArray({
    control: form.control,
    name: "postFeatures",
  });

  /* === Sync images with form state === */
  useEffect(() => {
    form.setValue("postImages", images);
  }, [images, form]);

  /* === Submit Handler === */
  async function onSubmit(values: z.infer<typeof createOrUpdatePostSchema>) {

    const API_URL = "/api/property";

    const requestOptions = {
      method: mode === "create" ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }

    setLoading(true);
    toast.loading("Saving property...", {
      id: "property-loading",
    });

    try {
      const response = await fetch(API_URL, requestOptions);
      const result = await response.json();

      // Map HTTP status codes to error messages
      const errorMap: Record<number, string> = {
        422: "Invalid Property data. Please check your inputs.",
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
      router.push(`/property/${result?.propertyId}`)

    } catch (error) {
      console.error("Property save failed:", error);
      toast.error(
        "Network error occurred. Please check your connection and try again.", {
        id: "property-loading",
      });

    } finally {
      setLoading(false);
      toast.dismiss("property-loading");
    }
  }

  // === Remove image from Cloudinary and local state ===
  async function handleRemoveImage(index: number) {
    const img = images[index];

    try {
      setImageRemoveLoading(true)

      // Delete image from Cloudinary via API
      await fetch("/api/cloudinary/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: img.publicId }),
      });

      // On successful deletion, remove the image from local state
      setImages((prev) => prev.filter((_, i) => i !== index));

    } catch {
      toast.error("Could not remove image from Cloudinary");
    } finally {
      setImageRemoveLoading(false)
    }
  }

  /* === Form Validation Error Handler === */
  const onError = () => {
    toast.error("All fields are required.");
  };

  return (
    <>
      {/* LEFT: User Info Form */}
      <section className="flex-3 lg:h-full">
        <div className="flex flex-col gap-10 py-5 pr-0 pb-12 lg:pr-10 overflow-y-visible lg:overflow-y-auto h-auto lg:h-full">
          <h1 className='text-2xl font-semibold'>{mode === "create" ? "Add New Property" : "Edit Property"}</h1>
          <form onSubmit={form.handleSubmit(onSubmit, onError)}>
            <FieldSet>
              <FieldGroup>

                {/* Title + Price + Size (sqft) */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
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
                </div>


                {/* Description */}
                <div className="border p-4 relative">
                  <h1 className="absolute z-10 -top-3 bg-background w-fit px-2 py-1 border text-sm">Description</h1>
                  <Controller
                    name="postDetails.description"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error} >
                        <FieldLabel htmlFor="description" hidden>description</FieldLabel>
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
                </div>


                {/* Adsress + City + State */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
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

                  {/* State */}
                  <Controller
                    name="postDetails.state"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel htmlFor="state">State</FieldLabel>
                        <Input
                          id="state"
                          type="text"
                          placeholder="Enter State"
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


                {/* Bedrooms + Bathrooms + Property Type */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
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


                {/* Latitude+ Longitude + Listing Type*/}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
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
                </div>


                {/* Income Policy + Utilities Policy + Pet Policy */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
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

                {/* School Distance + Bus Distance + Restaurant Distance */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-2 items-end">
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

                </div>

                {/* Dynamic Features */}
                <div className="pt-8 space-y-4 border p-4 relative">
                  <h1 className="absolute z-10 -top-3 bg-background px-2 py-1 border text-sm">Features</h1>
                  {featureFields.map((item, index) => (
                    <div key={item.id} className="flex flex-col sm:flex-row gap-2 items-end">
                      {/* Feature Title */}
                      <Controller
                        name={`postFeatures.${index}.title`}
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={!!fieldState.error}>
                            <FieldLabel>Feature Title</FieldLabel>
                            <Input
                              {...field}
                              placeholder="Feature name (e.g. Gym, Parking)"
                              variant="primary"
                              className="h-14"
                            />
                            <FieldError
                              errors={fieldState.error ? [fieldState.error] : []}
                            />
                          </Field>
                        )}
                      />

                      <div className="w-full flex flex-row items-end gap-2">
                        {/* Feature Description */}
                        <Controller
                          name={`postFeatures.${index}.description`}
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={!!fieldState.error}>
                              <FieldLabel>Feature Description</FieldLabel>
                              <Input
                                {...field}
                                placeholder="Short detail (e.g. On-site, Free)"
                                variant="primary"
                                className="h-14"
                              />
                              <FieldError
                                errors={fieldState.error ? [fieldState.error] : []}
                              />
                            </Field>
                          )}
                        />

                        {/* Remove Button */}
                        <Button
                          type="button"
                          variant="destructive"
                          className="h-14 aspect-square sm:aspect-auto"
                          onClick={() => removeFeature(index)}
                        >
                          <Trash />
                          <span className="sm:block hidden">Remove</span>
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Add New Feature */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      addFeature({
                        id: null,
                        title: "",
                        description: "",
                      })
                    }
                  >
                    + Add Feature
                  </Button>
                </div>


                {/* Submit Button */}
                <Field orientation="horizontal">
                  <Button
                    disabled={loading}
                    type="submit"
                    className="w-full h-14 text-base rounded-none"
                  >
                    {mode === 'create' ? 'Submit' : 'Update'}
                  </Button>
                </Field>

              </FieldGroup>
            </FieldSet>
          </form>
        </div>
      </section>

      {/* RIGHT: Property Images Panel */}
      <aside className="flex flex-2 h-full bg-side-panel pb-5 lg:pb-0 lg:py-5 rounded-lg lg:rounded-none">
        <div className="p-4 flex flex-col gap-4 h-full w-full">
          <div className="my-auto">

            {/* Responsive image grid with vertical scrolling */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 scroll-y-auto max-h-[70dvh] overflow-y-auto pr-2">
              {images?.map((img, index) => (
                <div key={index} className="relative w-full aspect-video border rounded overflow-hidden shadow-sm">
                  <Image
                    src={img.imageUrl}
                    alt="Property Image"
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 50vw"
                    className={cn(
                      "object-cover hover:scale-110 transition-all duration-200",
                      imageRemoveLoading ? 'opacity-75' : 'opacity-100')}
                  />

                  {/* Remove image button */}
                  <Button
                    type="button"
                    size={"icon"}
                    disabled={imageRemoveLoading}
                    onClick={() =>
                      handleRemoveImage(index)
                    }
                    className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1 rounded"
                  >
                    <X />
                  </Button>
                </div>
              ))}
            </div>

            {/* Cloudinary upload widget for adding multiple property images */}
            <CldUploadWidget
              signatureEndpoint="/api/cloudinary/sign-upload"
              options={{
                multiple: true,
                maxFiles: 10,
                folder: "properties",
                maxImageFileSize: 2 * 1024 * 1024, // <-- 2MB
                clientAllowedFormats: ["jpg", "jpeg", "png"],
                showCompletedButton: true,
                singleUploadAutoClose: false,
              }}
              uploadPreset="propely-real-estate"
              onQueuesStart={() => {
                setImagesUploadLoading(true);
                toast.loading("Uploading avatar...", {
                  id: "images-upload"
                });
              }}
              onSuccess={(results) => {
                if (!results?.info || typeof results.info !== "object") return;

                const info = results.info as CloudinaryUploadWidgetInfo;
                if (
                  typeof info.secure_url !== "string" ||
                  typeof info.public_id !== "string"
                ) {
                  return;
                }

                setImages((prev) => [
                  ...prev,
                  {
                    id: null,
                    imageUrl: info.secure_url,
                    publicId: info.public_id,
                  },
                ]);
              }}
              onError={() => {
                toast.error("upload failed", {
                  id: "images-upload",
                });
              }}
              onQueuesEnd={(_, { widget }) => {
                toast.dismiss("images-upload");
                setImagesUploadLoading(false);
                widget.close();
              }}
            >
              {({ open }) => (
                <div className="flex flex-row justify-center w-full">

                  {/* Upload images button */}
                  <Button
                    onClick={() => {
                      open();
                    }}
                    disabled={imagesUploadLoading}
                    className="w-48 h-12 text-base rounded-none mt-5"
                  >
                    {imagesUploadLoading ? "Uploading..." : "Upload Images"}
                  </Button>
                </div>
              )}
            </CldUploadWidget>

          </div>
        </div>
      </aside>
    </>
  )
}

export default PropertyForm