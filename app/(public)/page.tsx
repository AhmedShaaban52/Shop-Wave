import { getOffers } from "@/app/(dashboard)/admin/offers/actions";
import { getCategories } from "@/app/(dashboard)/admin/categories/actions";
import { getProducts } from "@/app/(dashboard)/admin/products/actions";
import OfferSlider from "./_components/OfferSlider";
import CategoryCard from "@/components/cards/CategoryCard";
import { ProductCard } from "@/components/cards/ProductCard";
import { ProductWithCategory } from "@/utils/ProductsFields";
import { Category } from "@/lib/types";

function isActive(item: { startDate?: Date | string | null; endDate?: Date | string | null }) {
  const now = new Date();
  if (item.endDate && new Date(item.endDate) < now) return false;
  if (item.startDate && new Date(item.startDate) > now) return false;
  return true;
}

export default async function Home() {
  const [offersResult, categoriesResult, productsResult] = await Promise.all([
    getOffers(),
    getCategories(),
    getProducts(),
  ]);

  const offers = offersResult.success ? offersResult.data ?? [] : [];

  const categories = (categoriesResult.success ? categoriesResult.data ?? [] : [])
    .filter((c: any) => c.isActive !== false) as Category[];

  console.log(categories);
    

  const products = (productsResult.success ? productsResult.data ?? [] : [])
    .filter((p: any) => p.isActive !== false) as ProductWithCategory[];

  return (
    <div className="p-4 space-y-10">
      <h1 className="text-2xl font-bold">Website</h1>
      <OfferSlider offers={offers} />
      <CategoryCard categories={categories} />

      <div className="mb-6 font-sans">
        <h2 className="text-[32px] font-bold text-sky-900 tracking-tight leading-tight">
          New Arrivals
        </h2>
        <p className="text-[17px] font-medium text-[#6c8299] mt-2">
          The latest from our artisan workshops.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}