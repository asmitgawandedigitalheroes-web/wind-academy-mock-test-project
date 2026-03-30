import { Resend } from 'resend';

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: any[];
}

interface SendTemplateOptions extends Omit<SendEmailOptions, 'html' | 'text'> {
  template: (props: any) => string;
  props: any;
}

/**
 * Common sender address
 * Format: "Name <email@domain.com>"
 */
const DEFAULT_FROM = process.env.EMAIL_FROM || 'Wings Academy <noreply@wingsacademy.ae>';

/**
 * Standard Email Function
 * Sends a basic HTML/text email using Resend
 */
export async function sendEmail(options: SendEmailOptions) {
  const { to, subject, html, text, cc, bcc, attachments } = options;

  try {
    const data = await resend.emails.send({
      from: DEFAULT_FROM,
      to,
      subject,
      html,
      text: text || '',
      cc,
      bcc,
      attachments,
    });

    console.log(`[Email Service] Success: Email sent to ${to}. ID: ${data.data?.id}`);
    return { success: true, id: data.data?.id };
  } catch (error: any) {
    console.error(`[Email Service] Failure: Could not send email to ${to}.`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Template Email Function
 * Renders a provided template function with props and sends it
 */
export async function sendTemplateEmail(options: SendTemplateOptions) {
  const { template, props, ...emailOptions } = options;
  
  try {
    const html = template(props);
    return await sendEmail({
      ...emailOptions,
      html,
    });
  } catch (error: any) {
    console.error(`[Email Service] Template Rendering Error:`, error.message);
    return { success: false, error: `Template error: ${error.message}` };
  }
}

/**
 * Bulk Email Function
 * Sends multiple emails in a single request (Resend Batch API)
 */
export async function sendBulkEmail(emails: SendEmailOptions[]) {
  try {
    const batch = emails.map((email) => ({
      from: DEFAULT_FROM,
      to: email.to,
      subject: email.subject,
      html: email.html,
      text: email.text || '',
      cc: email.cc,
      bcc: email.bcc,
      attachments: email.attachments,
    }));

    const data = await resend.batch.send(batch);

    console.log(`[Email Service] Bulk Success: Sent ${emails.length} emails.`);
    return { success: true, results: data.data };
  } catch (error: any) {
    console.error(`[Email Service] Bulk Failure:`, error.message);
    return { success: false, error: error.message };
  }
}
