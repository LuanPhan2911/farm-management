import { DownloadButton } from "@/components/buttons/download-button";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export const WeathersExportButton = () => {
  const t = useTranslations("weathers.form.export");
  const params = useParams<{
    fieldId: string;
  }>();
  const apiEndpoint = `/api/fields/${params.fieldId}/weathers`;
  return (
    <DownloadButton
      apiEndpoint={apiEndpoint}
      filename="weathers"
      label={t("label")}
    />
  );
};
