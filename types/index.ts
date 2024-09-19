import {
  ApplicantStatus,
  Category,
  Crop,
  Equipment,
  EquipmentType,
  Fertilizer,
  FertilizerType,
  Field,
  FloatUnit,
  Frequency,
  Gender,
  IntUnit,
  JobExperience,
  JobWorkingState,
  Pesticide,
  PesticideType,
  Plant,
  Soil,
  SoilType,
  Staff,
  ToxicityLevel,
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
export type CategorySelect = {
  id: string;
  name: string;
};

export type ApplicantTable = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  note?: string | null;
  status: ApplicantStatus;
};
export type FieldTable = Field & {
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
export type PlantTable = Plant & {
  category: Category;
  idealTemperature:
    | (FloatUnit & {
        unit: {
          name: string;
        };
      })
    | null;
  idealHumidity:
    | (IntUnit & {
        unit: {
          name: string;
        };
      })
    | null;
  waterRequirement:
    | (FloatUnit & {
        unit: {
          name: string;
        };
      })
    | null;
};
export type PlantSelect = {
  id: string;
  name: string;
  imageUrl: string | null;
};
export type FertilizerTable = Fertilizer & {
  recommendedDosage:
    | (FloatUnit & {
        unit: {
          name: string;
        };
      })
    | null;
};
export type FertilizerTypeCount = {
  type: FertilizerType;
  _count: number;
};
export type FertilizerFrequencyCount = {
  frequencyOfUse: Frequency;
  _count: number;
};

export type PesticideTable = Pesticide & {
  recommendedDosage:
    | (FloatUnit & {
        unit: {
          name: string;
        };
      })
    | null;
  withdrawalPeriod:
    | (IntUnit & {
        unit: {
          name: string;
        };
      })
    | null;
};

export type PesticideTypeCount = {
  type: PesticideType;
  _count: number;
};
export type PesticideToxicityLevelCount = {
  toxicityLevel: ToxicityLevel;
  _count: number;
};

export type EquipmentTable = Equipment & {
  purchasePrice: FloatUnit & {
    unit: {
      name: string;
    };
  };
};

export type EquipmentTypeCount = {
  type: EquipmentType;
  _count: number;
};

export type CropTable = Crop & {
  actualYield:
    | (FloatUnit & {
        unit: {
          name: string;
        };
      })
    | null;
  estimatedYield:
    | (FloatUnit & {
        unit: {
          name: string;
        };
      })
    | null;
  plant: {
    id: string;
    name: string;
  };
};
