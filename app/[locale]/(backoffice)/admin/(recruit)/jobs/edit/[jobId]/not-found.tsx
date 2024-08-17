"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

const JobEditNotFound = () => {
  const tNotFound = useTranslations("jobs.notFound");
  return (
    <div className="flex flex-col gap-y-4 h-[500px] justify-center items-center">
      <h2 className="text-lg text-muted-foreground font-semibold">
        {tNotFound("title")}
      </h2>
      <Link href={"/dashboard/jobs"}>
        <Button variant={"secondary"} size={"lg"}>
          {tNotFound("backButton")}
        </Button>
      </Link>
    </div>
  );
};

export default JobEditNotFound;
