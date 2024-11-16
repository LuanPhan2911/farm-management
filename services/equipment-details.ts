import { db } from "@/lib/db";
import {
  EquipmentDetailSelectWithUnit,
  EquipmentDetailTable,
  EquipmentDetailUsageCost,
} from "@/types";
import { EquipmentStatus } from "@prisma/client";
import { equipmentSelect } from "./equipments";
import { unitSelect } from "./units";
import { activitySelect } from "./activities";
import _ from "lodash";

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
): Promise<EquipmentDetailSelectWithUnit[]> => {
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

type EquipmentDetailUsageCostQuery = {
  begin?: Date;
  end?: Date;
};
export const getEquipmentDetailUsageCost = async ({
  begin,
  end,
}: EquipmentDetailUsageCostQuery): Promise<EquipmentDetailUsageCost[]> => {
  try {
    if (!begin || !end) {
      throw new Error("Missing begin and end date");
    }
    const equipmentDetails = await db.equipmentDetail.findMany({
      where: {
        equipmentUsages: {
          some: {
            activity: {
              status: "COMPLETED",
              activityDate: {
                gte: begin,
                lte: end,
              },
            },
          },
        },
      },
      include: {
        _count: {
          select: {
            equipmentUsages: true,
          },
        },
        equipment: {
          select: {
            ...equipmentSelect,
          },
        },
        equipmentUsages: {
          include: {
            activity: {
              select: {
                ...activitySelect,
              },
            },
          },
        },
        unit: {
          select: {
            name: true,
          },
        },
      },
    });

    const equipmentDetailWithCost = equipmentDetails.map((equipment) => {
      const { equipmentUsages } = equipment;
      return {
        ...equipment,
        totalCost: _.sumBy(
          equipmentUsages,
          ({ activity, fuelPrice, fuelConsumption, rentalPrice }) => {
            if (
              !activity ||
              activity.status !== "COMPLETED" ||
              fuelConsumption === null ||
              fuelPrice === null
            ) {
              return 0;
            }
            if (rentalPrice === null) {
              return fuelConsumption * fuelPrice;
            }
            return rentalPrice + fuelConsumption * fuelPrice;
          }
        ),
        totalFuelConsumption: _.sumBy(equipmentUsages, (item) => {
          if (
            !item.activity ||
            item.activity.status !== "COMPLETED" ||
            item.fuelConsumption === null
          ) {
            return 0;
          }
          return item.fuelConsumption;
        }),
        totalRentalPrice: _.sumBy(equipmentUsages, (item) => {
          if (
            !item.activity ||
            item.activity.status !== "COMPLETED" ||
            item.rentalPrice === null
          ) {
            return 0;
          }
          return item.rentalPrice;
        }),
      };
    });
    return equipmentDetailWithCost;
  } catch (error) {
    return [];
  }
};
