import {
  ApplicantStatus,
  Category,
  Crop,
  Equipment,
  EquipmentType,
  Fertilizer,
  FertilizerType,
  Field,
  File,
  FloatUnit,
  Frequency,
  Gender,
  IntUnit,
  JobExperience,
  JobWorkingState,
  Message,
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
import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIoServer } from "socket.io";

export type OrgRole = "org:member" | "org:admin";

export type NextApiResponseServerIo<T> = NextApiResponse<T> & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIoServer;
    };
  };
};
export type ActionResponse = {
  message: string;
  ok: boolean;
  data?: any;
};
export type PaginatedResponse<T> = {
  data: T[];
  totalPage: number;
};
export type PaginatedWithCursorResponse<T> = {
  items: T[];
  nextCursor?: string | null | number;
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
export type UnusedUnitCount = {
  floatUnit: number;
  intUnit: number;
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
  temperature:
    | (FloatUnit & {
        unit: {
          name: string;
        } | null;
      })
    | null;
  humidity:
    | (IntUnit & {
        unit: {
          name: string;
        } | null;
      })
    | null;
  atmosphericPressure:
    | (FloatUnit & {
        unit: {
          name: string;
        } | null;
      })
    | null;
  rainfall:
    | (IntUnit & {
        unit: {
          name: string;
        } | null;
      })
    | null;
};
export type WeatherStatusCount = {
  status: WeatherStatus;
  _count: number;
};
export type WeatherChart = {
  id: string;
  confirmedAt: Date | null;
  createdAt: Date;
  status: WeatherStatus;
  temperature:
    | (FloatUnit & {
        unit: {
          name: string;
        } | null;
      })
    | null;
  humidity:
    | (IntUnit & {
        unit: {
          name: string;
        } | null;
      })
    | null;
  atmosphericPressure:
    | (FloatUnit & {
        unit: {
          name: string;
        } | null;
      })
    | null;
  rainfall:
    | (IntUnit & {
        unit: {
          name: string;
        } | null;
      })
    | null;
};
export type SoilTypeCount = {
  type: SoilType;
  _count: number;
};
export type SoilTable = Soil & {
  confirmedBy: Staff | null;
  moisture:
    | (IntUnit & {
        unit: {
          name: string;
        } | null;
      })
    | null;
  nutrientUnit: {
    name: string;
  } | null;
};

export type SoilChart = {
  createdAt: Date;
  confirmedAt: Date | null;
  id: string;
  ph: number | null;
  nutrientNitrogen: number | null;
  nutrientPhosphorus: number | null;
  nutrientPotassium: number | null;
  moisture:
    | (IntUnit & {
        unit: {
          name: string;
        } | null;
      })
    | null;
};
export type PlantTable = Plant & {
  category: Category;
  idealTemperature:
    | (FloatUnit & {
        unit: {
          name: string;
        } | null;
      })
    | null;
  idealHumidity:
    | (IntUnit & {
        unit: {
          name: string;
        } | null;
      })
    | null;
  waterRequirement:
    | (FloatUnit & {
        unit: {
          name: string;
        } | null;
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
        } | null;
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
        } | null;
      })
    | null;
  withdrawalPeriod:
    | (IntUnit & {
        unit: {
          name: string;
        } | null;
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
  purchasePrice:
    | (FloatUnit & {
        unit: {
          name: string;
        } | null;
      })
    | null;
};
export type EquipmentSelect = {
  id: string;
  name: string;
  imageUrl: string | null;
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
        } | null;
      })
    | null;
  estimatedYield:
    | (FloatUnit & {
        unit: {
          name: string;
        } | null;
      })
    | null;
  plant: {
    id: string;
    name: string;
  };
};
export type TaskStatus = "queued" | "working" | "success" | "failure";
export type TaskResponse = {
  id: string;
  name: string | null;
  queue: string;
  status: TaskStatus;
  request: {
    url: string;
    headers: Record<string, any> | null;
    body: string | null;
  };
  scheduled_for: string | null;
  created_at: string;
};

export type EmailBody = {
  subject: string;
  receivers: string[];
  sender: string;
  contents: string[];
};

export type ScheduleResponse = {
  id: string;
  name: string | null;
  description: string | null;
  queue: string;
  request: {
    url: string;
    headers: Record<string, any> | null;
    body: string | null;
  };
  cron: string | null;
  rrule: string | null;
  dtstart: string | null;
  paused: boolean;
  scheduled_for: string | null;
  created_at: string;
};
export type MessageWithStaff = Message & {
  staff: Staff;
  file: File | null;
};
