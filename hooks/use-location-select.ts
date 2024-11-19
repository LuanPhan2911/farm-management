import { default as jsonData } from "@/messages/data/dvhcvn_fixed_coordinates.json";
import { useMemo } from "react";

export const useLocationSelect = ({
  selectedCityId,
  selectedDistrictId,
}: {
  selectedCityId?: string | null;
  selectedDistrictId?: string | null;
}) => {
  const cityData = useMemo(() => {
    return jsonData.data.map((item) => {
      const { level2s, ...other } = item;
      return {
        ...other,
      };
    });
  }, []);

  const districtData = useMemo(() => {
    const city = jsonData.data.find(
      (item) => item.level1_id === selectedCityId
    );
    if (!city) {
      return [];
    }
    return city.level2s.map((item) => {
      const { level3s, ...other } = item;
      return {
        ...other,
      };
    });
  }, [selectedCityId]);
  const townData = useMemo(() => {
    const city = jsonData.data.find(
      (item) => item.level1_id === selectedCityId
    );
    if (!city) {
      return [];
    }

    const district = city.level2s.find(
      (item) => item.level2_id === selectedDistrictId
    );
    return district ? district.level3s : [];
  }, [selectedCityId, selectedDistrictId]);

  return {
    cityData,
    districtData,
    townData,
  };
};
