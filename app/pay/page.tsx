"use client";

import { useState } from "react";
import { loadRazorpayScript } from "@/lib/loadRazorpayScript";
import DNavbar from "@/page_components/DNavbar";
import Footer from "@/page_components/Footer";


declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Home() {
  const [enrollmentNo, setEnrollmentNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handlePay = async () => {
    if (!enrollmentNo.trim()) {
      alert("Please enter your enrollment number");
      return;
    }

    setLoading(true);
    setStatus("idle");

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Failed to load payment gateway. Check your connection.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrollment_no: enrollmentNo }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to create order");
        setLoading(false);
        return;
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "vSpringboard pvt ltd",
        description: "Entry Fee Payment",
        order_id: data.orderId,
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              enrollment_no: enrollmentNo,
            }),
          });
          const verifyData = await verifyRes.json();

          if (verifyRes.ok && verifyData.success) {
            setStatus("success");
          } else {
            setStatus("error");
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
        theme: { color: "#16a34a" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function () {
        setStatus("error");
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return ( 
    <div className="">

   <DNavbar/>

   <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6 p-6">
  {/* Culture Pay logo */}
  <img
    src="/cpay.jpeg"
    alt="Culture Pay"
    width={300}
    height={100}
    className="w-64 h-auto"
  />

  <h1 className="text-2xl font-bold tracking-wider uppercase">
    Pay 5.68rs
  </h1>

  <input
    type="text"
    placeholder="Enrollment Number"
    value={enrollmentNo}
    onChange={(e) => setEnrollmentNo(e.target.value)}
    className="bg-black border border-white/40 rounded-full px-6 py-3 w-72 text-white outline-none transition-colors duration-150 ease-in-out placeholder:text-white/40 focus:border-white"
  />

  <button
    onClick={handlePay}
    disabled={loading}
    className="bg-white text-black font-semibold px-8 py-3 rounded-full border-none cursor-pointer transition-colors duration-150 ease-in-out hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed"
  >
    {loading ? "Processing..." : "Pay"}
  </button>

  {status === "success" && (
    <p className="font-semibold rounded-full px-4 py-1 text-sm leading-5 text-white border border-white/30">
      ✅ Payment successful
    </p>
  )}
  
  {status === "error" && (
    <p className="font-semibold rounded-full px-4 py-1 text-sm leading-5 text-white/70 border border-white/20">
      ❌ Payment failed. Try again.
    </p>
  )}</main>
  <Footer/>  </div>

  );
}
