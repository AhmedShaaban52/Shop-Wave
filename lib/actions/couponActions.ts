"use server";

import { getServerSupabase } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { CouponSchemaType } from "@/lib/types";

const COUPON_SELECT = `
  id, code,
  discountType:discount_type,
  discountValue:discount_value,
  minOrderAmount:min_order_amount,
  maxUses:max_uses,
  usedCount:used_count,
  startDate:start_date,
  endDate:end_date,
  isActive:is_active,
  createdAt:created_at,
  updatedAt:updated_at
`;

export async function getCoupons() {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from("coupons")
    .select(COUPON_SELECT)
    .order("created_at", { ascending: false });
  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function createCoupon(data: CouponSchemaType) {
  const supabase = await getServerSupabase();
  const { data: result, error } = await supabase
    .from("coupons")
    .insert({
      code: data.code.toUpperCase(),
      discount_type: data.discountType,
      discount_value: data.discountValue,
      min_order_amount: data.minOrderAmount || 0,
      max_uses: data.maxUses || null,
      start_date: data.startDate || null,
      end_date: data.endDate || null,
      is_active: data.isActive !== "false",
    })
    .select(COUPON_SELECT)
    .single();
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/coupons");
  return { success: true, data: result };
}

export async function updateCoupon(id: string, data: CouponSchemaType) {
  const supabase = await getServerSupabase();
  const { data: result, error } = await supabase
    .from("coupons")
    .update({
      code: data.code.toUpperCase(),
      discount_type: data.discountType,
      discount_value: data.discountValue,
      min_order_amount: data.minOrderAmount || 0,
      max_uses: data.maxUses || null,
      start_date: data.startDate || null,
      end_date: data.endDate || null,
      is_active: data.isActive !== "false",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(COUPON_SELECT)
    .single();
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/coupons");
  return { success: true, data: result };
}

export async function deleteCoupon(id: string) {
  const supabase = await getServerSupabase();
  const { error } = await supabase.from("coupons").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/coupons");
  return { success: true };
}

export async function validateCoupon(code: string, orderTotal: number) {
  const supabase = supabaseAdmin;

  let formattedCode = code.toUpperCase().trim();


  let { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", formattedCode)
    .eq("is_active", true);

  if ((!data || data.length === 0) && formattedCode.includes("0")) {
    const alternativeCode = formattedCode.replace(/0/g, "O");
    const result = await supabase
      .from("coupons")
      .select("*")
      .eq("code", alternativeCode)
      .eq("is_active", true);
    if (result.data && result.data.length > 0) {
      data = result.data;
    }
  } else if ((!data || data.length === 0) && formattedCode.includes("O")) {
    const alternativeCode = formattedCode.replace(/O/g, "0");
    const result = await supabase
      .from("coupons")
      .select("*")
      .eq("code", alternativeCode)
      .eq("is_active", true);
    if (result.data && result.data.length > 0) {
      data = result.data;
    }
  }

  if (error) {
    return { valid: false, error: `Database error: ${error.message}` };
  }

  if (!data || data.length === 0) {
    return { valid: false, error: "Invalid coupon code" };
  }

  const rawCoupon = data[0];


  const coupon = {
    id: rawCoupon.id,
    code: rawCoupon.code,
    discountType: rawCoupon.discount_type,
    discountValue: rawCoupon.discount_value,
    minOrderAmount: rawCoupon.min_order_amount,
    maxUses: rawCoupon.max_uses,
    usedCount: rawCoupon.used_count,
    startDate: rawCoupon.start_date,
    endDate: rawCoupon.end_date,
    isActive: rawCoupon.is_active,
  };

  if (coupon.startDate && new Date(coupon.startDate) > new Date())
    return { valid: false, error: "Coupon not active yet" };

  if (coupon.endDate && new Date(coupon.endDate) < new Date())
    return { valid: false, error: "Coupon has expired" };

  if (
    coupon.maxUses &&
    coupon.usedCount !== null &&
    coupon.usedCount >= coupon.maxUses
  )
    return { valid: false, error: "Coupon usage limit reached" };

  if (coupon.minOrderAmount && orderTotal < parseFloat(coupon.minOrderAmount))
    return {
      valid: false,
      error: `Minimum order $${parseFloat(coupon.minOrderAmount).toFixed(2)}`,
    };

  const discountValue = parseFloat(coupon.discountValue);
  const discount =
    coupon.discountType === "percent"
      ? (orderTotal * discountValue) / 100
      : Math.min(discountValue, orderTotal);

  return {
    valid: true,
    coupon,
    discount: parseFloat(discount.toFixed(2)),
    finalTotal: parseFloat((orderTotal - discount).toFixed(2)),
  };
}

export async function incrementCouponUsage(code: string) {
  await supabaseAdmin.rpc("increment_coupon_usage", { coupon_code: code });
}
