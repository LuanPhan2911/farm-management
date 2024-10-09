"use client";
import { create } from "@/actions/file";
import { InputUploadFile, UploadFiles } from "@/components/form/upload-files";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { File } from "@prisma/client";
import { Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface FileCreateButtonProps {
  input?: InputUploadFile;
}
export const FileCreateButton = ({ input }: FileCreateButtonProps) => {
  const t = useTranslations("files.form");

  const [isPending, setPending] = useState(false);
  const onCreateCompleted = (files: File[]) => {
    if (!files.length) {
      return;
    }
    const [file] = files;
    create(file);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"sm"} variant={"success"}>
          <Upload className="h-4 w-4 mr-2" /> {t("create.label")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>{t("create.title")}</DialogTitle>
          <DialogDescription>{t("create.description")}</DialogDescription>
        </DialogHeader>
        <UploadFiles
          onUploadCompleted={onCreateCompleted}
          setUploading={setPending}
          disabled={isPending}
          mode="manual"
          input={input}
        />
      </DialogContent>
    </Dialog>
  );
};
