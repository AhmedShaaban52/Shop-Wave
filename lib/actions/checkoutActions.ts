"use server";

import { stripe } from "@/lib/stripe";
import { getServerSupabase } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

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

export async function createCheckoutSession(
  items: CartItem[],
  userId: string,
  couponCode?: string,
  couponDiscount?: number,
) {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

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

  let discounts = [];

  if (couponDiscount && couponDiscount > 0) {
    try {
      const stripeCoupon = await stripe.coupons.create({
        amount_off: Math.round(couponDiscount * 100),
        currency: "usd",
        duration: "once",
        name: `Coupon: ${couponCode}`,
      });

      discounts.push({
        coupon: stripeCoupon.id,
      });
    } catch (stripeErr: any) {
      console.error("Stripe Coupon Error:", stripeErr.message);
    }
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    discounts: discounts,
    mode: "payment",
    success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/cart`,
    metadata: {
      userId,
      couponCode: couponCode || "",
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

  return { url: session.url };
}

export async function getUserOrders() {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, data: [] };

  const { data, error } = await supabase
    .from("orders")
    .select(`*, order_items (*)`)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message, data: [] };
  return { success: true, data };
}

export async function confirmOrder(sessionId: string) {
  const supabase = await getServerSupabase();

  const { data: existingOrder } = await supabase
    .from("orders")
    .select("id")
    .eq("stripe_session_id", sessionId)
    .single();

  if (existingOrder) return { success: true };

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid")
    return { success: false, error: "Payment not completed" };

  const userId = session.metadata?.userId;
  const items = JSON.parse(session.metadata?.items || "[]");

  if (!userId) return { success: false, error: "Missing user data" };

  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .insert({
      user_id: userId,
      stripe_session_id: sessionId,
      stripe_payment_intent: session.payment_intent as string,
      total: (session.amount_total! / 100).toFixed(2),
      status: "paid",
    })
    .select()
    .single();

  if (orderError) throw orderError;

  await supabaseAdmin.from("order_items").insert(
    items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
    })),
  );

  await supabaseAdmin.from("carts").delete().eq("user_id", userId);

  return { success: true };
}
