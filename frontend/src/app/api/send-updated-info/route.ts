import { NextRequest, NextResponse } from 'next/server';
import { sendUpdatedInfoEmail } from '@/lib/services/system/emailService';

export async function POST(request: NextRequest) {
  try {
    const { name, email, username, accountType, department, jobTitle, supervisor } = await request.json();

    if (!name || !email || !username) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email configuration not found. Skipping email send.');
      return NextResponse.json({ success: true, message: 'Employee updated successfully. Email configuration not available.' });
    }

    await sendUpdatedInfoEmail({ name, email, username, accountType, department, jobTitle, supervisor });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ success: true, message: 'Employee updated successfully. Email sending failed.' });
  }
}