import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

export async function POST(request: NextRequest) {
  try {
    const { name, email, department, newSupervisor } = await request.json();

    if (!name || !email || !department || !newSupervisor) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json({ success: true, message: 'Email configuration not available.' });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Important: Change in Your Position - Role Update',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Important Position Update</h2>
          <p>Dear ${name},</p>
          <p>We are writing to inform you of an important change regarding your position within the company.</p>
          
          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <h3 style="color: #dc2626; margin-top: 0;">Position Change Notice</h3>
            <p><strong>Previous Role:</strong> Supervisor</p>
            <p><strong>New Role:</strong> Employee</p>
            <p><strong>Department:</strong> ${department}</p>
            <p><strong>New Department Supervisor:</strong> ${newSupervisor}</p>
          </div>
          
          <p>This change is effective immediately. If you have any questions, please contact HR.</p>
          
          <p>Best regards,<br>HR Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending supervisor demotion email:', error);
    return NextResponse.json({ success: true, message: 'Email sending failed.' });
  }
}