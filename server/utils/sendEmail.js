
import nodemailer from 'nodemailer';

export const sendResetEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GOOGLE_EMAIL, 
      pass: process.env.GOOGLE_APP_PASSWORD, 
    },
  });

  await transporter.sendMail({
    from: `"HanaPark" <${process.env.GOOGLE_EMAIL}>`,
    to,
    subject,
    html,
  });
};

export default sendResetEmail;