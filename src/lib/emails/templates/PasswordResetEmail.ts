interface PasswordResetEmailProps {
  recoveryUrl: string;
}

export const PasswordResetEmail = (props: PasswordResetEmailProps) => {
  const { recoveryUrl } = props;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Reset Your Password</title>
</head>
<body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:40px;margin:0;">
  <div style="max-width:600px;margin:auto;background:white;padding:30px;border-radius:12px;text-align:center;box-shadow:0 10px 25px rgba(0,0,0,0.05);border:1px solid #e2e8f0;">
    <h2 style="color:#1e3a8a;margin-bottom:10px;font-size:24px;">Reset Your Password</h2>
    <div style="width:50px;height:4px;background:#ef4444;margin:0 auto 20px;"></div>
    
    <p style="font-size:16px;color:#4b5563;line-height:1.6;">
      We received a request to reset your password for your Wings Academy account. If you didn't request this, you can safely ignore this email.
    </p>
    
    <p style="font-size:16px;color:#4b5563;margin-top:15px;line-height:1.6;">
      Click the button below to set a new password. This link will expire in 24 hours.
    </p>

    <a href="${recoveryUrl}"
       style="display:inline-block;margin-top:30px;padding:16px 32px;
       background:#1e3a8a;color:white;text-decoration:none;
       border-radius:10px;font-size:16px;font-weight:bold;letter-spacing:0.5px;box-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
       Reset Password →
    </a>

    <div style="margin-top:40px;padding-top:20px;border-top:1px solid #f1f5f9;">
      <p style="font-size:13px;color:#9ca3af;">
        If the button above doesn't work, copy and paste the following link into your browser:
      </p>
      <p style="font-size:12px;color:#6b7280;margin:10px 0;word-wrap:break-word;">
        ${recoveryUrl}
      </p>
      <p style="margin-top:20px;font-size:14px;color:#1e3a8a;font-weight:700;">
        © Wings Academy · Prepare for Take Off
      </p>
    </div>
  </div>
</body>
</html>`.trim();
};
