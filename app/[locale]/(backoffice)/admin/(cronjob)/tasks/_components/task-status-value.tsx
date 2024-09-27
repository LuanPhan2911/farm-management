"use client";

import { Badge } from "@/components/ui/badge";

interface TaskStatusValueProps {
  status: "queued" | "working" | "success" | "failure";
}

export const TaskStatusValue = ({ status }: TaskStatusValueProps) => {
  if (status === "success") {
    return <Badge variant={"success"}>Success</Badge>;
  }
  if (status === "failure") {
    return <Badge variant={"destructive"}>Failure</Badge>;
  }
  if (status === "queued") {
    return <Badge variant={"edit"}>Queued</Badge>;
  }
  if (status === "working") {
    return <Badge variant={"info"}>Working</Badge>;
  }
  return <Badge variant={"cyanToBlue"}>Unknown</Badge>;
};
