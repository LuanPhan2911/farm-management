import { ScrollArea } from "@/components/ui/scroll-area";
import { JobCardItem } from "./job-card-item";

import { Separator } from "@/components/ui/separator";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SearchBar } from "@/components/search-bar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getTranslations } from "next-intl/server";
import { getJobsCard } from "@/services/jobs";

interface JobListProps {
  query: string;
  activeId?: string;
}
export const JobList = async ({ query, activeId }: JobListProps) => {
  const data = await getJobsCard(query);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-green-500">Công việc</CardTitle>
        <CardDescription>
          Danh sách công việc tuyển dụng ở nông trại
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="my-4">
          <SearchBar placeholder={"Tìm kiểm theo tên việc làm"} />
        </div>

        {query && !data.length && (
          <>
            <div className="text-sm font-semibold text-center">
              Không tìm thấy việc làm: <Badge variant={"info"}>{query}</Badge>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Vui lòng tìm tên khác
            </div>
          </>
        )}
        {!query && !data.length && (
          <div className="text-sm font-semibold text-center h-[400px] flex justify-center items-center">
            Hiện tại không có việc làm tuyển dụng
          </div>
        )}
        {!!data.length && (
          <ScrollArea className="h-screen">
            <div className="flex flex-col gap-2">
              {data.map((item) => {
                return (
                  <JobCardItem
                    key={item.id}
                    data={item}
                    active={activeId === item.id}
                  />
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
export const JobListSkeleton = () => {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="px-4 py-2">
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="my-4">
          <Skeleton className="h-48 w-full" />
        </div>
      </CardContent>
    </Card>
  );
};
