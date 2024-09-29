"use client";

import { ScheduleEditSheet } from "@/app/[locale]/(backoffice)/admin/(cronjob)/schedules/_components/schedule-edit-button";
import { TaskEditSheet } from "@/app/[locale]/(backoffice)/admin/(cronjob)/tasks/_components/task-edit-button";

export const SheetProvider = () => {
  return (
    <>
      <TaskEditSheet />
      <ScheduleEditSheet />
    </>
  );
};
