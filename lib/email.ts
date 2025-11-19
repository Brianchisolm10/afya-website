import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

/**
 * Send team member invitation email
 * @param email - Recipient email address
 * @param name - Recipient name
 * @param role - User role (COACH or ADMIN)
 * @param setupUrl - Account setup URL with token
 */
export async function sendInvitationEmail(
  email: string,
  name: string,
  role: string,
  setupUrl: string
): Promise<void> {
  const subject = "You've been invited to join AFYA";
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4FD1C5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background-color: #4FD1C5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to AFYA</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>You've been invited to join the AFYA team as a <strong>${role}</strong>.</p>
            <p>To set up your account, click the button below:</p>
            <p style="text-align: center;">
              <a href="${setupUrl}" class="button">Set Up Your Account</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #4FD1C5;">${setupUrl}</p>
            <p><strong>This link will expire in 72 hours.</strong></p>
            <p>If you have any questions, please contact your administrator.</p>
            <p>Welcome to AFYA!</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} AFYA. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Hi ${name},

You've been invited to join the AFYA team as a ${role}.

To set up your account, visit this link:
${setupUrl}

This link will expire in 72 hours.

If you have any questions, please contact your administrator.

Welcome to AFYA!
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject,
    text,
    html,
  });
}

/**
 * Send role changed notification email
 * @param email - Recipient email address
 * @param name - Recipient name
 * @param newRole - New role assigned
 */
export async function sendRoleChangedEmail(
  email: string,
  name: string,
  newRole: string
): Promise<void> {
  const subject = 'Your AFYA account role has been updated';
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4FD1C5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Role Update</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Your role in the AFYA system has been changed to <strong>${newRole}</strong>.</p>
            <p>You may need to log in again to access your new permissions.</p>
            <p>If you have questions about this change, please contact your administrator.</p>
            <p>- AFYA Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} AFYA. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Hi ${name},

Your role in the AFYA system has been changed to ${newRole}.

You may need to log in again to access your new permissions.

If you have questions about this change, please contact your administrator.

- AFYA Team
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject,
    text,
    html,
  });
}

/**
 * Send account status notification email
 * @param email - Recipient email address
 * @param name - Recipient name
 * @param status - New account status
 */
export async function sendAccountStatusEmail(
  email: string,
  name: string,
  status: 'SUSPENDED' | 'ACTIVE'
): Promise<void> {
  const isSuspended = status === 'SUSPENDED';
  const subject = isSuspended 
    ? 'Your AFYA account has been suspended'
    : 'Your AFYA account has been reactivated';
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: ${isSuspended ? '#EF4444' : '#10B981'}; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${isSuspended ? 'Account Suspended' : 'Account Reactivated'}</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            ${isSuspended 
              ? '<p>Your AFYA account has been suspended.</p><p>If you believe this is an error, please contact your administrator.</p>'
              : '<p>Your AFYA account has been reactivated. You can now log in and access the system.</p>'
            }
            <p>- AFYA Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} AFYA. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Hi ${name},

${isSuspended 
  ? 'Your AFYA account has been suspended.\n\nIf you believe this is an error, please contact your administrator.'
  : 'Your AFYA account has been reactivated. You can now log in and access the system.'
}

- AFYA Team
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject,
    text,
    html,
  });
}

/**
 * Send password reset email
 * @param email - Recipient email address
 * @param name - Recipient name
 * @param resetUrl - Password reset URL with token
 */
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetUrl: string
): Promise<void> {
  const subject = 'Reset your AFYA password';
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4FD1C5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background-color: #4FD1C5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>We received a request to reset your password for your AFYA account.</p>
            <p>Click the button below to reset your password:</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #4FD1C5;">${resetUrl}</p>
            <p><strong>This link will expire in 1 hour.</strong></p>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p>- AFYA Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} AFYA. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Hi ${name},

We received a request to reset your password for your AFYA account.

Click the link below to reset your password:
${resetUrl}

This link will expire in 1 hour.

If you didn't request this, you can safely ignore this email.

- AFYA Team
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject,
    text,
    html,
  });
}

/**
 * Send password changed confirmation email
 * @param email - Recipient email address
 * @param name - Recipient name
 */
export async function sendPasswordChangedEmail(
  email: string,
  name: string
): Promise<void> {
  const subject = 'Your AFYA password was changed';
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4FD1C5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Changed</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Your password for your AFYA account was successfully changed.</p>
            <p>If you didn't make this change, please contact your administrator immediately.</p>
            <p>- AFYA Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} AFYA. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Hi ${name},

Your password for your AFYA account was successfully changed.

If you didn't make this change, please contact your administrator immediately.

- AFYA Team
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject,
    text,
    html,
  });
}

/**
 * Send packet generation failure notification to admins
 * @param adminEmails - Array of admin email addresses
 * @param packetId - Failed packet ID
 * @param clientName - Client name
 * @param clientEmail - Client email
 * @param packetType - Type of packet that failed
 * @param errorMessage - Error message
 * @param retryCount - Number of retry attempts
 * @param adminPanelUrl - URL to admin panel for manual intervention
 */
export async function sendPacketFailureNotification(
  adminEmails: string[],
  packetId: string,
  clientName: string,
  clientEmail: string,
  packetType: string,
  errorMessage: string,
  retryCount: number,
  adminPanelUrl: string
): Promise<void> {
  const subject = `⚠️ Packet Generation Failed - ${packetType} for ${clientName}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #EF4444; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .info-box { background-color: #FEF2F2; border-left: 4px solid #EF4444; padding: 15px; margin: 15px 0; }
          .button { display: inline-block; padding: 12px 24px; background-color: #4FD1C5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .detail-row { margin: 8px 0; }
          .label { font-weight: bold; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Packet Generation Failed</h1>
          </div>
          <div class="content">
            <p>A packet generation has failed after ${retryCount} retry attempts and requires manual intervention.</p>
            
            <div class="info-box">
              <h3 style="margin-top: 0;">Failure Details</h3>
              <div class="detail-row">
                <span class="label">Packet ID:</span> ${packetId}
              </div>
              <div class="detail-row">
                <span class="label">Packet Type:</span> ${packetType}
              </div>
              <div class="detail-row">
                <span class="label">Client:</span> ${clientName} (${clientEmail})
              </div>
              <div class="detail-row">
                <span class="label">Retry Attempts:</span> ${retryCount}
              </div>
              <div class="detail-row">
                <span class="label">Error:</span> ${errorMessage}
              </div>
            </div>
            
            <p><strong>Action Required:</strong></p>
            <ul>
              <li>Review the error details above</li>
              <li>Check the client's intake data for completeness</li>
              <li>Verify the packet template is configured correctly</li>
              <li>Manually regenerate the packet or contact the client</li>
            </ul>
            
            <p style="text-align: center;">
              <a href="${adminPanelUrl}" class="button">Go to Admin Panel</a>
            </p>
            
            <p style="font-size: 12px; color: #666;">
              This is an automated notification from the AFYA packet generation system.
            </p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} AFYA. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
⚠️ PACKET GENERATION FAILED

A packet generation has failed after ${retryCount} retry attempts and requires manual intervention.

FAILURE DETAILS:
- Packet ID: ${packetId}
- Packet Type: ${packetType}
- Client: ${clientName} (${clientEmail})
- Retry Attempts: ${retryCount}
- Error: ${errorMessage}

ACTION REQUIRED:
- Review the error details above
- Check the client's intake data for completeness
- Verify the packet template is configured correctly
- Manually regenerate the packet or contact the client

Admin Panel: ${adminPanelUrl}

This is an automated notification from the AFYA packet generation system.
  `;

  // Send to all admin emails
  for (const adminEmail of adminEmails) {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: adminEmail,
        subject,
        text,
        html,
      });
    } catch (error) {
      console.error(`Failed to send notification to admin ${adminEmail}:`, error);
    }
  }
}

/**
 * Send welcome email to new client with account setup instructions
 * @param email - Recipient email address
 * @param name - Recipient name
 * @param setupUrl - Account setup URL with token
 */
export async function sendClientWelcomeEmail(
  email: string,
  name: string,
  setupUrl: string
): Promise<void> {
  const subject = 'Welcome to AFYA - Set Up Your Account';
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4FD1C5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background-color: #4FD1C5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to AFYA!</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Thank you for completing your intake form! We're excited to help you on your fitness journey.</p>
            <p>Your personalized account has been created. To access your dashboard and start tracking your progress, please set up your password by clicking the button below:</p>
            <p style="text-align: center;">
              <a href="${setupUrl}" class="button">Set Up Your Account</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #4FD1C5;">${setupUrl}</p>
            <p><strong>This link will expire in 72 hours.</strong></p>
            <p>Once you've set up your account, you'll be able to:</p>
            <ul>
              <li>Access your personalized dashboard</li>
              <li>View your training programs</li>
              <li>Track your progress</li>
              <li>Communicate with your coach</li>
            </ul>
            <p>If you have any questions, feel free to reach out to us.</p>
            <p>Welcome aboard!</p>
            <p>- The AFYA Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} AFYA. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Hi ${name},

Thank you for completing your intake form! We're excited to help you on your fitness journey.

Your personalized account has been created. To access your dashboard and start tracking your progress, please set up your password by visiting this link:

${setupUrl}

This link will expire in 72 hours.

Once you've set up your account, you'll be able to:
- Access your personalized dashboard
- View your training programs
- Track your progress
- Communicate with your coach

If you have any questions, feel free to reach out to us.

Welcome aboard!

- The AFYA Team
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject,
    text,
    html,
  });
}

/**
 * Send packet ready notification email
 * @param email - Recipient email address
 * @param name - Recipient name
 * @param packetType - Type of packet that is ready
 * @param dashboardUrl - URL to client dashboard
 */
export async function sendPacketReadyEmail(
  email: string,
  name: string,
  packetType: string,
  dashboardUrl: string
): Promise<void> {
  const packetTypeDisplay = formatPacketType(packetType);
  const subject = `Your ${packetTypeDisplay} is Ready! 🎉`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4FD1C5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background-color: #4FD1C5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .highlight-box { background-color: #E6FFFA; border-left: 4px solid #4FD1C5; padding: 15px; margin: 15px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Your ${packetTypeDisplay} is Ready!</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Great news! Your personalized <strong>${packetTypeDisplay}</strong> has been generated and is ready for you to view.</p>
            
            <div class="highlight-box">
              <p style="margin: 0;"><strong>What's inside:</strong></p>
              <p style="margin: 5px 0 0 0;">${getPacketDescription(packetType)}</p>
            </div>
            
            <p>Click the button below to access your dashboard and view your ${packetTypeDisplay.toLowerCase()}:</p>
            <p style="text-align: center;">
              <a href="${dashboardUrl}" class="button">View My ${packetTypeDisplay}</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #4FD1C5;">${dashboardUrl}</p>
            
            <p>You can view, download, and print your ${packetTypeDisplay.toLowerCase()} anytime from your dashboard.</p>
            
            <p>If you have any questions about your plan, don't hesitate to reach out to your coach.</p>
            
            <p>Let's get started!</p>
            <p>- The AFYA Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} AFYA. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Hi ${name},

Great news! Your personalized ${packetTypeDisplay} has been generated and is ready for you to view.

What's inside:
${getPacketDescription(packetType)}

Click the link below to access your dashboard and view your ${packetTypeDisplay.toLowerCase()}:
${dashboardUrl}

You can view, download, and print your ${packetTypeDisplay.toLowerCase()} anytime from your dashboard.

If you have any questions about your plan, don't hesitate to reach out to your coach.

Let's get started!

- The AFYA Team
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject,
    text,
    html,
  });
}

/**
 * Send packet updated notification email
 * @param email - Recipient email address
 * @param name - Recipient name
 * @param packetType - Type of packet that was updated
 * @param dashboardUrl - URL to client dashboard
 */
export async function sendPacketUpdatedEmail(
  email: string,
  name: string,
  packetType: string,
  dashboardUrl: string
): Promise<void> {
  const packetTypeDisplay = formatPacketType(packetType);
  const subject = `Your ${packetTypeDisplay} Has Been Updated`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4FD1C5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background-color: #4FD1C5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📝 ${packetTypeDisplay} Updated</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Your <strong>${packetTypeDisplay}</strong> has been updated with new information.</p>
            <p>Click the button below to view the latest version:</p>
            <p style="text-align: center;">
              <a href="${dashboardUrl}" class="button">View Updated ${packetTypeDisplay}</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #4FD1C5;">${dashboardUrl}</p>
            <p>If you have any questions about the changes, please contact your coach.</p>
            <p>- The AFYA Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} AFYA. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Hi ${name},

Your ${packetTypeDisplay} has been updated with new information.

Click the link below to view the latest version:
${dashboardUrl}

If you have any questions about the changes, please contact your coach.

- The AFYA Team
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject,
    text,
    html,
  });
}

/**
 * Helper function to format packet type for display
 */
function formatPacketType(packetType: string): string {
  const typeMap: Record<string, string> = {
    'INTRO': 'Introduction Packet',
    'NUTRITION': 'Nutrition Plan',
    'WORKOUT': 'Workout Program',
    'PERFORMANCE': 'Performance Program',
    'YOUTH': 'Youth Program',
    'RECOVERY': 'Recovery Plan',
    'WELLNESS': 'Wellness Plan'
  };
  return typeMap[packetType] || packetType;
}

/**
 * Helper function to get packet description
 */
function getPacketDescription(packetType: string): string {
  const descriptionMap: Record<string, string> = {
    'INTRO': 'An introduction to your personalized program and how to get started.',
    'NUTRITION': 'Your personalized nutrition plan with meal recommendations, macros, and shopping lists.',
    'WORKOUT': 'Your customized workout program with exercises, sets, reps, and progression plans.',
    'PERFORMANCE': 'Your sport-specific performance program with periodized training blocks.',
    'YOUTH': 'Your age-appropriate training program with safety guidelines and parent resources.',
    'RECOVERY': 'Your recovery plan with safe movements and progressive loading strategies.',
    'WELLNESS': 'Your wellness plan with practical guidance for improving your overall health.'
  };
  return descriptionMap[packetType] || 'Your personalized program details.';
}
