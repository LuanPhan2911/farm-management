"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Organization } from "@clerk/nextjs/server";
import { PaginatedResponse } from "@/types";

import { QueryProvider } from "@/components/providers/query-provider";
import queryString from "query-string";
import { useDebounceValue } from "usehooks-ts";
import { ErrorButton } from "@/components/buttons/error-button";
import { SelectItemContent } from "@/components/form/select-item";

export type pageParam = number | undefined;
interface OrgsSelectProps {
  defaultValue?: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  label: string;
  errorLabel: string;
  notFound: string;
}
const OrgsSelect = ({
  onChange,
  defaultValue,
  disabled,
  label,
  errorLabel,
  notFound,
}: OrgsSelectProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debounceQuery, setDebounceQuery] = useDebounceValue("", 700);
  const [value, setValue] = useState(defaultValue || "");

  const {
    data: dataSelect,
    isPending: isPendingSelect,
    isError: isErrorSelect,
    refetch: refetchSelect,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["orgs_select", debounceQuery],
    queryFn: async ({ pageParam }: { pageParam: pageParam }) => {
      const url = queryString.stringifyUrl(
        {
          url: "/api/organizations/",
          query: {
            page: pageParam,
            query: debounceQuery,
          },
        },
        {
          skipEmptyString: true,
        }
      );
      const res = await fetch(url);
      return (await res.json()) as PaginatedResponse<Organization>;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      return lastPageParam < lastPage.totalPage ? lastPageParam + 1 : undefined;
    },
  });

  const onSelect = (currentValue: string) => {
    setValue(currentValue === value ? "" : currentValue);
    onChange(currentValue === value ? "" : currentValue);
    setOpen(false);
  };

  if (isPendingSelect) {
    return <Skeleton className="w-full h-12"></Skeleton>;
  }
  if (isErrorSelect) {
    return <ErrorButton title={errorLabel} refresh={refetchSelect} />;
  }
  const organizations: Organization[] = [];
  dataSelect.pages.forEach((page) => {
    page.data.forEach((item) => {
      organizations.push(item);
    });
  });
  const currentOrg = organizations.find((item) => item.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {currentOrg ? (
            <SelectItemContent
              imageUrl={currentOrg.imageUrl}
              title={currentOrg.name}
            />
          ) : (
            label
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[450px] p-0" side="bottom">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={label}
            value={query}
            onValueChange={(search) => {
              setQuery(search);
              setDebounceQuery(search);
            }}
          />
          <CommandList>
            <CommandEmpty>{notFound}</CommandEmpty>
            <CommandGroup>
              {organizations.map((item) => {
                return (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={onSelect}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === item.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <SelectItemContent
                      imageUrl={item.imageUrl}
                      title={item.name}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandGroup className="flex justify-center">
              <Button
                size={"sm"}
                variant={"link"}
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
              >
                {isFetchingNextPage
                  ? "Loading more..."
                  : hasNextPage
                  ? "Load More"
                  : "Nothing more to load"}
              </Button>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export const OrgsSelectWithQueryClient = (props: OrgsSelectProps) => {
  return (
    <QueryProvider>
      <OrgsSelect {...props} />
    </QueryProvider>
  );
};
