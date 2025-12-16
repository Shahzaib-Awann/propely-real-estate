"use client";

import { defaultAppSettings } from "@/lib/constants";
import Image from "next/image";
import { useRef, useState } from "react";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { Button } from "@/components/ui/button";



const UpdateUserAvatar = ({ avatar: image }: { avatar: string | null }) => {
  const [avatar, setAvatar] = useState(image);
  const widgetRef = useRef<any>(null);

  return (
    <div className="my-auto mx-auto">
      <div className="size-48 rounded-lg overflow-hidden relative shadow">
        <Image
          src={avatar ?? defaultAppSettings.placeholderPostImage}
          alt="Avatar"
          fill
          className="object-cover hover:scale-110 transition-all duration-200"
        />
      </div>

      <CldUploadWidget
        signatureEndpoint="/api/cloudinary/sign-upload"
        options={{
          multiple: false,
          folder: "avatars",
          maxImageFileSize: 1 * 1024 * 1024, // 1MB
        }}
        uploadPreset="propely-real-estate"
        onSuccess={(results, { widget }) => {
          console.log("onSuccess fired:", results);

          if (!results?.info || typeof results.info !== "object") return;

          const info = results.info as CloudinaryUploadWidgetInfo;

          console.log("Uploaded asset:", info);

          fetch("/api/user/avatar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              secureUrl: info.secure_url,
              publicId: info.public_id,
            }),
          });
        }}
        onQueuesEnd={(_, { widget }) => {
          widget.close();
        }}
      >
        {({ open, widget }) => {
          widgetRef.current = widget;

          return (
            <Button
              onClick={() => {
                open();
              }}
              className="w-48 h-12 text-base rounded-none mt-5"
            >
              Upload an Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default UpdateUserAvatar;
