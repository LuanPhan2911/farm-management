import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { parseToNumber } from "@/lib/utils";
import { getProducts } from "@/services/stores";
import { ProductList } from "./_components/product-list";

export function generateMetadata() {
  return {
    title: "Nông sản",
  };
}

interface ProductPageProps {
  searchParams: {
    page?: string;
    query?: string;
  };
}
const ProductsPage = async ({ searchParams }: ProductPageProps) => {
  const page = parseToNumber(searchParams.page, 1);
  const { query } = searchParams;
  const { data, totalPage } = await getProducts({
    page,
    query,
  });
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card
        className="border-border/40 bg-background/95 
    backdrop-blur supports-[backdrop-filter]:bg-background/40 shadow-md"
      >
        <CardHeader>
          <CardTitle className="text-green-400">Nông sản</CardTitle>
          <CardDescription className="dark:text-white">
            Danh sách nông sản mùa vụ hiện tại của nông trại
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductList data={data} totalPage={totalPage} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsPage;
