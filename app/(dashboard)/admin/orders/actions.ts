"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function getAllOrders() {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(`*, order_items(*)`)
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message, data: [] };
  return { success: true, data };
}

export async function updateOrderStatus(id: string, status: string) {
  const { error } = await supabaseAdmin
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteOrder(id: string) {
  const { error } = await supabaseAdmin.from("orders").delete().eq("id", id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}
