const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    await transporter.sendMail({
      from: `"InternHub" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: '🎉 Welcome to InternHub!',
      html: `
        <div style="max-width:600px;margin:40px auto;font-family:Arial,sans-serif;">
          <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:40px;text-align:center;border-radius:16px 16px 0 0;">
            <h1 style="color:#fff;margin:0;">Welcome to InternHub! 💼</h1>
            <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;">Your dream internship journey starts now 🚀</p>
          </div>
          <div style="background:#fff;padding:40px;border:1px solid #e2e8f0;">
            <h2 style="color:#1e293b;">Hi ${userName}! 👋</h2>
            <p style="color:#64748b;line-height:1.7;">
              Thank you for joining <strong style="color:#667eea;">InternHub</strong> — India's smartest internship-finding platform!
            </p>
            <div style="background:#f8fafc;border-radius:12px;padding:20px;margin:20px 0;">
              <p style="margin:8px 0;color:#475569;">🔍 <strong>Search</strong> thousands of real internships across India</p>
              <p style="margin:8px 0;color:#475569;">🤖 <strong>Use InternBot</strong> to find internships with smart filters</p>
              <p style="margin:8px 0;color:#475569;">🔖 <strong>Save internships</strong> you are interested in</p>
              <p style="margin:8px 0;color:#475569;">👤 <strong>Build your profile</strong> with skills and experience</p>
            </div>
            <div style="text-align:center;margin:28px 0;">
              <a href="http://localhost:3000/internships"
                style="background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:16px;font-weight:600;">
                Browse Internships Now 🚀
              </a>
            </div>
            <p style="color:#64748b;">Best of luck! 🌟<br><strong style="color:#667eea;">The InternHub Team</strong></p>
          </div>
          <div style="background:#f8fafc;padding:20px;text-align:center;border-radius:0 0 16px 16px;border:1px solid #e2e8f0;border-top:none;">
            <p style="color:#94a3b8;font-size:12px;margin:0;">© 2024 InternHub. All rights reserved.</p>
          </div>
        </div>
      `
    });
    console.log('Welcome email sent to:', userEmail);
  } catch (error) {
    console.error('Email error:', error.message);
  }
};

module.exports = { sendWelcomeEmail };