/**
 * Email Service
 * 
 * Uses Nodemailer to send real emails via SMTP.
 * Configured via SMTP_* environment variables.
 * Falls back to Ethereal test accounts if no SMTP config is provided.
 */

const nodemailer = require('nodemailer');

let transporter = null;

/**
 * Initializes the SMTP transporter from env vars.
 */
const initTransporter = async () => {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST) {
    const config = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    };

    // For port 587, use STARTTLS
    if (config.port === 587) {
      config.secure = false;
      config.requireTLS = true;
    }

    // Some institutional email servers need relaxed TLS
    config.tls = {
      rejectUnauthorized: false,
    };

    transporter = nodemailer.createTransport(config);

    // Verify connection
    try {
      await transporter.verify();
      console.log(`[EMAIL] ✅ SMTP connected: ${process.env.SMTP_HOST} as ${process.env.SMTP_USER}`);
    } catch (err) {
      console.error(`[EMAIL] ❌ SMTP connection failed: ${err.message}`);
      console.log(`[EMAIL] Falling back to Ethereal test account...`);
      transporter = null; // Reset to trigger fallback
    }
  }

  // Fallback to Ethereal
  if (!transporter) {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log(`[EMAIL] Using Ethereal test account: ${testAccount.user}`);
    console.log(`[EMAIL] View emails at: https://ethereal.email/login`);
    console.log(`[EMAIL]   User: ${testAccount.user}`);
    console.log(`[EMAIL]   Pass: ${testAccount.pass}`);
  }

  return transporter;
};

/**
 * Sends an email and returns result.
 */
const sendMail = async (mailOptions) => {
  const transport = await initTransporter();
  const fromAddr = process.env.SMTP_FROM || '"Amazon Clone" <noreply@amazon-clone.com>';

  const info = await transport.sendMail({
    from: fromAddr,
    ...mailOptions,
  });

  // For Ethereal, log preview
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`[EMAIL] Ethereal preview: ${previewUrl}`);
  } else {
    console.log(`[EMAIL] ✅ Email sent to ${mailOptions.to} (ID: ${info.messageId})`);
  }

  return { messageId: info.messageId, previewUrl: previewUrl || null };
};

/**
 * Sends OTP verification email.
 */
const sendOTPEmail = async (email, code, purpose) => {
  const purposeText = purpose === 'REGISTER' ? 'account creation' : 'sign-in';
  return sendMail({
    to: email,
    subject: `Your Amazon Clone OTP: ${code}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 16px; background: #131921; border-radius: 8px 8px 0 0;">
          <span style="color: white; font-size: 24px; font-weight: bold;">amazon</span>
          <span style="color: #f0c14b; font-size: 14px;">.clone</span>
        </div>
        <div style="padding: 24px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="margin: 0 0 16px; color: #232f3e;">Verify your ${purposeText}</h2>
          <p style="color: #333;">Hi! Your one-time password (OTP) for ${purposeText} is:</p>
          <div style="text-align: center; margin: 24px 0;">
            <span style="font-size: 40px; font-weight: bold; letter-spacing: 10px; background: #f3f3f3; padding: 14px 28px; border-radius: 8px; font-family: 'Courier New', monospace; color: #232f3e; border: 2px dashed #e47911;">${code}</span>
          </div>
          <p style="color: #666; font-size: 13px;">⏱ This OTP is valid for <strong>5 minutes</strong>.</p>
          <p style="color: #666; font-size: 13px;">🔒 Do not share this code with anyone. Amazon Clone will never ask for your OTP.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 11px;">If you didn't request this OTP, you can safely ignore this email.</p>
          <p style="color: #999; font-size: 11px;">© 2026 Amazon Clone. This is an automated email.</p>
        </div>
      </div>
    `,
  });
};

/**
 * Sends welcome email after successful registration.
 */
const sendWelcomeEmail = async (email, name) => {
  return sendMail({
    to: email,
    subject: `Welcome to Amazon Clone, ${name}! 🎉`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 16px; background: #131921; border-radius: 8px 8px 0 0;">
          <span style="color: white; font-size: 24px; font-weight: bold;">amazon</span>
          <span style="color: #f0c14b; font-size: 14px;">.clone</span>
        </div>
        <div style="padding: 24px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #232f3e;">Welcome, ${name}! 🎉</h2>
          <p style="color: #333;">Your Amazon Clone account has been created successfully. You're all set to start shopping!</p>
          <div style="background: #f7f7f7; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0; font-weight: 600; color: #232f3e;">What you can do now:</p>
            <ul style="color: #555; margin: 8px 0 0;">
              <li>🛒 Browse and search products across categories</li>
              <li>❤️ Add items to your wishlist</li>
              <li>🛍 Place orders with COD or card payment</li>
              <li>📦 Track your order history</li>
            </ul>
          </div>
          <div style="text-align: center; margin: 20px 0;">
            <a href="http://localhost:5173/" style="display: inline-block; padding: 12px 32px; background: linear-gradient(to bottom, #f7dfa5, #f0c14b); color: #111; text-decoration: none; border-radius: 20px; font-weight: 600; border: 1px solid #a88734;">Start Shopping</a>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 11px;">© 2026 Amazon Clone. All rights reserved.</p>
        </div>
      </div>
    `,
  });
};

/**
 * Sends sign-in notification email.
 */
const sendLoginNotification = async (email, name) => {
  const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  return sendMail({
    to: email,
    subject: `Amazon Clone: New sign-in detected`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 16px; background: #131921; border-radius: 8px 8px 0 0;">
          <span style="color: white; font-size: 24px; font-weight: bold;">amazon</span>
          <span style="color: #f0c14b; font-size: 14px;">.clone</span>
        </div>
        <div style="padding: 24px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #232f3e;">Hello, ${name} 👋</h2>
          <p style="color: #333;">A new sign-in to your Amazon Clone account was detected.</p>
          <div style="background: #f7f7f7; padding: 14px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0; color: #555;"><strong>🕐 Time:</strong> ${now}</p>
            <p style="margin: 8px 0 0; color: #555;"><strong>📧 Account:</strong> ${email}</p>
          </div>
          <p style="color: #666; font-size: 13px;">If this was you, no action is needed. If you didn't sign in, please change your password immediately.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 11px;">© 2026 Amazon Clone. This is a security notification.</p>
        </div>
      </div>
    `,
  });
};

/**
 * Sends order cancellation confirmation email.
 */
const sendOrderCancellationEmail = async (email, name, orderId) => {
  return sendMail({
    to: email,
    subject: `Amazon Clone: Order #${orderId.substring(0, 8)}... Cancelled`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; padding: 16px; background: #131921; border-radius: 8px 8px 0 0;">
          <span style="color: white; font-size: 24px; font-weight: bold;">amazon</span>
          <span style="color: #f0c14b; font-size: 14px;">.clone</span>
        </div>
        <div style="padding: 24px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px;">
          <div style="text-align: center; margin-bottom: 16px;">
            <span style="font-size: 48px;">❌</span>
          </div>
          <h2 style="color: #c40000; text-align: center;">Order Cancelled</h2>
          <p style="color: #333;">Hi ${name}, your order has been successfully cancelled.</p>
          <div style="background: #fff3f3; padding: 14px; border-radius: 8px; margin: 16px 0; border: 1px solid #ffd0d0;">
            <p style="margin: 0; color: #555;"><strong>Order ID:</strong> ${orderId}</p>
          </div>
          <p style="color: #666; font-size: 13px;">If you paid online, your refund will be processed within 5-7 business days.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 11px;">© 2026 Amazon Clone. All rights reserved.</p>
        </div>
      </div>
    `,
  });
};

module.exports = {
  sendOTPEmail,
  sendWelcomeEmail,
  sendLoginNotification,
  sendOrderCancellationEmail,
};
