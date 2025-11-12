// supabase/functions/send-otp/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
    });
  }

  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return new Response(JSON.stringify({ error: "Valid email required" }), {
        status: 400,
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Generate OTP with Supabase
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: { shouldCreateUser: true },
    });

    if (otpError) throw otpError;

    // Send custom email
    const { error: emailError } = await resend.emails.send({
      from: "Mimaht <onboarding@resend.dev>",
      to: [normalizedEmail],
      subject: "Your Mimaht Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626; text-align: center;">Mimaht Verification</h1>
          <p>We've sent a verification code to your email via Supabase.</p>
          <p>Check your inbox for the 6-digit code.</p>
        </div>
      `,
    });

    if (emailError) throw emailError;

    return new Response(
      JSON.stringify({ success: true, message: "OTP sent" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
});