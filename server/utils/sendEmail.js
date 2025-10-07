import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendResetEmail = async (to, subject, html) => {
  try {
    await resend.emails.send({
      from: 'Hanapark <no-reply@hanapark.online>', 
      to,
      subject,
      html,
    });
    console.log('Email sent successfully to:', to);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Email sending failed');
  }
};

export default sendResetEmail;
