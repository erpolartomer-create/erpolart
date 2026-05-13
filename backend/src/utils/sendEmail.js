import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  // If API key is not defined, just log to console for development
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_your_api_key_here') {
    console.warn('\n--- [EMAIL LOG (DEVELOPMENT - RESEND MISSING)] ---');
    console.warn(`TO: ${options.email}`);
    console.warn(`SUBJECT: ${options.subject}`);
    console.warn(`MESSAGE: ${options.message || 'HTML Content'}`);
    console.warn('--- [/EMAIL LOG] ---\n');
    return { mock: true, id: 'mock-id' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      html: options.html || `<p>${options.message}</p>`,
    });

    if (error) {
      console.error('RESEND ERROR:', error);
      throw error;
    }

    console.log('Message sent via Resend: %s', data.id);
    return data;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

export default sendEmail;
