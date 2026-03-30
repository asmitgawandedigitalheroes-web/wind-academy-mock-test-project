interface AdminEssayAlertEmailProps {
  displayName: string;
  studentEmail: string;
  testTitle: string;
  siteUrl: string;
}

export const AdminEssayAlertEmail = (props: AdminEssayAlertEmailProps) => {
  const { displayName, studentEmail, testTitle, siteUrl } = props;

  return `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"/></head>
<body style="font-family:Arial,sans-serif;background:#f4f6fb;padding:32px 0;margin:0;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table width="600" style="background:#ffffff;border-radius:16px;overflow:hidden;">
<tr><td style="background:#142c73;padding:24px 40px;">
  <h1 style="color:#ffffff;margin:0;font-size:20px;font-weight:900;">Wings Academy — Admin Alert</h1>
</td></tr>
<tr><td style="padding:32px 40px;">
  <h2 style="color:#142c73;font-size:18px;margin:0 0 16px;">New Essay Submitted for Grading</h2>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="color:#64748b;font-size:14px;padding:8px 0;border-bottom:1px solid #f1f5f9;width:120px;"><strong>Student</strong></td><td style="color:#1e293b;font-size:14px;padding:8px 0;border-bottom:1px solid #f1f5f9;">${displayName} (${studentEmail})</td></tr>
    <tr><td style="color:#64748b;font-size:14px;padding:8px 0;border-bottom:1px solid #f1f5f9;"><strong>Test</strong></td><td style="color:#1e293b;font-size:14px;padding:8px 0;border-bottom:1px solid #f1f5f9;">${testTitle}</td></tr>
    <tr><td style="color:#64748b;font-size:14px;padding:8px 0;"><strong>Submitted</strong></td><td style="color:#1e293b;font-size:14px;padding:8px 0;">${new Date().toLocaleString()}</td></tr>
  </table>
  <p style="margin:24px 0 0;"><a href="${siteUrl}/admin/results" style="background:#142c73;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:700;font-size:14px;">Grade Essay →</a></p>
</td></tr>
</table></td></tr></table>
</body></html>`.trim();
};
