import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PayTRRequest {
  billingPeriod: 'monthly' | 'yearly';
  userEmail: string;
  userName: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get PayTR credentials from secrets
    const merchantId = Deno.env.get("PAYTR_MERCHANT_ID");
    const merchantKey = Deno.env.get("PAYTR_MERCHANT_KEY");
    const merchantSalt = Deno.env.get("PAYTR_MERCHANT_SALT");

    if (!merchantId || !merchantKey || !merchantSalt) {
      console.error("PayTR credentials not configured");
      return new Response(
        JSON.stringify({ 
          error: "Payment system not configured",
          missingCredentials: true 
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: PayTRRequest = await req.json();
    const { billingPeriod, userEmail, userName } = body;

    // Calculate amount in kuruş (1 TL = 100 kuruş)
    const prices = {
      monthly: 5900, // 59 TL
      yearly: 49900, // 499 TL
    };
    const paymentAmount = prices[billingPeriod];

    // Generate unique merchant order ID
    const merchantOid = `premium_${user.id}_${Date.now()}`;

    // User info
    const email = userEmail || user.email || "customer@example.com";
    const userName2 = userName || email.split("@")[0];
    const userAddress = "Türkiye";
    const userPhone = "5555555555";

    // Basket items (JSON format for PayTR)
    const basketItems = [
      [
        billingPeriod === "yearly" ? "Premium Yıllık Abonelik" : "Premium Aylık Abonelik",
        paymentAmount.toString(),
        1,
      ],
    ];
    const userBasket = btoa(JSON.stringify(basketItems));

    // Build callback URLs
    const origin = req.headers.get("origin") || "https://cvcraft.com";
    const merchantOkUrl = `${origin}/payment/success?order=${merchantOid}`;
    const merchantFailUrl = `${origin}/payment/failed?order=${merchantOid}`;

    // PayTR iFrame API parameters
    const noInstallment = "1"; // No installment
    const maxInstallment = "0";
    const currency = "TL";
    const testMode = "1"; // Test mode - change to "0" for production
    const debugOn = "1"; // Debug mode - change to "0" for production
    const lang = "tr";
    const timeout_limit = "30"; // 30 minutes timeout
    const paytr_token_expires = "5"; // Token expires in 5 minutes

    // Build hash string for token
    // PayTR hash format: merchant_id + user_ip + merchant_oid + email + payment_amount + user_basket + no_installment + max_installment + currency + test_mode + merchant_salt
    const userIp = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("cf-connecting-ip") || "127.0.0.1";
    
    const hashStr = `${merchantId}${userIp}${merchantOid}${email}${paymentAmount}${userBasket}${noInstallment}${maxInstallment}${currency}${testMode}${merchantSalt}`;
    
    // Create HMAC SHA256 hash
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
    const paytrToken = btoa(String.fromCharCode(...new Uint8Array(signature)));

    // Prepare POST data for PayTR
    const postData = new URLSearchParams({
      merchant_id: merchantId,
      user_ip: userIp,
      merchant_oid: merchantOid,
      email: email,
      payment_amount: paymentAmount.toString(),
      paytr_token: paytrToken,
      user_basket: userBasket,
      debug_on: debugOn,
      no_installment: noInstallment,
      max_installment: maxInstallment,
      user_name: userName2,
      user_address: userAddress,
      user_phone: userPhone,
      merchant_ok_url: merchantOkUrl,
      merchant_fail_url: merchantFailUrl,
      timeout_limit: timeout_limit,
      currency: currency,
      test_mode: testMode,
      lang: lang,
    });

    // Request iFrame token from PayTR
    const paytrResponse = await fetch("https://www.paytr.com/odeme/api/get-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: postData.toString(),
    });

    const paytrResult = await paytrResponse.json();

    if (paytrResult.status === "success") {
      // Store the order in database for callback verification
      const supabaseService = createClient(
        supabaseUrl,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      await supabaseService.from("payment_orders").insert({
        merchant_oid: merchantOid,
        user_id: user.id,
        amount: paymentAmount,
        billing_period: billingPeriod,
        status: "pending",
      });

      return new Response(
        JSON.stringify({
          success: true,
          token: paytrResult.token,
          merchantOid: merchantOid,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      console.error("PayTR error:", paytrResult);
      return new Response(
        JSON.stringify({
          error: "Failed to create payment session",
          details: paytrResult.reason || "Unknown error",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
