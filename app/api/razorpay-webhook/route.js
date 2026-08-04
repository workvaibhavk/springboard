import { NextResponse } from "next/server";
import crypto from "crypto";
// import { razorpay } from "@/lib/razorpay";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin"; // ⚠️ CHECK THIS PATH

export async function POST(req) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  const payload = JSON.parse(rawBody);
  const event = payload.event;

  if (event === "payment.captured") {
    const payment = payload.payload.payment.entity;
    await supabase
      .from("payments")
      .update({
        payment_status: "paid",
        payment_mode: "upi",
        razorpay_payment_id: payment.id,
      })
      .eq("razorpay_order_id", payment.order_id)
      .neq("payment_status", "paid");
  }

  if (event === "payment.failed") {
    const payment = payload.payload.payment.entity;
    await supabase
      .from("payments")
      .update({ payment_status: "failed" })
      .eq("razorpay_order_id", payment.order_id)
      .neq("payment_status", "paid");
  }

  return NextResponse.json({ status: "ok" });
}