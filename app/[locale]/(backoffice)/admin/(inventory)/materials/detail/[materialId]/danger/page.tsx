import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getMaterialById, getMaterialsSelect } from "@/services/materials";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { DestroyButton } from "@/components/buttons/destroy-button";
import { destroy } from "@/actions/material";

interface MaterialDangerPageProps {
  params: {
    materialId: string;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("materials.page.detail.danger");
  return {
    title: t("title"),
  };
}

export async function generateStaticParams() {
  const materials = await getMaterialsSelect();
  return materials.map((item) => {
    return {
      materialId: item.id,
    };
  });
}
const MaterialDangerPage = async ({ params }: MaterialDangerPageProps) => {
  const t = await getTranslations("materials.form");
  const data = await getMaterialById(params.materialId);
  if (!data) {
    notFound();
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("destroy.title")}</CardTitle>
        <CardDescription>{t("destroy.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <DestroyButton destroyFn={destroy} id={data.id} inltKey="materials" />
      </CardContent>
    </Card>
  );
};
export default MaterialDangerPage;
