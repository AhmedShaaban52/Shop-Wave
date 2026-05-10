import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getServerSupabase } from "@/lib/supabase/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, items } = session.metadata!;
    const parsedItems = JSON.parse(items);

    const supabase = await getServerSupabase();

    const { data: order } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        stripe_session_id: session.id,
        stripe_payment_intent: session.payment_intent as string,
        status: "paid",
        total: (session.amount_total! / 100).toFixed(2),
      })
      .select()
      .single();

    if (order) {
      await supabase.from("order_items").insert(
        parsedItems.map((item: any) => ({
          order_id: order.id,
          product_id: item.productId,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
      );

      await supabase.from("carts").delete().eq("user_id", userId);
    }
  }

  return NextResponse.json({ received: true });
}
