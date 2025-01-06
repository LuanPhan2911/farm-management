import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "../_components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getFeatureProduct } from "@/services/stores";
import { ProductGalleries } from "./_components/product-galleries";
import { siteConfig } from "@/configs/siteConfig";
export function generateMetadata() {
  return {
    title: "Trang chủ",
  };
}
const HomePage = async () => {
  const products = await getFeatureProduct();
  return (
    <div className="relative">
      <PageHeader>
        <PageHeaderHeading className="text-green-600">
          {siteConfig.name}
        </PageHeaderHeading>
        <PageHeaderDescription className="text-green-500">
          {siteConfig.description}
        </PageHeaderDescription>
      </PageHeader>
      <Card
        className="border-border/40 bg-background/95 
    backdrop-blur supports-[backdrop-filter]:bg-background/40 shadow-md"
      >
        <CardHeader>
          <CardTitle className="text-green-400">Sản phẩm đặc trưng</CardTitle>
          <CardDescription className="dark:text-white">
            Danh sách nông sản đặc trưng của NextFarm
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductGalleries data={products} />
        </CardContent>
      </Card>
    </div>
  );
};
export default HomePage;
