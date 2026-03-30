interface ModuleUnlockedEmailProps {
  studentName: string;
  moduleName: string;
  amount?: number | string;
  siteUrl: string;
}

export const ModuleUnlockedEmail = (props: ModuleUnlockedEmailProps) => {
  const { studentName, moduleName, amount, siteUrl } = props;

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 32px rgba(0,0,0,0.06);">
    <div style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);padding:40px;text-align:center;">
      <div style="width:64px;height:64px;background:rgba(255,255,255,0.15);border-radius:20px;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:32px;">
        ✅
      </div>
      <h1 style="color:#ffffff;margin:0;font-size:26px;font-weight:900;letter-spacing:-0.5px;">Module Unlocked!</h1>
      <p style="color:#94a3b8;margin:8px 0 0;font-size:14px;font-weight:600;">Access granted successfully</p>
    </div>
    
    <div style="padding:40px;">
      <p style="color:#0f172a;font-size:18px;font-weight:700;margin:0 0 12px;">Hi ${studentName},</p>
      <p style="color:#64748b;font-size:16px;line-height:1.7;margin:0 0 32px;">
        ${amount ? `Great news! Your payment of <strong style="color:#0f172a;">AED ${amount}</strong> has been confirmed. ` : 'Great news! An admin has manually unlocked a new module for you. '}
        All tests in <strong style="color:#0f172a;">"${moduleName}"</strong> are now available with <strong style="color:#16a34a;">unlimited attempts</strong>.
      </p>

      <div style="background:#f0fdf4;border-radius:20px;padding:32px;margin-bottom:40px;border:1px solid #bbf7d0;">
        <p style="color:#15803d;font-size:12px;font-weight:900;letter-spacing:1px;text-transform:uppercase;margin:0 0 16px;">What you get</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#0f172a;font-size:16px;font-weight:700;">📚 ${moduleName}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#16a34a;font-size:14px;font-weight:700;">✓ All tests unlocked</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#16a34a;font-size:14px;font-weight:700;">✓ Unlimited attempts</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#16a34a;font-size:14px;font-weight:700;">✓ Full performance analytics</td>
          </tr>
        </table>
      </div>

      <div style="text-align:center;">
        <a href="${siteUrl}/dashboard/modules" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:18px 40px;border-radius:14px;font-weight:900;font-size:14px;letter-spacing:1px;text-transform:uppercase;box-shadow:0 10px 15px -3px rgba(15, 23, 42, 0.4);">
          Start Practicing Now
        </a>
      </div>
    </div>

    <div style="padding:32px 40px;border-top:1px solid #f1f5f9;text-align:center;background:#fcfdfe;">
      <p style="color:#94a3b8;font-size:12px;margin:0;">Wings Academy · Prepare for Take Off</p>
      <p style="color:#cbd5e1;font-size:11px;margin:4px 0 0;">Official UAE Aviation Training Platform</p>
    </div>
  </div>
</body>
</html>`.trim();
};
