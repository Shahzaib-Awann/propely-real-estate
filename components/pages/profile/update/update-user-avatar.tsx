"use client";

import { defaultAppSettings } from "@/lib/constants";
import Image from "next/image";
import { useState } from "react";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";



const UpdateUserAvatar = ({ avatar: image }: { avatar: string | null }) => {

  /* === Local State === */
  const [avatar, setAvatar] = useState(image);
  const [isUploading, setIsUploading] = useState(false);

  /* === Upload Success Handler === */
  async function handleUploadSuccess(info: CloudinaryUploadWidgetInfo) {
    try {
      const response = await fetch("/api/profile/update/avatar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          avatarUrl: info.secure_url,
          avatarPublicId: info.public_id,
        }),
      });

      // Handle responses
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        console.error("Avatar update failed:", response.status, errorBody);
        toast.error("Could not save avatar", {
          id: "avatar-upload",
        });
        return;
      }

      // === Success ===
      setAvatar(info.secure_url);
      toast.success("Avatar updated successfully", {
        id: "avatar-upload",
      });
    } catch (error) {
      console.error("Avatar update request error:", error);
      toast.error("Network error occurred while saving avatar.", {
        id: "avatar-upload",
      });
    }
  }

  return (
    <div className="my-auto mx-auto">

      {/* === Avatar Preview === */}
      <div className="size-48 rounded-lg overflow-hidden relative shadow">
        <Image
          src={avatar ?? defaultAppSettings.placeholderPostImage}
          alt="Avatar"
          fill
          sizes="192px"
          className="object-cover hover:scale-110 transition-all duration-200"
        />
      </div>

      {/* === Cloudinary Upload Widget === */}
      <CldUploadWidget
        signatureEndpoint="/api/cloudinary/sign-upload"
        options={{
          multiple: false,
          folder: "avatars",
          maxImageFileSize: 1 * 1024 * 1024, // <-- 1MB
          singleUploadAutoClose: false,
          clientAllowedFormats: ["jpg", "jpeg", "png"],
        }}
        uploadPreset="propely-real-estate"
        onQueuesStart={() => {
          setIsUploading(true);
          toast.loading("Uploading avatar...", { 
            id: "avatar-upload" 
          });
        }}
        onSuccess={(results) => {
          if (!results?.info || typeof results.info !== "object") return;
          handleUploadSuccess(
            results.info
          );
        }}
        onError={() => {
          toast.error("upload failed", {
            id: "avatar-upload",
          });
        }}
        onQueuesEnd={(_, { widget }) => {
          setIsUploading(false);
          widget.close();
        }}
      >
        {({ open }) => {

          return (
            <Button
              onClick={() => {
                open();
              }}
              disabled={isUploading}
              className="w-48 h-12 text-base rounded-none mt-5"
            >
              {isUploading ? "Uploading..." : "Upload an Image"}
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default UpdateUserAvatar;