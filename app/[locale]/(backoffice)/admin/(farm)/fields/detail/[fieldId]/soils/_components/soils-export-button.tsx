import { DownloadButton } from "@/components/buttons/download-button";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export const SoilsExportButton = () => {
  const t = useTranslations("soils.form.export");
  const params = useParams<{
    fieldId: string;
  }>();
  const apiEndpoint = `/api/fields/${params!.fieldId}/soils`;
  return (
    <DownloadButton
      apiEndpoint={apiEndpoint}
      filename="soils"
      label={t("label")}
    />
  );
};
