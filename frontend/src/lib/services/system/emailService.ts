import nodemailer from 'nodemailer';
import {EmailCredentials} from "../../types/services"

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

export const sendCredentialsEmail = async ({ name, email, username, password, accountType, department, jobTitle, supervisor }: EmailCredentials) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to the Company - Your Login Credentials',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to Our Company!</h2>
        <p>Dear ${name},</p>
        <p>Welcome to our team! Your account has been created successfully. Below are your login credentials:</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Username:</strong> ${username}</p>
          <p><strong>Password:</strong> ${password}</p>
        </div>
        
        <div style="background-color: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
          <h3 style="color: #2563eb; margin-top: 0;">Your Position Details</h3>
          <p><strong>Account Type:</strong> ${accountType}</p>
          <p><strong>Department:</strong> ${department}</p>
          <p><strong>Job Title:</strong> ${jobTitle}</p>
          ${supervisor ? `<p><strong>Supervisor:</strong> ${supervisor}</p>` : ''}
        </div>
        
        <p>Please keep these credentials secure and change your password after your first login.</p>
        <p>You can access the system at: <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}">${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}</a></p>
        
        <p>If you have any questions, please don't hesitate to contact the HR department.</p>
        
        <p>Best regards,<br>HR Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendUpdatedInfoEmail = async ({ name, email, username, accountType, department, jobTitle, supervisor }: Omit<EmailCredentials, 'password'>) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Account Information Updated - Important Notice',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Account Information Updated</h2>
        <p>Dear ${name},</p>
        <p>Your account information has been updated by the administration. Please review the changes below:</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2563eb; margin-top: 0;">Updated Login Information</h3>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Username:</strong> ${username}</p>
          <p><em>Note: Your password remains unchanged</em></p>
        </div>
        
        <div style="background-color: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
          <h3 style="color: #2563eb; margin-top: 0;">Your Current Position Details</h3>
          <p><strong>Account Type:</strong> ${accountType}</p>
          <p><strong>Department:</strong> ${department}</p>
          <p><strong>Job Title:</strong> ${jobTitle}</p>
          ${supervisor ? `<p><strong>Supervisor:</strong> ${supervisor}</p>` : ''}
        </div>
        
        <p>If you have any questions about these changes or need assistance accessing your account, please contact the HR department immediately.</p>
        <p>You can access the system at: <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}">${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}</a></p>
        
        <p>Best regards,<br>HR Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};