interface EssayResultEmailProps {
  displayName: string;
  testTitle: string;
  score: number;
  feedback?: string;
  siteUrl: string;
}

export const EssayResultEmail = (props: EssayResultEmailProps) => {
  const { displayName, testTitle, score, feedback, siteUrl } = props;
  const isPassed = score >= 75;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
</head>
<body style="font-family:Arial,sans-serif;background:#f4f6fb;padding:32px 0;margin:0;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="600" style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(20,44,115,0.08);border:1px solid #e2e8f0;">
          <tr>
            <td style="background:#142c73;padding:40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:26px;font-weight:900;letter-spacing:-0.5px;">Wings Academy</h1>
              <p style="color:#93b4ff;margin:8px 0 0;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;">Results Evaluation</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="color:#142c73;font-size:22px;margin:0 0 16px;font-weight:800;">Your Essay Has Been Graded</h2>
              <p style="color:#64748b;font-size:16px;line-height:1.7;margin:0 0 8px;">Dear <strong>${displayName}</strong>,</p>
              <p style="color:#64748b;font-size:16px;line-height:1.7;">Your essay for <strong>${testTitle}</strong> has been reviewed and graded. Here is your evaluation:</p>
              
              <div style="background:${isPassed ? '#f0fdf4' : '#fff1f2'};border-left:4px solid ${isPassed ? '#22c55e' : '#ef4444'};border-radius:16px;padding:30px;margin:32px 0;text-align:center;">
                <p style="color:#64748b;font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Your Performance Score</p>
                <div style="color:${isPassed ? '#15803d' : '#b91c1c'};font-size:56px;font-weight:900;margin:0;line-height:1;">${Math.round(score)}%</div>
                <p style="color:${isPassed ? '#16a34a' : '#dc2626'};font-size:14px;font-weight:700;margin:12px 0 0;">${isPassed ? '✅ Passed Successfully' : '❌ Needs Further Practice'}</p>
              </div>

              ${feedback ? `
              <div style="background:#f8fafc;border-radius:16px;padding:24px;margin:16px 0;border:1px dashed #cbd5e1;">
                <p style="color:#142c73;font-weight:900;font-size:14px;margin:0 0 12px;text-transform:uppercase;letter-spacing:1px;">Instructor Detailed Feedback</p>
                <p style="color:#475569;font-size:15px;margin:0;line-height:1.8;">${feedback.replace(/\n/g, '<br/>')}</p>
              </div>` : ''}

              <p style="margin:40px 0 0;text-align:center;">
                <a href="${siteUrl}/dashboard/results" style="display:inline-block;background:#142c73;color:#ffffff;text-decoration:none;padding:18px 40px;border-radius:12px;font-weight:800;font-size:14px;letter-spacing:0.5px;text-transform:uppercase;">View Detailed Analysis</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #f1f5f9;">
              <p style="color:#94a3b8;font-size:12px;margin:0;">© Wings Academy · Prepare for Take Off</p>
              <p style="color:#cbd5e1;font-size:11px;margin:4px 0 0;">UAE Aviation Training Platform</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
};
