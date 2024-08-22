import { Gender, JobExperience, JobWorkingState } from "@prisma/client";

export type ActionResponse = {
  message: string;
  ok: boolean;
};
export type PaginatedResourceResponse<T> = {
  data: T[];
  totalCount: number;
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
