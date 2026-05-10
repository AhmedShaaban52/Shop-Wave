"use server";

import { stripe } from "@/lib/stripe";
import { getServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: string;
  quantity: number;
  discountType?: string | null;
  discountValue?: string | null;
}

function getFinalPrice(item: CartItem): number {
  const price = parseFloat(item.price);
  if (!item.discountType || !item.discountValue) return price;
  const discount = parseFloat(item.discountValue);
  if (item.discountType === "percent") return price - (price * discount) / 100;
  if (item.discountType === "amount") return Math.max(0, price - discount);
  return price;
}

export async function createCheckoutSession(items: CartItem[], userId: string) {
  const supabase = await getServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const lineItems = items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
        images: [item.image],
      },
      unit_amount: Math.round(getFinalPrice(item) * 100),
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
    metadata: {
      userId,
      items: JSON.stringify(
        items.map((i) => ({
          productId: i.id,
          name: i.name,
          image: i.image,
          price: getFinalPrice(i).toFixed(2),
          quantity: i.quantity,
        })),
      ),
    },
  });

  redirect(session.url!);
}
