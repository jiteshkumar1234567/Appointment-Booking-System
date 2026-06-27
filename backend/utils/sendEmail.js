import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

const sendEmail = async ({ to, subject, html, text = "" }) => {
  try {
    // Verify SMTP connection
    await transporter.verify();
    console.log("✅ Gmail SMTP Connected");

    const info = await transporter.sendMail({
      from: `"MediCare+" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Email Sent:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("❌ EMAIL ERROR:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};

export default sendEmail;