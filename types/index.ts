import { Organization } from "@clerk/nextjs/server";
import {
  Activity,
  ActivityAssigned,
  ActivityPriority,
  ActivityStatus,
  ApplicantStatus,
  Category,
  Crop,
  Equipment,
  EquipmentDetail,
  EquipmentStatus,
  EquipmentType,
  EquipmentUsage,
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
  Material,
  MaterialType,
  MaterialUsage,
  Message,
  Pesticide,
  PesticideType,
  Plant,
  PlantFertilizer,
  PlantPesticide,
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

export type OrgRole = "org:member" | "org:admin" | "org:field_staff";
export const orgRoles = ["org:admin", "org:member", "org:field_staff"] as const;
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
export type UnitTable = Unit & {};
export type UnitSelect = {
  id: string;
  name: string;
};
export type FloatUnitTable = FloatUnit & {
  unit: {
    name: string;
  } | null;
};
export type IntUnitTable = IntUnit & {
  unit: {
    name: string;
  } | null;
};
export type CategoryTable = Category & {};
export type CategorySelect = {
  id: string;
  name: string;
  description: string | null;
};
export type JobTable = {
  id: string;
  name: string;
  quantity: number;
  experience: JobExperience;
  gender: Gender;
  published: boolean;
  expiredAt: Date;
  _count: {
    applicants: number;
  };
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

export type UnitUnusedCount = {
  floatUnit: number;
  intUnit: number;
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
  unit: UnitSelect | null;
  organization: Organization | null;
};
export type FieldSelect = {
  id: string;
  name: string;
  location: string | null;
  area: number | null;
  orgId: string | null;
  unit: {
    name: string;
  } | null;
};

export type FieldLocation = {
  id: string;
  name: string;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  area: number | null;
  unit: {
    name: string;
  } | null;
};

export type WeatherTable = Weather & {
  confirmedBy: Staff | null;
  temperature: FloatUnitTable | null;
  humidity: IntUnitTable | null;
  atmosphericPressure: FloatUnitTable | null;
  rainfall: IntUnitTable | null;
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
  temperature: FloatUnitTable | null;
  humidity: IntUnitTable | null;
  atmosphericPressure: FloatUnitTable | null;
  rainfall: IntUnitTable | null;
};
export type SoilTypeCount = {
  type: SoilType;
  _count: number;
};
export type SoilTable = Soil & {
  confirmedBy: Staff | null;
  moisture: IntUnitTable | null;
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
  moisture: IntUnitTable | null;
};
export type PlantTable = Plant & {
  category: Category;
  idealTemperature: FloatUnitTable | null;
  idealHumidity: IntUnitTable | null;
  waterRequirement: FloatUnitTable | null;
};
export type PlantSelect = {
  id: string;
  name: string;
  imageUrl: string | null;
  category: {
    name: string;
  };
};
export type PlantFertilizerTable = PlantFertilizer & {
  fertilizer: {
    name: string;
    type: FertilizerType;
    recommendedDosage: FloatUnitTable | null;
  };
  dosage: FloatUnitTable | null;
};
export type PlantPesticideTable = PlantPesticide & {
  pesticide: {
    name: string;
    type: PesticideType;
    toxicityLevel: ToxicityLevel | null;
    recommendedDosage: FloatUnitTable | null;
  };
  dosage: IntUnitTable | null;
};
export type FertilizerTable = Fertilizer & {
  recommendedDosage: FloatUnitTable | null;
};
export type FertilizerTypeCount = {
  type: FertilizerType;
  _count: number;
};
export type FertilizerFrequencyCount = {
  frequencyOfUse: Frequency;
  _count: number;
};
export type FertilizerSelect = {
  id: string;
  name: string;
  type: FertilizerType | null;
  nutrientOfNPK: string | null;
  frequencyOfUse: Frequency | null;
  applicationMethod: string | null;
  recommendedDosage: FloatUnitTable | null;
};
export type PesticideTable = Pesticide & {
  recommendedDosage: FloatUnitTable | null;
  withdrawalPeriod: IntUnitTable | null;
};

export type PesticideTypeCount = {
  type: PesticideType;
  _count: number;
};
export type PesticideToxicityLevelCount = {
  toxicityLevel: ToxicityLevel;
  _count: number;
};
export type PesticideSelect = {
  id: string;
  name: string;
  type: PesticideType | null;
  toxicityLevel: ToxicityLevel | null;
  applicationMethod: string | null;
  withdrawalPeriod: IntUnitTable | null;
  recommendedDosage: FloatUnitTable | null;
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
  files: File[] | null;
};
export type FileWithOwner = File & {
  owner: Staff;
};
export type FileSelect = {
  name: string;
  url: string;
  ownerId: string;
  isPublic: boolean;
  orgId: string | null;
  type: string;
};
export type MaterialTable = Material & {
  unit: {
    name: string;
  };
  _count: {
    materialUsages: number;
  };
};

export type MaterialWithCost = Material & {
  unit: {
    name: string;
  };
  _count: {
    materialUsages: number;
  };
  materialUsages: MaterialUsageWithActivity[];
  totalQuantityUsed: number;
  totalCost: number;
};
export type MaterialUsageWithActivity = MaterialUsage & {
  activity: ActivitySelect | null;
};
export type MaterialSelect = {
  id: string;
  name: string;
  imageUrl: string | null;
  quantityInStock: number;
  type: MaterialType;
  unitId: string;
  unit: {
    name: string;
  };
  basePrice: number | null;
};

export type MaterialUsedChart = {
  month: Date;
  totalCost: number;
};
export type MaterialMostUsedChart = {
  name: string;
  quantityUsed: number;
};
export type MaterialUsageTable = MaterialUsage & {
  material: MaterialSelect;
  unit: {
    name: string;
  };
  activity: ActivitySelect | null;
};

export type MaterialUsageTableWithCost = MaterialUsage & {
  material: MaterialSelect;
  unit: {
    name: string;
  };
  activity: ActivitySelect | null;
  actualCost: number;
};

export type MaterialTypeCount = {
  type: MaterialType;
  _count: number;
};
export type EquipmentTable = Equipment & {
  purchasePrice: FloatUnitTable | null;
  _count: {
    equipmentDetails: number;
  };
};
export type EquipmentSelect = {
  id: string;
  name: string;
  imageUrl: string | null;
};
export type EquipmentDetailTable = EquipmentDetail & {
  equipment: EquipmentSelect;
  unit: {
    name: string;
  } | null;
};

export type EquipmentDetailSelect = {
  id: string;
  name: string | null;
  equipmentId: string;
  status: EquipmentStatus;
  location: string | null;
  baseFuelPrice: number | null;
  maxFuelConsumption: number | null;
};

export type EquipmentDetailSelectWithUnit = EquipmentDetailSelect & {
  equipment: EquipmentSelect;
  unit: UnitSelect | null;
};

export type EquipmentTypeCount = {
  type: EquipmentType;
  _count: number;
};

export type EquipmentUsageTable = EquipmentUsage & {
  unit: UnitSelect | null;
  equipmentDetail: EquipmentDetailSelect;
  activity: ActivitySelect | null;
  operator: Staff | null;
};
export type EquipmentUsageTableWithCost = EquipmentUsage & {
  unit: UnitSelect | null;
  equipmentDetail: EquipmentDetailSelect;
  activity: ActivitySelect | null;
  operator: Staff | null;
  actualCost: number;
};
export type EquipmentUsageWithActivity = EquipmentUsage & {
  activity: ActivitySelect | null;
};
export type EquipmentDetailUsageCost = EquipmentDetail & {
  equipment: EquipmentSelect;
  equipmentUsages: EquipmentUsageWithActivity[];
  _count: {
    equipmentUsages: number;
  };
  unit: {
    name: string;
  } | null;
  totalCost: number;
  totalFuelConsumption: number;
  totalRentalPrice: number;
};

export type AssignedStaff = ActivityAssigned & {
  staff: Staff;
};

export type ActivityTable = Activity & {
  createdBy: Staff;
  crop: CropSelect;
  assignedTo: AssignedStaff[];
};

export type ActivityWithCost = Activity & {
  actualCost: number;
};

export type ActivitySelect = {
  id: string;
  name: string;
  status: ActivityStatus;
  priority: ActivityPriority;
  activityDate: Date;
  estimatedDuration: number;
};
export type ActivitySelectWithCrop = ActivitySelect & {
  crop: CropSelect;
};
export type ActivityWithCountUsages = Activity & {
  _count: {
    materialUseds: number;
    equipmentUseds: number;
    assignedTo: number;
  };
};
export type ActivityStatusCount = {
  status: ActivityStatus;
  _count: number;
};
export type ActivityPriorityCount = {
  priority: ActivityPriority;
  _count: number;
};
export const activityUpdateStatus = ["NEW", "PENDING", "IN_PROGRESS"] as const;

export type StaffWithSalary = Staff & {
  salary: number;
  hourlyWork: number;
  _count: {
    activityAssigned: number;
  };
};
export type StaffWithSalaryAndActivity = ActivityAssigned & {
  activity: ActivitySelect;
  actualCost: number;
  staff: Staff;
};

export type SalaryChart = {
  month: Date;
  totalSalary: number;
  totalHourlyWork: number;
};

export type CropTable = Crop & {
  plant: PlantSelect;
  field: FieldSelect;
  _count: {
    activities: number;
  };
  unit: {
    name: string;
  };
};
export type CropSelect = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date | null;
};
export type CropSelectWithField = CropSelect & {
  field: FieldSelect;
};

export type CropWithCount = Crop & {
  _count: {
    activities: number;
  };
};

export type CropMaterial = {
  id: string;
  name: string;
  imageUrl: string | null;
  type: MaterialType;
  typeId: string | null;
  unit: {
    name: string;
  };
};
export type CropMaterialUsage = MaterialUsage & {
  material: CropMaterial;
  unit: {
    name: string;
  };
};
