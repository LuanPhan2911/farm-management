"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../ui/button";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { UploadButton } from "../uploadthing";
import { ClientUploadedFileData } from "uploadthing/types";

interface UploadImageProps {
  defaultValue?: string | null;
  onChange: (url?: string) => void;
  disabled?: boolean;
}
export const UploadImage = ({
  defaultValue,
  disabled,
  onChange,
}: UploadImageProps) => {
  const onComplete = (
    res: ClientUploadedFileData<{
      uploadedBy: string;
    }>[]
  ) => {
    if (!res.length) {
      return;
    }
    const url = res[0].url;
    onChange(url);
  };
  return (
    <div className="flex justify-center items-center flex-col gap-2">
      <Card className="w-32 h-32">
        <CardContent className="flex aspect-square items-center justify-center p-6 relative">
          {defaultValue ? (
            <>
              <Button
                className="absolute right-1 top-1 w-5 h-5"
                disabled={disabled}
                variant={"destructive"}
                size={"icon"}
                type="button"
                onClick={() => {
                  onChange(undefined);
                }}
              >
                <X />
              </Button>
              <div className="relative inset-0 w-full h-full">
                <Image src={defaultValue} alt="Upload Image" fill />
              </div>
            </>
          ) : (
            <ImageIcon className="relative inset-0 w-full h-full" />
          )}
        </CardContent>
      </Card>

      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={onComplete}
        disabled={disabled}
      />
    </div>
  );
};
