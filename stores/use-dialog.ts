import {
  ApplicantTable,
  AssignedStaffWithCost,
  CategoryTable,
  CropTable,
  EquipmentDetailTable,
  EquipmentUsageTable,
  FertilizerTable,
  MaterialUsageTable,
  PesticideTable,
  PlantFertilizerTable,
  PlantPesticideTable,
  SoilTable,
  UnitTable,
  WeatherTable,
} from "@/types";
import { User } from "@clerk/nextjs/server";
import { File, Staff } from "@prisma/client";
import { create } from "zustand";

export type DialogType =
  | "category.edit"
  | "unit.edit"
  | "applicant.createStaff"
  | "staff.edit"
  | "staff.create"
  | "weather.edit"
  | "soil.edit"
  | "fertilizer.edit"
  | "pesticide.edit"
  | "crop.edit"
  | "file.createMany"
  | "file.editName"
  | "plantFertilizer.edit"
  | "plantPesticide.edit"
  | "equipmentDetail.edit"
  | "materialUsage.edit"
  | "equipmentUsage.edit"
  | "activityAssigned.edit";

export interface DialogData {
  category?: CategoryTable;
  unit?: UnitTable;
  applicant?: ApplicantTable;
  user?: User;
  staff?: Staff;
  weather?: WeatherTable;
  soil?: SoilTable;
  fertilizer?: FertilizerTable;
  pesticide?: PesticideTable;
  crop?: CropTable;
  file?: File;
  plantFertilizer?: PlantFertilizerTable;
  plantPesticide?: PlantPesticideTable;
  equipmentDetail?: EquipmentDetailTable;
  materialUsage?: MaterialUsageTable;
  equipmentUsage?: EquipmentUsageTable;
  activityAssigned?: AssignedStaffWithCost;
}
interface DialogStore {
  type: DialogType | null;
  isOpen: boolean;
  data: DialogData;
  onOpen: (type: DialogType, data?: DialogData) => void;
  onClose: () => void;
}

export const useDialog = create<DialogStore>((set) => {
  return {
    isOpen: false,
    type: null,
    data: {},
    onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
    onClose: () => set({ isOpen: false, type: null, data: {} }),
  };
});
