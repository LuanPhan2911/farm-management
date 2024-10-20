import { db } from "@/lib/db";
import { EquipmentDetailSelect, EquipmentDetailTable } from "@/types";
import { EquipmentStatus } from "@prisma/client";

type EquipmentDetailParams = {
  equipmentId: string;
  status: EquipmentStatus;
  lastMaintenanceDate?: Date | null;
  name?: string | null;
  maintenanceSchedule?: string | null;
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
export const updateEquipmentDetailStatus = async (
  id: string,
  status: EquipmentStatus
) => {
  return await db.equipmentDetail.update({
    where: { id },
    data: {
      status,
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
export const getEquipmentDetailsSelect = async (
  equipmentId: string
): Promise<EquipmentDetailSelect[]> => {
  try {
    return await db.equipmentDetail.findMany({
      where: {
        equipmentId,
      },
      select: {
        id: true,
        name: true,
        equipmentId: true,
        status: true,
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
export const getEquipmentDetailById = async (
  id: string
): Promise<EquipmentDetailTable | null> => {
  try {
    return await db.equipmentDetail.findUnique({
      where: {
        id,
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
    return null;
  }
};
