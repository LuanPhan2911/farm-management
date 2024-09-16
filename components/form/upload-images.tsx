"use client";

import { UploadButton } from "../uploadthing";
import { ClientUploadedFileData } from "uploadthing/types";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "../ui/button";

export type ImageData = { key: string; url: string };
interface UploadImagesProps {
  getImages: (images: ImageData[]) => void;
  disabled?: boolean;
  defaultImage?: ImageData[];
}
export const UploadImages = ({
  getImages,
  disabled,
  defaultImage = [],
}: UploadImagesProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [images, setImages] = useState<ImageData[]>(defaultImage);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap() + 1);
    setCount(images.length);
    getImages(images);
  }, [api, images, getImages]);

  const onComplete = (
    res: ClientUploadedFileData<{
      uploadedBy: string;
    }>[]
  ) => {
    const data: ImageData[] = res.map(({ key, url }) => {
      return { key, url };
    });
    setImages((prev) => {
      return [...data, ...prev];
    });
  };
  const handleRemoveImage = (key: string) => {
    setImages((prev) => {
      return prev.filter((image) => image.key !== key);
    });
  };
  return (
    <div className="flex flex-col justify-center items-center">
      {images.length > 0 && (
        <>
          <Carousel setApi={setApi} className="w-44 h-44">
            <CarouselContent>
              {images.map(({ key, url }) => (
                <CarouselItem key={key}>
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6 relative">
                      <Button
                        className="absolute right-1 top-1 w-5 h-5"
                        variant={"destructive"}
                        size={"icon"}
                        type="button"
                        onClick={() => handleRemoveImage(key)}
                      >
                        <X />
                      </Button>
                      <div className="relative inset-0 w-full h-full">
                        <Image src={url} alt="Upload Image" fill />
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            {images.length > 1 && (
              <>
                <CarouselPrevious type="button" />
                <CarouselNext type="button" />
              </>
            )}
          </Carousel>
          <div className="py-2 text-center text-sm text-muted-foreground">
            Images {current} of {count}
          </div>
        </>
      )}

      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={onComplete}
        disabled={disabled}
      />
    </div>
  );
};
