"use client";
import { CldUploadWidget } from "next-cloudinary";
import { Image, Upload } from "lucide-react";
interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
}

export function ImageUploader({ onUploadSuccess }: ImageUploaderProps) {
  
  return (
    <CldUploadWidget
      uploadPreset={"ml_default"}
      signatureEndpoint="/api/sign-cloudinary-params"
      onSuccess={async (result) => {
        if (typeof result.info === "object" && "secure_url" in result.info) {
          await onUploadSuccess(result.info.secure_url);            
        }
      }}
      options={{
        singleUploadAutoClose: true,
      }}
    >
      {({ open }) => (
        <button
          type="button"
          onClick={() => open()}
          className="flex items-center justify-center rounded-full"
        >
          <Image className="" />
          
        </button>
      )}
    </CldUploadWidget>
  );
}
