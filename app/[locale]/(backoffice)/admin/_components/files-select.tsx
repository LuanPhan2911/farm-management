"use client";

import { isImage } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { FileSelect } from "@/types";

import queryString from "query-string";
import Image from "next/image";
import {
  ComboBoxCustom,
  ComboBoxCustomAppearance,
} from "@/components/form/combo-box";

interface FilesSelectProps {
  onChange: (value: string | undefined) => void;
  placeholder: string;
  disabled?: boolean;
  error: string;
  notFound: string;
  defaultValue?: string;
  appearance?: ComboBoxCustomAppearance;
}
export const FilesSelect = (props: FilesSelectProps) => {
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

  return (
    <ComboBoxCustom
      {...props}
      data={data}
      isError={isError}
      isPending={isPending}
      refetch={refetch}
      labelKey="name"
      valueKey="url"
      renderItem={(item) => {
        return (
          <FileSelectItem name={item.name} type={item.type} url={item.url} />
        );
      }}
    />
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
