"use client";

import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import { UploadButton } from "../uploadthing";
import { ClientUploadedFileData } from "uploadthing/types";

interface UploadImageProps {
  defaultValue?: string | null;
  onChange: (url: string) => void;
  disabled?: boolean;
}
export const UploadImage = ({
  defaultValue,
  disabled,
  onChange,
}: UploadImageProps) => {
  const [imageUrl, setImageUrl] = useState(defaultValue || "");
  const onComplete = (
    res: ClientUploadedFileData<{
      uploadedBy: string;
    }>[]
  ) => {
    if (!res.length) {
      return;
    }
    const url = res[0].url;
    setImageUrl(url);
    onChange(url);
  };
  const onRemove = () => {
    setImageUrl("");
    onChange("");
  };
  return (
    <div className="flex justify-center items-center flex-col gap-2">
      {!!imageUrl && (
        <Card className="w-32 h-32">
          <CardContent className="flex aspect-square items-center justify-center p-6 relative">
            <Button
              className="absolute right-1 top-1 w-5 h-5"
              variant={"destructive"}
              size={"icon"}
              type="button"
              onClick={onRemove}
            >
              <X />
            </Button>
            <div className="relative inset-0 w-full h-full">
              <Image src={imageUrl} alt="Upload Image" fill />
            </div>
          </CardContent>
        </Card>
      )}
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={onComplete}
        disabled={disabled}
      />
    </div>
  );
};
