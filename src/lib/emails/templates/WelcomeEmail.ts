interface WelcomeEmailProps {
  name: string;
  siteUrl: string;
}

export const WelcomeEmail = (props: WelcomeEmailProps) => {
  const { name, siteUrl } = props;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Welcome to Wings Academy</title>
</head>
<body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:40px;margin:0;">
  <div style="max-width:600px;margin:auto;background:white;padding:30px;border-radius:12px;text-align:center;box-shadow:0 10px 25px rgba(0,0,0,0.05);border:1px solid #e2e8f0;">
    <h2 style="color:#1e3a8a;margin-bottom:10px;font-size:24px;">Welcome to Wings Academy, ${name}!</h2>
    <div style="width:50px;height:4px;background:#1e3a8a;margin:0 auto 20px;"></div>
    
    <p style="font-size:16px;color:#4b5563;line-height:1.6;">
      Thank you for signing up for your mock test platform. We're excited to help you prepare and succeed in your aviation journey.
    </p>
    
    <p style="font-size:16px;color:#4b5563;margin-top:15px;line-height:1.6;">
      Please confirm your email to activate your account and start practicing.
    </p>

    <a href="${siteUrl}/login"
       style="display:inline-block;margin-top:30px;padding:16px 32px;
       background:#1e3a8a;color:white;text-decoration:none;
       border-radius:10px;font-size:16px;font-weight:bold;letter-spacing:0.5px;">
       Go to Login →
    </a>

    <div style="margin-top:40px;padding-top:20px;border-top:1px solid #f1f5f9;">
      <p style="font-size:13px;color:#9ca3af;">
        If you didn't create this account, you can safely ignore this email.
      </p>
      <p style="margin-top:10px;font-size:14px;color:#1e3a8a;font-weight:700;">
        © Wings Academy · Prepare for Take Off
      </p>
    </div>
  </div>
</body>
</html>`.trim();
};
