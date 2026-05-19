import { ProductWithCategory } from "@/app/(dashboard)/admin/products/_components/ProductsView";

export const calculatePrice = (p: ProductWithCategory) => {
  if (!p || !p.price) return null;

  const price = parseFloat(p.price as string);
  if (
    !p.discountType ||
    !p.discountValue ||
    parseFloat(p.discountValue as string) <= 0
  ) {
    return null;
  }

  const discount = parseFloat(p.discountValue as string);

  if (p.discountType === "percent") {
    return price - (price * discount) / 100;
  }

  if (p.discountType === "amount") {
    return price - discount;
  }

  return null;
};
