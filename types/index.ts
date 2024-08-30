import {
  Field,
  Gender,
  JobExperience,
  JobWorkingState,
  Unit,
} from "@prisma/client";

export type OrgRole = "org:member" | "org:admin";
export type ActionResponse = {
  message: string;
  ok: boolean;
  data?: any;
};
export type PaginatedResponse<T> = {
  data: T[];
  totalPage: number;
};
export type BreadCrumb = {
  label: string;
  href?: string;
};
export type JobTable = {
  id: string;
  name: string;
  quantity: number;
  experience: JobExperience;
  gender: Gender;
  published: boolean;
  expiredAt: Date;
};
export type JobCard = {
  id: string;
  name: string;
  createdAt: Date;
  gender: Gender;
  slug: string;
  wage: string;
  experience: JobExperience;
  workingState: JobWorkingState;
  expiredAt: Date;
};
export type JobSelect = {
  id: string;
  name: string;
};

export type UnitSelect = {
  id: string;
  name: string;
};

export type FieldWithUnit = Field & {
  unit: Unit | null;
};
