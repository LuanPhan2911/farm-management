"use client";

import { ActivityCreateForm } from "@/app/[locale]/(backoffice)/admin/activities/_components/activity-create-button";
import { CreateButton } from "@/components/buttons/create-button";
import { useCurrentStaff } from "@/hooks/use-current-staff";
import { useParams } from "next/navigation";
import { useState } from "react";

export const CropActivityCreateButton = () => {
  const { currentStaff } = useCurrentStaff();
  const params = useParams<{ cropId: string }>();
  const [isOpen, setOpen] = useState(false);
  if (!currentStaff) {
    return null;
  }
  return (
    <CreateButton
      isOpen={isOpen}
      setOpen={setOpen}
      label="Create"
      className="max-w-5xl"
    >
      <ActivityCreateForm
        currentStaff={currentStaff}
        cropId={params?.cropId}
        onCreated={() => setOpen(false)}
        disabledField
      />
    </CreateButton>
  );
};
