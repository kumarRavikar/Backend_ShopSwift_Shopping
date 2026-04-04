import nodemailer from "nodemailer";
import "dotenv/config";

const verifyEmail = async (token, email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, // use app password
      },
    });

    const verificationLink = `https://shopswiftshoppingmernstack.vercel.app/verify/${token}`;

    const mailConfig = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Email Verification",
      html: `
        <h2>Email Verification</h2>
        <p>Click the link below to verify your account:</p>
        <a href="${verificationLink}">Verify Email</a>
      `,
    };

    await transporter.sendMail(mailConfig);

    console.log("Verification email sent successfully");
  } catch (error) {
    console.log("Email sending failed:", error.message);
  }
};

export default verifyEmail;