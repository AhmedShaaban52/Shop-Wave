"use server";

import { getServerSupabase } from "@/lib/supabase/server";

export async function fetchCartAction(userId: string) {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from("carts")
    .select("quantity, products(*, categories(*))")
    .eq("user_id", userId);
  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function addToCartAction(
  userId: string,
  productId: string,
  currentQty?: number,
) {
  const supabase = await getServerSupabase();
  if (currentQty) {
    const { error } = await supabase
      .from("carts")
      .update({ quantity: currentQty + 1 })
      .eq("user_id", userId)
      .eq("product_id", productId);
    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await supabase
      .from("carts")
      .insert({ user_id: userId, product_id: productId, quantity: 1 });
    if (error) return { success: false, error: error.message };
  }
  return { success: true };
}

export async function removeFromCartAction(userId: string, productId: string) {
  const supabase = await getServerSupabase();
  const { error } = await supabase
    .from("carts")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updateCartQuantityAction(
  userId: string,
  productId: string,
  quantity: number,
) {
  const supabase = await getServerSupabase();
  const { error } = await supabase
    .from("carts")
    .update({ quantity })
    .eq("user_id", userId)
    .eq("product_id", productId);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function clearCartAction(userId: string) {
  const supabase = await getServerSupabase();
  const { error } = await supabase.from("carts").delete().eq("user_id", userId);
  if (error) return { success: false, error: error.message };
  return { success: true };
}
