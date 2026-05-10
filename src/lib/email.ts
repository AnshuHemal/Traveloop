import nodemailer from "nodemailer";
import { siteConfig } from "@/config/site";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
});

const FROM =
  process.env.EMAIL_FROM ?? `${siteConfig.name} <noreply@traveloop.com>`;

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  await transporter.sendMail({ from: FROM, to, subject, html });
}

interface SendOTPEmailOptions {
  to: string;
  otp: string;
  type: "email-verification" | "sign-in" | "forget-password" | "change-email";
}

export async function sendOTPEmail({ to, otp, type }: SendOTPEmailOptions) {
  await sendEmail({
    to,
    subject: getSubject(type),
    html: buildOTPEmailHTML({ otp, type }),
  });
}

function getSubject(type: SendOTPEmailOptions["type"]): string {
  switch (type) {
    case "email-verification": return `Verify your ${siteConfig.name} account`;
    case "sign-in":            return `Your ${siteConfig.name} sign-in code`;
    case "forget-password":    return `Reset your ${siteConfig.name} password`;
    case "change-email":       return `Confirm your new ${siteConfig.name} email`;
  }
}

function getHeading(type: SendOTPEmailOptions["type"]): string {
  switch (type) {
    case "email-verification": return "Verify your email address";
    case "sign-in":            return "Your sign-in code";
    case "forget-password":    return "Reset your password";
    case "change-email":       return "Confirm your new email";
  }
}

function getBody(type: SendOTPEmailOptions["type"]): string {
  switch (type) {
    case "email-verification":
      return `Enter the code below to verify your email and start planning your adventures with ${siteConfig.name}.`;
    case "sign-in":
      return `Enter the code below to sign in to your ${siteConfig.name} account.`;
    case "forget-password":
      return `Enter the code below to reset your ${siteConfig.name} password.`;
    case "change-email":
      return `Enter the code below to confirm your new email address.`;
  }
}

function buildOTPEmailHTML({
  otp,
  type,
}: {
  otp: string;
  type: SendOTPEmailOptions["type"];
}): string {
  const heading = getHeading(type);
  const body = getBody(type);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${heading}</title>
</head>
<body style="margin:0;padding:0;background-color:#f0fdf4;font-family:Inter,ui-sans-serif,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdf4;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:16px;border:1px solid #d1fae5;overflow:hidden;">
        <tr>
          <td style="padding:28px 40px 24px;border-bottom:1px solid #f0fdf4;background:linear-gradient(135deg,#ecfdf5,#f0fdf4);">
            <span style="font-size:22px;font-weight:800;letter-spacing:-0.5px;color:#065f46;">✈ ${siteConfig.name}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px;">
            <h1 style="margin:0 0 12px;font-size:20px;font-weight:700;color:#111827;">${heading}</h1>
            <p style="margin:0 0 28px;font-size:14px;line-height:1.6;color:#6b7280;">${body}</p>
            <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
              <tr>
                <td style="background:#f0fdf4;border:2px solid #6ee7b7;border-radius:12px;padding:16px 28px;">
                  <span style="font-size:30px;font-weight:800;letter-spacing:8px;color:#065f46;font-family:'Courier New',monospace;">${otp}</span>
                </td>
              </tr>
            </table>
            <p style="margin:0 0 8px;font-size:13px;color:#9ca3af;">This code expires in <strong style="color:#6b7280;">10 minutes</strong>.</p>
            <p style="margin:0;font-size:13px;color:#9ca3af;">If you didn't request this, you can safely ignore this email.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px;border-top:1px solid #f0fdf4;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">© ${new Date().getFullYear()} ${siteConfig.name}. Happy travels! 🌍</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();
}
