"use server";

import { getServerSupabase } from "@/lib/supabase/server";
import { OfferSchemaType } from "@/lib/types";
import { revalidatePath } from "next/cache";

const OFFER_SELECT = `
  id,
  name,
  description,
  image,
  discount,
  startDate:start_date,
  endDate:end_date,
  createdAt:created_at,
  updatedAt:updated_at
`;

export async function getOffers() {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase
    .from("offers")
    .select(OFFER_SELECT)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error getting offers:", error);
    return { success: false, error: error.message };
  }
  return { success: true, data };
}

export async function createOffer(data: OfferSchemaType) {
  const supabase = await getServerSupabase();
  const { data: result, error } = await supabase
    .from("offers")
    .insert([
      {
        name: data.name,
        description: data.description || null,
        image: data.image as string,
        discount: data.discount,
        start_date: data.startDate || null,
        end_date: data.endDate || null,
      },
    ])
    .select(OFFER_SELECT)
    .single();

  if (error) {
    console.error("Error creating offer:", error);
    return { success: false, error: error.message };
  }
  revalidatePath("/admin/offers");
  return { success: true, data: result, message: "Offer created successfully" };
}

export async function updateOffer(id: string, data: OfferSchemaType) {
  const supabase = await getServerSupabase();
  const { data: result, error } = await supabase
    .from("offers")
    .update({
      name: data.name,
      description: data.description || null,
      image: data.image as string,
      discount: data.discount,
      start_date: data.startDate || null,
      end_date: data.endDate || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(OFFER_SELECT)
    .single();

  if (error) {
    console.error("Error updating offer:", error);
    return { success: false, error: error.message };
  }
  revalidatePath("/admin/offers");
  return { success: true, data: result, message: "Offer updated successfully" };
}

export async function deleteOffer(id: string) {
  const supabase = await getServerSupabase();
  const { error } = await supabase.from("offers").delete().eq("id", id);

  if (error) {
    console.error("Error deleting offer:", error);
    return { success: false, error: error.message };
  }
  revalidatePath("/admin/offers");
  return { success: true, message: "Offer deleted successfully" };
}
