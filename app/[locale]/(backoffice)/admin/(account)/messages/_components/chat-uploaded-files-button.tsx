"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { FilesTable } from "../../../(files)/_components/files-table";

interface ChatUploadedFileButtonProps {
  isPublic?: boolean;
  orgId?: string;
  ownerId?: string;
}
export const ChatUploadedFileButton = (props: ChatUploadedFileButtonProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          size={"sm"}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          Uploaded Files
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Files</DialogTitle>
          <DialogDescription>Uploaded file in message</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
