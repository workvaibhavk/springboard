import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { supabaseAdmin as supabase } from "@/lib/supabase-admin";

const AMOUNT_INR = 5.68;

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { enrollment_no } = body;

    // Validate input
    if (
      !enrollment_no ||
      typeof enrollment_no !== "string" ||
      enrollment_no.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Valid enrollment number is required" },
        { status: 400 }
      );
    }

    // Ensure Razorpay key exists
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      console.error("NEXT_PUBLIC_RAZORPAY_KEY_ID is missing");

      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const amountInPaise = Math.round(AMOUNT_INR * 100);

    // Create Razorpay order
    let order;

    try {
      order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        notes: {
          enrollment_no: enrollment_no.trim(),
        },
      });
    } catch (err) {
      console.error("Razorpay order creation failed:", err);

      return NextResponse.json(
        { error: "Failed to create payment order" },
        { status: 502 }
      );
    }

    // Save order to Supabase
    const { error } = await supabase.from("payments").insert({
      enrollment_no: enrollment_no.trim(),
      amount: AMOUNT_INR,
      payment_status: "created",
      razorpay_order_id: order.id,
    }as any);

    if (error) {
      console.error("Supabase insert failed:", error);

      return NextResponse.json(
        { error: "Failed to save payment record" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        amount: amountInPaise,
        currency: order.currency,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unexpected error:", err);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
