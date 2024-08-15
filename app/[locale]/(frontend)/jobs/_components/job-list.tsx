import { ScrollArea } from "@/components/ui/scroll-area";
import { JobCardItem } from "./job-card-item";

import { Separator } from "@/components/ui/separator";

import { Card, CardContent } from "@/components/ui/card";
import { SearchBar } from "@/components/search-bar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getTranslations } from "next-intl/server";
import { getJobsCard } from "@/services/jobs";

interface JobListProps {
  query: string;
}
export const JobList = async ({ query }: JobListProps) => {
  const tCard = await getTranslations("jobs.card");
  const data = await getJobsCard(query);
  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex items-center px-4 py-2">
          <h1 className="text-xl font-bold">{tCard("title")}</h1>
        </div>
        <Separator />
        <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SearchBar placeholder={tCard("search.placeholder")} />
        </div>
        {query && !data.length && (
          <>
            <div className="text-sm font-semibold text-center">
              {tCard("search.notFound")} <Badge variant={"info"}>{query}</Badge>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              {tCard("search.typeOther")}
            </div>
          </>
        )}
        {!query && !data.length && (
          <div className="text-sm font-semibold text-center h-[400px] flex justify-center items-center">
            {tCard("noJob.label")}
          </div>
        )}
        {!!data.length && (
          <ScrollArea className="h-screen">
            <div className="flex flex-col gap-2 px-4 pt-0">
              {data.map((item) => {
                return <JobCardItem key={item.id} data={item} />;
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
