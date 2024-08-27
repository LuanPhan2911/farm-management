import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrgDeleteButton } from "./org-delete-button";

export const OrgDanger = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Delete Organization</CardTitle>
        <CardDescription>
          This action is permanent and irreversible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OrgDeleteButton />
      </CardContent>
    </Card>
  );
};
