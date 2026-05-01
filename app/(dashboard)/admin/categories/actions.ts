"use server";

import { getServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { CategorySchemaType } from "@/lib/types";

const CATEGORY_SELECT = `
  id,
  name,
  description,
  image,
  isActive:is_active,
  createdAt:created_at,
  updatedAt:updated_at
`;

export async function getCategories() {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from("categories")
    .select(CATEGORY_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error getting categories:", error);
    return { success: false, error: error.message };
  }
  return { success: true, data };
}

export async function createCategory(data: CategorySchemaType) {
  const supabase = await getServerSupabase();
  const { data: result, error } = await supabase
    .from("categories")
    .insert([
      {
        name: data.name,
        description: data.description || null,
        image: data.image,
        is_active: data.isActive !== "false",
      },
    ])
    .select(CATEGORY_SELECT)
    .single();

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/categories");
  return {
    success: true,
    data: result,
    message: "Category created successfully",
  };
}

export async function updateCategory(id: string, data: CategorySchemaType) {
  const supabase = await getServerSupabase();
  const { data: result, error } = await supabase
    .from("categories")
    .update({
      name: data.name,
      description: data.description || null,
      image: data.image,
      is_active: data.isActive !== "false",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(CATEGORY_SELECT)
    .single();

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/categories");
  return {
    success: true,
    data: result,
    message: "Category updated successfully",
  };
}

export async function deleteCategory(id: string) {
  const supabase = await getServerSupabase();
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: error.message };
  }
  revalidatePath("/admin/categories");
  return { success: true, message: "Category deleted successfully" };
}
