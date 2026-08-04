import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { razorpay } from "@/lib/razorpay";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin"; // ⚠️ CHECK THIS PATH

export async function POST(req: NextRequest) {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    enrollment_no,
  } = await req.json();

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
  }

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  const isValid = expectedSignature === razorpay_signature;

  if (!isValid) {
    (await supabase
      .from("payments") as any)
      .update({ payment_status: "failed" })
      .eq("razorpay_order_id", razorpay_order_id);

    return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
  }

  const { error } = (await supabase  
    .from("payments") as any)
    .update({
      payment_status: "paid",
      payment_mode: "upi",
      razorpay_payment_id,
    })
    .eq("razorpay_order_id", razorpay_order_id)
    .eq("enrollment_no", enrollment_no);

  if (error) {
    return NextResponse.json({ success: false, error: "DB update failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}