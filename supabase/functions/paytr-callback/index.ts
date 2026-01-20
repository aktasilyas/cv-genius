import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // PayTR sends callback as POST with form data
    const formData = await req.formData();
    
    const merchantOid = formData.get("merchant_oid") as string;
    const status = formData.get("status") as string;
    const totalAmount = formData.get("total_amount") as string;
    const hash = formData.get("hash") as string;
    const failedReasonCode = formData.get("failed_reason_code") as string;
    const failedReasonMsg = formData.get("failed_reason_msg") as string;
    const testMode = formData.get("test_mode") as string;

    console.log("PayTR Callback received:", { merchantOid, status, totalAmount, testMode });

    // Get PayTR credentials
    const merchantKey = Deno.env.get("PAYTR_MERCHANT_KEY");
    const merchantSalt = Deno.env.get("PAYTR_MERCHANT_SALT");

    if (!merchantKey || !merchantSalt) {
      console.error("PayTR credentials not configured");
      return new Response("PAYTR credentials missing", { status: 500 });
    }

    // Verify hash
    const hashStr = `${merchantOid}${merchantSalt}${status}${totalAmount}`;
    const encoder = new TextEncoder();
    const keyData = encoder.encode(merchantKey);
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(hashStr));
    const calculatedHash = btoa(String.fromCharCode(...new Uint8Array(signature)));

    if (hash !== calculatedHash) {
      console.error("Hash verification failed");
      return new Response("PAYTR notification error: bad hash", { status: 400 });
    }

    // Initialize Supabase with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the order
    const { data: order, error: orderError } = await supabase
      .from("payment_orders")
      .select("*")
      .eq("merchant_oid", merchantOid)
      .single();

    if (orderError || !order) {
      console.error("Order not found:", merchantOid);
      return new Response("OK", { status: 200 }); // Still return OK to PayTR
    }

    if (status === "success") {
      // Payment successful - update subscription
      const now = new Date();
      const periodEnd = new Date();
      
      if (order.billing_period === "yearly") {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      } else {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      }

      // Update user subscription
      const { error: subError } = await supabase
        .from("user_subscriptions")
        .update({
          plan: "premium",
          status: "active",
          current_period_start: now.toISOString(),
          current_period_end: periodEnd.toISOString(),
          updated_at: now.toISOString(),
        })
        .eq("user_id", order.user_id);

      if (subError) {
        console.error("Failed to update subscription:", subError);
      }

      // Update order status
      await supabase
        .from("payment_orders")
        .update({ 
          status: "completed",
          completed_at: now.toISOString(),
        })
        .eq("merchant_oid", merchantOid);

      console.log("Payment successful for user:", order.user_id);
    } else {
      // Payment failed
      await supabase
        .from("payment_orders")
        .update({ 
          status: "failed",
          failed_reason: failedReasonMsg || failedReasonCode,
        })
        .eq("merchant_oid", merchantOid);

      console.log("Payment failed:", { merchantOid, failedReasonCode, failedReasonMsg });
    }

    // PayTR expects "OK" response
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Callback error:", error);
    return new Response("OK", { status: 200 }); // Still return OK to avoid retries
  }
});
