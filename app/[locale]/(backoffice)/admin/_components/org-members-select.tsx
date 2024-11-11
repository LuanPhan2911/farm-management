"use client";

import { useQuery } from "@tanstack/react-query";
import { Staff } from "@prisma/client";

import {
  ComboBoxCustom,
  ComboBoxCustomAppearance,
} from "@/components/form/combo-box";
import queryString from "query-string";
import { StaffSelectItem } from "./staffs-select";

interface OrgMembersSelect {
  query?: Record<string, any>;
  onChange: (value: string | undefined) => void;
  defaultValue?: string;
  disabled?: boolean;
  placeholder: string;
  notFound: string;
  error: string;
  appearance?: ComboBoxCustomAppearance;
}

export const OrgMembersSelect = (props: OrgMembersSelect) => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["org_members_select"],
    queryFn: async () => {
      const url = queryString.stringifyUrl({
        url: "/api/organizations/members/select",
        query: props.query,
      });
      const res = await fetch(url);
      return (await res.json()) as Staff[];
    },
  });

  return (
    <ComboBoxCustom
      {...props}
      data={data}
      isError={isError}
      isPending={isPending}
      refetch={refetch}
      valueKey="id"
      labelKey="name"
      renderItem={(item) => <StaffSelectItem {...item} />}
    />
  );
};
