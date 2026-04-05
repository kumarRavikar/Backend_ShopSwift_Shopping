
import "dotenv/config";
import {Resend} from "resend";
const resend = new Resend(process.env.RESEND_API)
const verifyEmail = async (token, email) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false,
//       auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASS,
//       },
//     });
//      await transporter.verify();
//      console.log("SMTP is working");
//     const verificationLink = `https://shopswiftshoppingmernstack.vercel.app/verify/${token}`;

//     const mailConfig = {
//       from: process.env.MAIL_USER,
//       to: email,
//       subject: "Email Verification",
//       html: `
//         <h2>Email Verification</h2>
//         <p>Click the link below to verify your account:</p>
//         <a href="${verificationLink}">Verify Email</a>
//       `,
//     };

//     await transporter.sendMail(mailConfig);
//         console.log("RENDER MAIL:", process.env.MAIL_USER);
// console.log("RENDER PASS:", process.env.MAIL_PASS ? "YES" : "NO");
//     console.log("Verification email sent successfully");
//   } catch (error) {
//     console.log("Email sending failed:", error.message);
//   }
try {
    const verificationLink = `https://shopswiftshoppingmernstack.vercel.app/#/verify/${token}`;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Email Verification",
      html: `
        <h2>Email Verification</h2>
        <p>Click below:</p>
        <a href="${verificationLink}">Verify Email</a>
      `,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.log("Email failed:", error);
  }
};

export default verifyEmail;
