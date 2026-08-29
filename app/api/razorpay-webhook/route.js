import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";

export async function POST(req) {
  try {
    // 1. Get raw body — required for Razorpay signature verification
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("❌ WEBHOOK FAILED: RAZORPAY_WEBHOOK_SECRET is missing");

      return NextResponse.json(
        { error: "Webhook secret is not configured" },
        { status: 500 }
      );
    }

    // 2. Generate expected Razorpay signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    // 3. Verify signature safely
    const sigValid =
      signature &&
      signature.length === expectedSignature.length &&
      crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );

    if (!sigValid) {
      console.error("❌ WEBHOOK FAILED: Invalid Razorpay signature");

      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 400 }
      );
    }

    // 4. Parse webhook body
    let payload;

    try {
      payload = JSON.parse(rawBody);
    } catch (error) {
      console.error("❌ WEBHOOK FAILED: Invalid JSON", error);

      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400 }
      );
    }

    const event = payload.event;

    console.log(`📩 Razorpay webhook received: ${event}`);

    // 5. Payment captured
    if (event === "payment.captured") {
      const payment = payload?.payload?.payment?.entity;

      if (!payment) {
        console.error(
          "❌ WEBHOOK FAILED: payment.captured payload is missing payment entity"
        );

        return NextResponse.json(
          { error: "Invalid payment payload" },
          { status: 400 }
        );
      }

      const { error } = await supabase
        .from("payments")
        .update({
          payment_status: "paid",
          payment_mode: payment.method,
          razorpay_payment_id: payment.id,
        })
        .eq("razorpay_order_id", payment.order_id)
        .neq("payment_status", "paid");

      if (error) {
        console.error(
          "❌ WEBHOOK FAILED: Supabase payment update failed:",
          error
        );

        return NextResponse.json(
          { error: "Database update failed" },
          { status: 500 }
        );
      }

      console.log(
        `✅ PAYMENT CAPTURED: ${payment.id} | Order: ${payment.order_id} | Method: ${payment.method}`
      );
    }

    // 6. Payment failed
    if (event === "payment.failed") {
      const payment = payload?.payload?.payment?.entity;

      if (!payment) {
        console.error(
          "❌ WEBHOOK FAILED: payment.failed payload is missing payment entity"
        );

        return NextResponse.json(
          { error: "Invalid payment payload" },
          { status: 400 }
        );
      }

      const { error } = await supabase
        .from("payments")
        .update({
          payment_status: "failed",
        })
        .eq("razorpay_order_id", payment.order_id)
        .neq("payment_status", "paid");

      if (error) {
        console.error(
          "❌ WEBHOOK FAILED: Supabase failed-payment update failed:",
          error
        );

        return NextResponse.json(
          { error: "Database update failed" },
          { status: 500 }
        );
      }

      console.log(
        `⚠️ PAYMENT FAILED: ${payment.id} | Order: ${payment.order_id}`
      );
    }

    // 7. Unknown event — don't treat it as a failure
    if (
      event !== "payment.captured" &&
      event !== "payment.failed"
    ) {
      console.log(`ℹ️ Unhandled Razorpay webhook event: ${event}`);
    }

    // 8. Successfully processed webhook
    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("🔥 WEBHOOK FAILED: Unexpected server error:", error);

    return NextResponse.json(
      { error: "Internal webhook processing error" },
      { status: 500 }
    );
  }
                                                    }
