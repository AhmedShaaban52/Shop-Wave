import { ProductWithCategory } from "@/app/(dashboard)/admin/products/_components/ProductsView";

export const calculatePrice = (p: ProductWithCategory) => {
  const price = parseFloat(p.price as string);
  if (!p.discountType || !p.discountValue) return null;
  const discount = parseFloat(p.discountValue as string);
  if (p.discountType === "percent") return price - (price * discount) / 100;
  if (p.discountType === "amount") return price - discount;
  return null;
};
