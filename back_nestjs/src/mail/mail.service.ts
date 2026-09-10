import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  async sendOtpEmail(
    email: string,
    otp: string,
  ) {
    await this.transporter.sendMail({
      from: `"Nest App" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Password Reset</h2>

          <p>Your OTP code is:</p>

          <h1>${otp}</h1>

          <p>
            This code will expire in 10 minutes.
          </p>

          <p>
            If you did not request a password reset,
            please ignore this email.
          </p>
        </div>
      `,
    });
  }

 async sendContactEmail(
  name: string,
  email: string,
  phone: string | undefined,
  subject: string,
  message: string,
) {
  await this.transporter.sendMail({
    from: `"Project Management System" <${process.env.MAIL_USER}>`,
    to: process.env.MAIL_USER,
    replyTo: email,
    subject: `Contact Form: ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: auto; padding: 24px;">
        <h2 style="color: #4f46e5;">New Contact Message</h2>

        <h3>Contact Information</h3>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject}</p>

        <h3>Message</h3>

        <div style="
          background: #f9fafb;
          border-left: 4px solid #4f46e5;
          padding: 16px;
          white-space: pre-wrap;
        ">
          ${message}
        </div>
      </div>
    `,
  });
}
}