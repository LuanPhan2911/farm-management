import { getTranslations } from "next-intl/server";
import { PlantDanger } from "../../../_components/plant-danger";

export async function generateMetadata() {
  const t = await getTranslations("plants.page.detail.danger");
  return {
    title: t("title"),
  };
}

const PlantDetailDanger = () => {
  return <PlantDanger />;
};

export default PlantDetailDanger;
