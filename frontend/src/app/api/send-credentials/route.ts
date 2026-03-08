import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { name, email, username, password, supervisor, accountType, department, jobTitle } = await request.json();

    if (!name || !email || !username || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if email configuration is available
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email configuration not found. Skipping email send.');
      return NextResponse.json({ success: true, message: 'Employee created successfully. Email configuration not available.' });
    }

    const { sendCredentialsEmail } = await import('@/lib/services/system/emailService');
    await sendCredentialsEmail({ name, email, username, password, supervisor, accountType, department, jobTitle });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ success: true, message: 'Employee created successfully. Email sending failed.' });
  }
}