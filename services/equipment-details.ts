import { db } from "@/lib/db";
import { EquipmentDetailTable } from "@/types";
import { EquipmentStatus } from "@prisma/client";

type EquipmentDetailParams = {
  equipmentId: string;
  status: EquipmentStatus;

  lastMaintenanceDate?: Date | null;
  operatingHours?: number | null;
  location?: string | null;
};

export const createEquipmentDetail = async (params: EquipmentDetailParams) => {
  return await db.equipmentDetail.create({
    data: {
      ...params,
    },
  });
};
export const updateEquipmentDetail = async (
  id: string,
  params: EquipmentDetailParams
) => {
  return await db.equipmentDetail.update({
    where: { id },
    data: {
      ...params,
    },
  });
};
export const deleteEquipmentDetail = async (id: string) => {
  return await db.equipmentDetail.delete({ where: { id } });
};

type EquipmentDetailEQuery = {
  equipmentId: string;
};
export const getEquipmentDetails = async ({
  equipmentId,
}: EquipmentDetailEQuery): Promise<EquipmentDetailTable[]> => {
  try {
    return await db.equipmentDetail.findMany({
      where: {
        equipmentId,
      },
      include: {
        equipment: {
          select: {
            name: true,
            type: true,
            imageUrl: true,
          },
        },
      },
    });
  } catch (error) {
    return [];
  }
};
