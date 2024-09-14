import { faker } from "@faker-js/faker";
import { WeatherStatus } from "@prisma/client";

export const generateWeather = ({
  atmosphericPressureUnitId,
  humidityUnitId,
  rainfallUnitId,
  temperatureUnitId,
  fieldId,
}: {
  temperatureUnitId: string;
  humidityUnitId: string;
  atmosphericPressureUnitId: string;
  rainfallUnitId: string;
  fieldId: string;
}) => {
  return {
    temperature: {
      unitId: temperatureUnitId,
      value: faker.number.float({
        min: 25,
        max: 40,
        fractionDigits: 2,
      }),
    },
    humidity: {
      unitId: humidityUnitId,
      value: faker.number.int({
        min: 0,
        max: 100,
      }),
    },
    atmosphericPressure: {
      unitId: atmosphericPressureUnitId,
      value: faker.number.float({
        min: 900,
        max: 1000,
        fractionDigits: 2,
      }),
    },
    rainfall: {
      unitId: rainfallUnitId,
      value: faker.number.int({
        min: 0,
        max: 100,
      }),
    },
    status: faker.helpers.enumValue(WeatherStatus),
    fieldId,
  };
};
export const generateSoil = ({
  fieldId,
  moistureUnitId,
  nutrientUnitId,
}: {
  moistureUnitId: string;
  nutrientUnitId: string;
  fieldId: string;
}) => {
  return {
    ph: faker.number.float({ min: 0, max: 14, fractionDigits: 2 }),
    moisture: {
      unitId: moistureUnitId,
      value: faker.number.int({ min: 0, max: 60 }),
    },
    nutrientNitrogen: faker.number.float({
      min: 0,
      max: 10,
      fractionDigits: 2,
    }),
    nutrientPhosphorus: faker.number.float({
      min: 0,
      max: 5,
      fractionDigits: 2,
    }),
    nutrientPotassium: faker.number.float({
      min: 0,
      max: 8,
      fractionDigits: 2,
    }),
    nutrientUnitId,
    fieldId,
  };
};
