const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Email service is not configured");
    }

    console.log("Creating transporter...");

    const transporter = process.env.EMAIL_HOST
      ? nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: Number(process.env.EMAIL_PORT || 587),
          secure:
            String(process.env.EMAIL_SECURE).toLowerCase() === "true",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        })
      : nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

    console.log("Sending email to:", to);

    const info = await transporter.sendMail({
      from: `"AI Shop" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully:", info.messageId);

    return info;
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    throw error;
  }
};

module.exports = sendEmail;