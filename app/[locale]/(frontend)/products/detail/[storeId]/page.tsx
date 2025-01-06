import { getProductById } from "@/services/stores";
import { notFound } from "next/navigation";
import { ProductDetailCard } from "./_components/product-detail-card";
import { Separator } from "@/components/ui/separator";
import { getMaterialUsedInCrop } from "@/services/materials";
import { ProductMaterialUsageTable } from "./_components/product-material-usage-table";

interface ProductDetailPageProps {
  params: {
    storeId: string;
  };
}
const ProductDetailPage = async ({ params }: ProductDetailPageProps) => {
  const product = await getProductById(params.storeId);
  if (!product) {
    notFound();
  }
  const { fertilizers, pesticides } = await getMaterialUsedInCrop(
    product.cropId
  );

  return (
    <div className="h-full flex flex-col gap-y-4 lg:px-20 py-4">
      <ProductDetailCard data={product} />
      <ProductMaterialUsageTable
        fertilizers={fertilizers}
        pesticides={pesticides}
      />
    </div>
  );
};

export default ProductDetailPage;
