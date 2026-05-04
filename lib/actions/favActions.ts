"use server";

import { getServerSupabase } from "@/lib/supabase/server";

export async function fetchFavsAction(userId: string) {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from("favorites")
    .select("products(*, categories(*))")
    .eq("user_id", userId);
  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function addToFavAction(userId: string, productId: string) {
  const supabase = await getServerSupabase();
  const { error } = await supabase
    .from("favorites")
    .insert({ user_id: userId, product_id: productId });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function removeFromFavAction(userId: string, productId: string) {
  const supabase = await getServerSupabase();
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);
  if (error) return { success: false, error: error.message };
  return { success: true };
}
