import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin"; 

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    const userId = session.metadata.userId;
    const items = JSON.parse(session.metadata.items);

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: userId,
        stripe_session_id: session.id,
        stripe_payment_intent: session.payment_intent,
        total: (session.amount_total / 100).toFixed(2),
        status: "paid",
      })
      .select()
      .single();

    if (orderError) return new Response("Error saving order", { status: 500 });

    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
    }));

    await supabaseAdmin.from("order_items").insert(orderItems);

    await supabaseAdmin.from("carts").delete().eq("user_id", userId);
  }

  return new Response(null, { status: 200 });
}
