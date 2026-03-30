interface EssaySubmittedEmailProps {
  displayName: string;
  testTitle: string;
  adminEmail: string;
  siteUrl: string;
}

export const EssaySubmittedEmail = (props: EssaySubmittedEmailProps) => {
  const { displayName, testTitle, adminEmail, siteUrl } = props;

  return `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"/></head>
<body style="font-family:Arial,sans-serif;background:#f4f6fb;padding:32px 0;margin:0;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table width="600" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(20,44,115,0.08);">
<tr><td style="background:#142c73;padding:32px 40px;text-align:center;">
  <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:900;">Wings Academy</h1>
  <p style="color:#93b4ff;margin:8px 0 0;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:2px;">Mock Test Platform</p>
</td></tr>
<tr><td style="padding:40px;">
  <h2 style="color:#142c73;font-size:20px;margin:0 0 16px;">Essay Submitted Successfully</h2>
  <p style="color:#475569;font-size:15px;line-height:1.7;">Dear <strong>${displayName}</strong>,</p>
  <p style="color:#475569;font-size:15px;line-height:1.7;">Your essay for <strong>${testTitle}</strong> has been successfully submitted and is currently under review.</p>
  <div style="background:#f0f4ff;border-left:4px solid #142c73;border-radius:8px;padding:20px 24px;margin:24px 0;">
    <p style="color:#142c73;font-weight:900;font-size:14px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">What happens next?</p>
    <p style="color:#475569;font-size:14px;margin:0;line-height:1.7;">Our instructors will review and grade your essay. You will receive your results and feedback by email <strong>within 24 hours</strong>.</p>
  </div>
  <p style="color:#94a3b8;font-size:13px;margin:32px 0 0;">Questions? Contact us at <a href="mailto:${adminEmail}" style="color:#142c73;">${adminEmail}</a>.</p>
</td></tr>
<tr><td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
  <p style="color:#94a3b8;font-size:12px;margin:0;">© Wings Academy — <a href="${siteUrl}" style="color:#142c73;">${siteUrl}</a></p>
</td></tr>
</table></td></tr></table>
</body></html>`.trim();
};
