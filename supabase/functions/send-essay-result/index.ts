// Supabase Edge Function — send-essay-result
//
// Triggered by the DB webhook/trigger when test_results.status changes to 'graded'.
// Sends the student an email with their score and feedback via Resend API.
//
// REQUIRED ENV VARS (set in Supabase Dashboard → Settings → Edge Functions → Secrets):
//   RESEND_API_KEY=re_...
//   EMAIL_FROM=Wings Academy <noreply@wingsacademy.ae>

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_URL = "https://api.resend.com/emails";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function sendViaResend(opts: {
  to: string | string[];
  subject: string;
  html: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    console.warn("RESEND_API_KEY is not set in Edge Function secrets.");
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  const from =
    Deno.env.get("EMAIL_FROM") ?? "Wings Academy <noreply@wingsacademy.ae>";

  const res = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(opts.to) ? opts.to : [opts.to],
      subject: opts.subject,
      html: opts.html,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("Resend API error:", data);
    return { success: false, error: data?.message ?? "Resend error" };
  }

  return { success: true, id: data.id };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { record, old_record } = await req.json();

    // Only send email when status transitions TO 'graded'
    if (record.status !== "graded" || (old_record && old_record.status === "graded")) {
      return new Response(JSON.stringify({ message: "No action needed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Fetch result details — user email, name, test title, score, feedback
    const { data: resultData, error: fetchError } = await supabaseClient
      .from("test_results")
      .select(`
        score,
        feedback,
        user:user_id ( email, raw_user_meta_data ),
        test:test_set_id ( title )
      `)
      .eq("id", record.id)
      .single();

    if (fetchError || !resultData) {
      throw fetchError || new Error("Result not found");
    }

    const userEmail = (resultData.user as any).email;
    const testTitle = (resultData.test as any).title;
    const score = Math.round(resultData.score);
    const feedback = resultData.feedback || "No feedback provided.";
    const userName =
      (resultData.user as any).raw_user_meta_data?.full_name || "Student";
    const isPassed = score >= 75;
    const siteUrl =
      Deno.env.get("NEXT_PUBLIC_SITE_URL") ??
      "https://wings-academy-mock-test-project.vercel.app";

    // HTML email body
    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 32px rgba(0,0,0,0.06);">
    <!-- Header -->
    <div style="background:#0f172a;padding:40px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:900;letter-spacing:-0.5px;">Wings Academy</h1>
      <p style="color:#94a3b8;margin:8px 0 0;font-size:14px;font-weight:600;">Essay Result Notification</p>
    </div>

    <!-- Body -->
    <div style="padding:40px;">
      <p style="color:#0f172a;font-size:16px;font-weight:700;margin:0 0 8px;">Dear ${userName},</p>
      <p style="color:#64748b;font-size:14px;line-height:1.6;margin:0 0 32px;">
        Your essay submission for <strong style="color:#0f172a;">${testTitle}</strong> has been reviewed and graded by your instructor.
      </p>

      <!-- Score Card -->
      <div style="background:${isPassed ? "#f0fdf4" : "#fff1f2"};border-left:4px solid ${isPassed ? "#22c55e" : "#ef4444"};border-radius:16px;padding:24px;text-align:center;margin-bottom:32px;">
        <p style="color:#64748b;font-size:11px;font-weight:900;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Your Score</p>
        <p style="color:${isPassed ? "#15803d" : "#b91c1c"};font-size:56px;font-weight:900;margin:0;line-height:1;">${score}%</p>
        <p style="color:${isPassed ? "#16a34a" : "#dc2626"};font-size:14px;font-weight:700;margin:12px 0 0;">${isPassed ? "✅ Passed" : "❌ Needs Improvement"}</p>
      </div>

      <!-- Feedback -->
      <div style="border-left:4px solid #6366f1;padding:16px 20px;background:#f8f8ff;border-radius:0 12px 12px 0;margin-bottom:32px;">
        <p style="color:#4338ca;font-size:11px;font-weight:900;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Instructor Feedback</p>
        <p style="color:#374151;font-size:14px;line-height:1.7;margin:0;">${feedback}</p>
      </div>

      <p style="color:#64748b;font-size:14px;line-height:1.6;margin:0 0 32px;">
        Please log in to the Wings Academy platform to view your full submission details. If you have any questions about your result, please reach out to your instructor.
      </p>

      <a href="${siteUrl}/dashboard/results" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:16px 32px;border-radius:12px;font-weight:900;font-size:13px;letter-spacing:1px;text-transform:uppercase;">
        View My Results →
      </a>
    </div>

    <!-- Footer -->
    <div style="padding:24px 40px;border-top:1px solid #f1f5f9;text-align:center;">
      <p style="color:#94a3b8;font-size:12px;margin:0;">Wings Academy · UAE Aviation Training</p>
      <p style="color:#cbd5e1;font-size:11px;margin:4px 0 0;">Results are sent within 24 hours of submission review.</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    // Send via Resend
    const result = await sendViaResend({
      to: userEmail,
      subject: `Your Essay Result — ${testTitle} (${score}%)`,
      html: htmlBody,
    });

    if (!result.success) {
      console.warn("Resend failed:", result.error);
      return new Response(
        JSON.stringify({ success: false, message: result.error }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    console.log(
      `Essay result email sent to ${userEmail} for test "${testTitle}". ID: ${result.id}`
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: `Email sent to ${userEmail}`,
        id: result.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: error?.message || "Internal Server Error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
