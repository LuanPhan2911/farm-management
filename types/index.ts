import {
  Field,
  FloatUnit,
  Gender,
  IntUnit,
  JobExperience,
  JobWorkingState,
  Soil,
  SoilType,
  Staff,
  Unit,
  Weather,
  WeatherStatus,
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
export type Breadcrumb = {
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

export type WeatherTable = Weather & {
  confirmedBy: Staff | null;
  temperature: FloatUnit & {
    unit: {
      name: string;
    };
  };
  humidity: IntUnit & {
    unit: {
      name: string;
    };
  };
  atmosphericPressure: FloatUnit & {
    unit: {
      name: string;
    };
  };
  rainfall: IntUnit & {
    unit: {
      name: string;
    };
  };
};
export type WeatherStatusCount = {
  status: WeatherStatus;
  _count: number;
};
export type SoilTypeCount = {
  type: SoilType;
  _count: number;
};
export type SoilTable = Soil & {
  confirmedBy: Staff | null;
  moisture: IntUnit & {
    unit: {
      name: string;
    };
  };
  nutrientUnit: {
    name: string;
  };
};
