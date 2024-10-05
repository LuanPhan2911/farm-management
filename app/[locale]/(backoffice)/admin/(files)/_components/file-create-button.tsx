import { DynamicDialogFooter } from "@/components/dialog/dynamic-dialog";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import { useTranslations } from "next-intl";

interface FileCreateButtonProps {}
export const FileCreateButton = ({}: FileCreateButtonProps) => {
  const t = useTranslations("files.form");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"icon"} variant={"outline"}>
          <Upload className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>{t("create.title")}</DialogTitle>
          <DialogDescription>{t("create.description")}</DialogDescription>
        </DialogHeader>

        <DynamicDialogFooter />
      </DialogContent>
    </Dialog>
  );
};
