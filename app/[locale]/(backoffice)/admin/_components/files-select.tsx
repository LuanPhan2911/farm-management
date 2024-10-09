"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { isImage } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { FileSelect } from "@/types";

import queryString from "query-string";
import { ErrorButton } from "@/components/buttons/error-button";
import Image from "next/image";
import { ComboBoxCustom } from "@/components/form/combo-box";

interface FilesSelectProps {
  onChange: (value: string | undefined) => void;
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

  if (isPending) {
    return <Skeleton className="w-full h-12"></Skeleton>;
  }
  if (isError) {
    return <ErrorButton title={errorLabel} refresh={refetch} />;
  }

  return (
    <ComboBoxCustom
      options={data}
      labelKey="name"
      valueKey="url"
      label={placeholder}
      notFound={notFound}
      onChange={onChange}
      defaultValue={defaultValue}
      renderItem={(item) => {
        return (
          <FileSelectItem name={item.name} type={item.type} url={item.url} />
        );
      }}
      appearance={{
        button: "lg:w-full",
        content: "lg:w-[480px]",
      }}
      disabled={disabled}
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
