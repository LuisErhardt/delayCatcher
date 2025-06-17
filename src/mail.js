import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export default async function sendMail(message, receiver) {
  try {
    const transporter = nodemailer.createTransport({
      host: "mail.gmx.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: `"Delay" <${process.env.EMAIL_USER}>`,
      to: receiver,
      subject: message.subject,
      text: message.text, // plain‑text body
      html: `<b>${message.text}</b>`, // HTML body
    });

    console.log("Mail sent! Message:", message, "Receiver:", receiver);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
