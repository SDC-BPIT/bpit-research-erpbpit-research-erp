const nodemailer = require('nodemailer');

const mailTransporter = process.env.SMTP_HOST ? nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  tls: { rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED !== 'false' }
}) : null;

async function sendResetLink(email, name, resetToken) {
  const from = process.env.EMAIL_FROM || 'BPIT ERP <no-reply@bpitindia.com>';
  const subject = 'BPIT ERP Password Reset Link';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;
  const text = `Hello ${name || 'User'},\n\nA password reset request was received for your BPIT ERP account. Use the link below to choose a new password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this message or contact your administrator.`;
  const html = `<p>Hello ${name || 'User'},</p><p>A password reset request was received for your BPIT ERP account. Use the link below to choose a new password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you did not request this, please ignore this message or contact your administrator.</p>`;

  if (!mailTransporter) {
    console.log('Password reset email (no SMTP configured):', { to: email, subject, resetUrl });
    return;
  }

  await mailTransporter.sendMail({ from, to: email, subject, text, html });
}

async function sendPasswordNotification(email, name, password) {
  const from = process.env.EMAIL_FROM || 'BPIT ERP <no-reply@bpitindia.com>';
  const subject = 'BPIT ERP Password Updated';
  const text = `Hello ${name || 'User'},\n\nYour BPIT ERP password was updated by the administrator.\n\nEmail: ${email}\nPassword: ${password}\n\nPlease log in and change your password after signing in.\n\nIf you did not request this change, contact your administrator immediately.`;
  const html = `<p>Hello ${name || 'User'},</p><p>Your BPIT ERP password was updated by the administrator.</p><p><strong>Email:</strong> ${email}<br/><strong>Password:</strong> ${password}</p><p>Please log in and change your password after signing in.</p><p>If you did not request this change, contact your administrator immediately.</p>`;

  if (!mailTransporter) {
    console.log('Password notification (no SMTP configured):', { to: email, subject, text });
    return;
  }

  await mailTransporter.sendMail({ from, to: email, subject, text, html });
}

module.exports = {
  mailTransporter,
  sendResetLink,
  sendPasswordNotification
};
