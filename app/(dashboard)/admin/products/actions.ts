"use server";

import { getServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ProductSchemaType } from "@/lib/types";
import { ProductWithCategory } from "@/utils/ProductsFields";

const PRODUCT_SELECT = `
  id,
  categoryId:category_id,
  name,
  description,
  image,
  price,
  discountType:discount_type,
  discountValue:discount_value,
  isActive:is_active,
  createdAt:created_at,
  updatedAt:updated_at,
  categories(*)
`;

export async function getProducts() {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error getting products:", error);
    return { success: false, error: error.message };
  }

  return { success: true, data: data as unknown as ProductWithCategory[] };
}

export async function getProductById(id: string) {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error getting product:", error);
    return { success: false, error: error.message };
  }
  return { success: true, data };
}

export async function createProduct(data: ProductSchemaType) {
  const supabase = await getServerSupabase();
  const { data: result, error } = await supabase
    .from("products")
    .insert([
      {
        category_id: data.categoryId,
        name: data.name,
        description: data.description || null,
        image: data.image,
        price: data.price,
        discount_type: data.discountType || null,
        discount_value: data.discountValue || null,
        is_active: data.isActive !== "false",
      },
    ])
    .select(PRODUCT_SELECT)
    .single();

  if (error) {
    console.error("Error creating product:", error);
    return { success: false, error: error.message };
  }
  revalidatePath("/admin/products");
  return {
    success: true,
    data: result,
    message: "Product created successfully",
  };
}

export async function updateProduct(id: string, data: ProductSchemaType) {
  const supabase = await getServerSupabase();
  const { data: result, error } = await supabase
    .from("products")
    .update({
      category_id: data.categoryId,
      name: data.name,
      description: data.description || null,
      image: data.image,
      price: data.price,
      discount_type: data.discountType || null,
      discount_value: data.discountValue || null,
      is_active: data.isActive !== "false",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(PRODUCT_SELECT)
    .single();

  if (error) {
    console.error("Error updating product:", error);
    return { success: false, error: error.message };
  }
  revalidatePath("/admin/products");
  return {
    success: true,
    data: result,
    message: "Product updated successfully",
  };
}

export async function deleteProduct(id: string) {
  const supabase = await getServerSupabase();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: error.message };
  }
  revalidatePath("/admin/products");
  return { success: true, message: "Product deleted successfully" };
}

// export async function searchProducts(query: string) {
//   const supabase = await getServerSupabase();
//   const { data, error } = await supabase
//     .from("products")
//     .select(PRODUCT_SELECT)
//     .ilike("name", `%${query}%`)
//     .order("created_at", { ascending: false });

//   if (error) {
//     console.error("Error searching products:", error);
//     return { success: false, error: error.message };
//   }
//   return { success: true, data: data as unknown as ProductWithCategory[] };
// }

export async function searchProducts(query: string, categoryName?: string) {
  const supabase = await getServerSupabase();

  let supabaseQuery = supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (query) {
    supabaseQuery = supabaseQuery.ilike("name", `%${query}%`);
  }

  const { data, error } = await supabaseQuery;

  if (error) {
    console.error("Error searching products:", error);
    return { success: false, error: error.message };
  }

  let result = (data as unknown as ProductWithCategory[]) || [];

  if (categoryName && categoryName !== "All") {
    result = result.filter((p) => (p as any).categories?.name === categoryName);
  }

  return { success: true, data: result };
}