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
import { cn, isImage } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { FileSelect } from "@/types";

import queryString from "query-string";
import { ErrorButton } from "@/components/buttons/error-button";
import Image from "next/image";

interface FilesSelectProps {
  onChange: (file: FileSelect | undefined) => void;
  placeholder: string;
  disabled?: boolean;
  errorLabel: string;
  notFound: string;
  defaultValue?: string;
}
export const FilesSelect = ({
  errorLabel,
  notFound,
  onChange,
  disabled,
  placeholder,
  defaultValue,
}: FilesSelectProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    if (!defaultValue) {
      setValue(undefined);
    }
  }, [defaultValue]);

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["files_select"],
    queryFn: async () => {
      const url = queryString.stringifyUrl(
        {
          url: "/api/files/select",
        },
        {
          skipNull: true,
          skipEmptyString: true,
        }
      );
      const res = await fetch(url);
      return (await res.json()) as FileSelect[];
    },
  });

  const onSelect = (currentValue: string) => {
    setValue(currentValue);
    onChange(data?.find((item) => item.url === currentValue));
    setOpen(false);
  };

  if (isPending) {
    return <Skeleton className="w-full h-12"></Skeleton>;
  }
  if (isError) {
    return <ErrorButton title={errorLabel} refresh={refetch} />;
  }

  const currentData = data?.find((item) => item.url === value);

  const searchData = data?.reduce(
    (obj, item) => ({ ...obj, [item.url]: item.name.toLowerCase() }),
    {} as Record<string, string>
  );
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {currentData ? (
            <FileSelectItem
              name={currentData.name}
              type={currentData.type}
              url={currentData.url}
            />
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[450px] p-0">
        <Command
          filter={(value, search) => {
            return searchData[value].includes(search.toLowerCase()) ? 1 : 0;
          }}
        >
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{notFound}</CommandEmpty>
            <CommandGroup>
              {data.map((item) => {
                return (
                  <CommandItem
                    key={item.url}
                    value={item.url}
                    onSelect={onSelect}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === item.url ? "opacity-100" : "opacity-0"
                      )}
                    />

                    <FileSelectItem
                      name={item.name}
                      type={item.type}
                      url={item.url}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

interface FileSelectItemProps {
  type: string;
  url: string;
  name: string;
}
const FileSelectItem = ({ name, type, url }: FileSelectItemProps) => {
  return isImage(type) ? (
    <div className="flex items-center p-1 gap-x-2">
      <div className="h-8 w-8 relative rounded-lg">
        <Image src={url} alt="Image" fill />
      </div>
      <div className="ml-4">
        <div className="text-sm font-medium leading-none text-start">
          {name}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center p-1 gap-x-2">
      <div className="h-8 w-8 flex items-center justify-center border rounded-lg">
        <span className="text-blue-300">{type}</span>
      </div>
      <div className="ml-4">
        <div className="text-sm font-medium leading-none text-start">
          {name}
        </div>
      </div>
    </div>
  );
};
