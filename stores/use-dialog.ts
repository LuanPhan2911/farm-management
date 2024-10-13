import {
  ApplicantTable,
  CropTable,
  EquipmentDetailTable,
  FertilizerTable,
  PesticideTable,
  PlantFertilizerTable,
  PlantPesticideTable,
  SoilTable,
  WeatherTable,
} from "@/types";
import { User } from "@clerk/nextjs/server";
import {
  Category,
  File,
  PlantFertilizer,
  PlantPesticide,
  Unit,
} from "@prisma/client";
import { create } from "zustand";

export type DialogType =
  | "category.edit"
  | "unit.edit"
  | "applicant.createStaff"
  | "staff.editRole"
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
  | "equipmentDetail.edit";

export interface DialogData {
  category?: Category;
  unit?: Unit;
  applicant?: ApplicantTable;
  user?: User;
  weather?: WeatherTable;
  soil?: SoilTable;
  fertilizer?: FertilizerTable;
  pesticide?: PesticideTable;
  crop?: CropTable;
  file?: File;
  plantFertilizer?: PlantFertilizerTable;
  plantPesticide?: PlantPesticideTable;
  equipmentDetail?: EquipmentDetailTable;
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
