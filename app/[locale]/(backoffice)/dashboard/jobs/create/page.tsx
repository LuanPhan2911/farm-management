"use client";
import { Heading } from "../../_components/heading";
import { JobCreateForm } from "../_components/job-create-button";

const JobCreatePage = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <Heading title="Create Job" />
      <JobCreateForm />
    </div>
  );
};

export default JobCreatePage;
