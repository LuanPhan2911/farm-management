import {
  JobCardDisplayItem,
  JobCardDisplayItemSkeleton,
} from "./job-card-display-item";

import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { Job } from "@prisma/client";

interface JobCardDisplayProps {
  data: Job | null;
}
export const JobCardDisplay = async ({ data }: JobCardDisplayProps) => {
  if (!data) {
    return (
      <div className="flex flex-col gap-y-4 justify-center items-center h-[400px]">
        <div className="text-center text-lg font-semibold">
          Hiện tại không có việc làm tuyển dụng
        </div>
        <Link href={"/"}>
          <Button variant={"success"}>Trang chủ</Button>
        </Link>
      </div>
    );
  }

  return <JobCardDisplayItem data={data} />;
};

export const JobCardDisplaySkeleton = () => {
  return <JobCardDisplayItemSkeleton />;
};
