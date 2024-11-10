import { db } from "@/lib/db";
import {
  EquipmentDetailSelectWithEquipmentAndUnit,
  EquipmentDetailTable,
} from "@/types";
import { EquipmentStatus } from "@prisma/client";
import { equipmentSelect } from "./equipments";
import { unitSelect } from "./units";

type EquipmentDetailParams = {
  equipmentId: string;
  status: EquipmentStatus;
  maxOperatingHours: number;
  lastMaintenanceDate?: Date | null;
  name?: string | null;
  location?: string | null;
  maxFuelConsumption?: number | null;
  baseFuelPrice?: number | null;
  energyType?: string | null;
  unitId?: string | null;
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
  const { status, ...other } = params;
  const equipmentDetail = await db.equipmentDetail.findUnique({
    where: { id },
  });

  if (equipmentDetail?.status === "MAINTENANCE" && status === "AVAILABLE") {
    return await db.equipmentDetail.update({
      where: { id },
      data: {
        status,
        operatingHours: 0,
        lastMaintenanceDate: new Date(),
        ...other,
      },
    });
  }
  return await db.equipmentDetail.update({
    where: { id },
    data: {
      status,
      ...other,
    },
  });
};

export const deleteEquipmentDetail = async (id: string) => {
  return await db.equipmentDetail.delete({ where: { id } });
};

type EquipmentDetailQuery = {
  equipmentId: string;
};
export const getEquipmentDetails = async ({
  equipmentId,
}: EquipmentDetailQuery): Promise<EquipmentDetailTable[]> => {
  try {
    return await db.equipmentDetail.findMany({
      where: {
        equipmentId,
      },
      include: {
        equipment: {
          select: {
            ...equipmentSelect,
          },
        },
        unit: {
          select: {
            name: true,
          },
        },
      },
    });
  } catch (error) {
    return [];
  }
};

export const equipmentDetailSelect = {
  id: true,
  name: true,
  equipmentId: true,
  status: true,
  location: true,
  baseFuelPrice: true,
  maxFuelConsumption: true,
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
            ...equipmentSelect,
          },
        },
        unit: {
          select: {
            name: true,
          },
        },
      },
    });
  } catch (error) {
    return null;
  }
};

export const getEquipmentDetailsSelect = async (
  defaultId?: string
): Promise<EquipmentDetailSelectWithEquipmentAndUnit[]> => {
  try {
    return await db.equipmentDetail.findMany({
      where: {
        OR: [
          {
            id: defaultId,
          },
          {
            status: "AVAILABLE",
          },
        ],
      },
      select: {
        ...equipmentDetailSelect,
        unit: {
          select: {
            ...unitSelect,
          },
        },
        equipment: {
          select: {
            ...equipmentSelect,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
  } catch (error) {
    return [];
  }
};

// update status to maintain when operating hour greater or equal than max operating hour
export const maintainEquipmentDetail = async () => {
  // Fetch all equipment details not already in MAINTENANCE status
  const equipmentDetails = await db.equipmentDetail.findMany({
    where: {
      status: {
        not: "MAINTENANCE", // Only consider equipment not already in maintenance
      },
    },
  });

  // Filter equipment that needs maintenance based on operating hours
  const equipmentToMaintain = equipmentDetails.filter(
    (equipment) => equipment.operatingHours >= equipment.maxOperatingHours
  );

  // Update each filtered equipment status to MAINTENANCE
  const updatePromises = equipmentToMaintain.map((equipment) =>
    db.equipmentDetail.update({
      where: { id: equipment.id },
      data: {
        status: "MAINTENANCE",
      },
    })
  );

  // Await all updates
  return await Promise.all(updatePromises);
};
