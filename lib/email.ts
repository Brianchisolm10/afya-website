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

/**
 * Send order confirmation email with donation allocation details
 * @param email - Customer email address
 * @param name - Customer name
 * @param orderNumber - Order number
 * @param orderTotal - Total order amount
 * @param donationAmount - Amount allocated to donation (25%)
 * @param donationAllocation - Selected donation allocation
 * @param orderUrl - URL to view order details
 */
export async function sendOrderConfirmationEmail(
  email: string,
  name: string,
  orderNumber: string,
  orderTotal: number,
  donationAmount: number,
  donationAllocation: 'FOUNDATIONS' | 'SPONSOR_A_CLIENT',
  orderUrl: string
): Promise<void> {
  const allocationTitle = donationAllocation === 'FOUNDATIONS'
    ? 'Foundations & Donations'
    : 'Sponsor-A-Client Program';
  
  const allocationIcon = donationAllocation === 'FOUNDATIONS' ? '❤️' : '🤝';
  
  const allocationDescription = donationAllocation === 'FOUNDATIONS'
    ? 'Your contribution will support AFYA\'s general operations, community programs, and foundational initiatives that make movement accessible to everyone.'
    : 'Your contribution will directly fund wellness packets for clients in need, helping individuals access personalized health and fitness guidance.';
  
  const subject = `Order Confirmation - ${orderNumber}`;
  
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
          .impact-box { background: linear-gradient(135deg, rgba(64, 224, 208, 0.2), rgba(147, 112, 219, 0.2)); border: 2px solid #4FD1C5; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center; }
          .order-summary { background-color: white; border-radius: 10px; padding: 15px; margin: 15px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Order Confirmed!</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Thank you for your order! Your support helps AFYA make movement accessible to everyone.</p>
            
            <div class="order-summary">
              <p style="margin: 0; font-size: 14px; color: #666;">Order Number</p>
              <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #333;">${orderNumber}</p>
            </div>
            
            <div class="impact-box">
              <div style="font-size: 48px; margin-bottom: 10px;">${allocationIcon}</div>
              <h2 style="margin: 10px 0; color: #333;">Your Impact: ${allocationTitle}</h2>
              <p style="font-size: 32px; font-weight: bold; color: #4FD1C5; margin: 10px 0;">$${donationAmount.toFixed(2)}</p>
              <p style="margin: 10px 0; color: #555; font-size: 14px;">${allocationDescription}</p>
            </div>
            
            <div class="order-summary">
              <p style="margin: 0; font-size: 14px; color: #666;">Order Total</p>
              <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: bold; color: #333;">$${orderTotal.toFixed(2)}</p>
            </div>
            
            <p>You can view your complete order details, track shipping, and download your receipt anytime:</p>
            <p style="text-align: center;">
              <a href="${orderUrl}" class="button">View Order Details</a>
            </p>
            
            <p>We'll send you another email when your order ships.</p>
            
            <p>Thank you for being part of the AFYA community!</p>
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

Thank you for your order! Your support helps AFYA make movement accessible to everyone.

Order Number: ${orderNumber}

YOUR IMPACT: ${allocationTitle}
$${donationAmount.toFixed(2)}

${allocationDescription}

Order Total: $${orderTotal.toFixed(2)}

You can view your complete order details, track shipping, and download your receipt anytime:
${orderUrl}

We'll send you another email when your order ships.

Thank you for being part of the AFYA community!

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
 * Send gear drive donation confirmation email
 * @param email - Donor email address
 * @param name - Donor name
 * @param confirmationNumber - Unique confirmation number
 * @param itemTypes - Array of item types being donated
 * @param quantity - Estimated quantity of items
 * @param dropoffMethod - Selected dropoff method
 */
export async function sendGearDriveConfirmationEmail(
  email: string,
  name: string,
  confirmationNumber: string,
  itemTypes: string[],
  quantity: number,
  dropoffMethod: string
): Promise<void> {
  const methodDisplay = dropoffMethod === 'DROPOFF' 
    ? 'Drop-off' 
    : dropoffMethod === 'PICKUP' 
    ? 'Pickup' 
    : 'Shipping';
  
  const itemTypeLabels: Record<string, string> = {
    'shirts': 'Athletic Shirts & Tanks',
    'pants': 'Workout Pants & Leggings',
    'shorts': 'Athletic Shorts',
    'sports-bras': 'Sports Bras',
    'jackets': 'Athletic Jackets & Hoodies',
    'compression': 'Compression Wear',
    'socks': 'Athletic Socks',
    'bags': 'Gym Bags',
  };
  
  const itemsList = itemTypes.map(type => itemTypeLabels[type] || type).join(', ');
  
  const subject = `Gear Drive Donation Confirmed - ${confirmationNumber}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #40E0D0, #9370DB); color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { padding: 30px 20px; background-color: #f9f9f9; }
          .confirmation-box { background: linear-gradient(135deg, rgba(64, 224, 208, 0.1), rgba(147, 112, 219, 0.1)); border: 2px solid #40E0D0; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center; }
          .detail-box { background-color: white; border-radius: 10px; padding: 20px; margin: 15px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          .detail-row:last-child { border-bottom: none; }
          .label { font-weight: 600; color: #666; }
          .value { color: #333; }
          .next-steps { background-color: #E6FFFA; border-left: 4px solid #40E0D0; padding: 15px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .icon { font-size: 48px; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="icon">♻️</div>
            <h1 style="margin: 0;">Thank You for Your Donation!</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Thank you for donating to the AFYA Gear Drive! Your contribution helps us reduce textile waste while supporting our community programs.</p>
            
            <div class="confirmation-box">
              <p style="margin: 0; font-size: 14px; color: #666;">Confirmation Number</p>
              <p style="margin: 10px 0 0 0; font-size: 28px; font-weight: bold; color: #40E0D0;">${confirmationNumber}</p>
            </div>
            
            <div class="detail-box">
              <h3 style="margin-top: 0; color: #333;">Donation Details</h3>
              <div class="detail-row">
                <span class="label">Items:</span>
                <span class="value">${itemsList}</span>
              </div>
              <div class="detail-row">
                <span class="label">Quantity:</span>
                <span class="value">${quantity} items</span>
              </div>
              <div class="detail-row">
                <span class="label">Method:</span>
                <span class="value">${methodDisplay}</span>
              </div>
            </div>
            
            <div class="next-steps">
              <h3 style="margin-top: 0; color: #333;">What Happens Next?</h3>
              <ul style="margin: 10px 0; padding-left: 20px;">
                ${dropoffMethod === 'DROPOFF' 
                  ? '<li>We will send you drop-off location details within 24-48 hours</li><li>Please ensure items are clean and bagged</li><li>Bring your confirmation number when dropping off</li>'
                  : dropoffMethod === 'PICKUP'
                  ? '<li>We will contact you within 24-48 hours to schedule a pickup</li><li>Please have items bagged and ready at the specified address</li><li>Someone should be available during the pickup window</li>'
                  : '<li>We will send you shipping instructions within 24-48 hours</li><li>Please ensure items are securely packaged</li><li>Include your confirmation number in the package</li>'
                }
              </ul>
            </div>
            
            <h3 style="color: #333;">Your Impact</h3>
            <p>Your donated gear will be used in one of four ways:</p>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li><strong>Recycling:</strong> Items unsuitable for wear are sent to textile recycling facilities</li>
              <li><strong>Upcycling:</strong> Creative transformation into new products with local artists</li>
              <li><strong>Redistribution:</strong> Quality items provided to clients in need</li>
              <li><strong>Community Events:</strong> Supporting youth sports and fitness programs</li>
            </ul>
            
            <p>If you have any questions, please reply to this email or contact us at ${process.env.EMAIL_FROM}.</p>
            
            <p>Thank you for being part of the AFYA community!</p>
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

Thank you for donating to the AFYA Gear Drive! Your contribution helps us reduce textile waste while supporting our community programs.

CONFIRMATION NUMBER: ${confirmationNumber}

DONATION DETAILS:
- Items: ${itemsList}
- Quantity: ${quantity} items
- Method: ${methodDisplay}

WHAT HAPPENS NEXT?
${dropoffMethod === 'DROPOFF' 
  ? '- We will send you drop-off location details within 24-48 hours\n- Please ensure items are clean and bagged\n- Bring your confirmation number when dropping off'
  : dropoffMethod === 'PICKUP'
  ? '- We will contact you within 24-48 hours to schedule a pickup\n- Please have items bagged and ready at the specified address\n- Someone should be available during the pickup window'
  : '- We will send you shipping instructions within 24-48 hours\n- Please ensure items are securely packaged\n- Include your confirmation number in the package'
}

YOUR IMPACT:
Your donated gear will be used in one of four ways:
- Recycling: Items unsuitable for wear are sent to textile recycling facilities
- Upcycling: Creative transformation into new products with local artists
- Redistribution: Quality items provided to clients in need
- Community Events: Supporting youth sports and fitness programs

If you have any questions, please reply to this email or contact us at ${process.env.EMAIL_FROM}.

Thank you for being part of the AFYA community!

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
 * Send donation confirmation email with receipt
 * @param email - Donor email address
 * @param name - Donor name
 * @param amount - Donation amount
 * @param allocation - Selected donation allocation
 * @param receiptNumber - Unique receipt number
 * @param isRecurring - Whether donation is recurring
 */
export async function sendDonationConfirmationEmail(
  email: string,
  name: string,
  amount: number,
  allocation: 'FOUNDATIONS' | 'SPONSOR_A_CLIENT',
  receiptNumber: string,
  isRecurring: boolean = false
): Promise<void> {
  const allocationTitle = allocation === 'FOUNDATIONS'
    ? 'Foundations & Donations'
    : 'Sponsor-A-Client Program';
  
  const allocationIcon = allocation === 'FOUNDATIONS' ? '❤️' : '🤝';
  
  const allocationDescription = allocation === 'FOUNDATIONS'
    ? 'Your contribution will support AFYA\'s general operations, community programs, and foundational initiatives that make movement accessible to everyone.'
    : 'Your contribution will directly fund wellness packets for clients in need, helping individuals access personalized health and fitness guidance.';
  
  const subject = `Thank You for Your Donation - Receipt ${receiptNumber}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #40E0D0, #9370DB); color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { padding: 30px 20px; background-color: #f9f9f9; }
          .receipt-box { background-color: white; border-radius: 10px; padding: 20px; margin: 20px 0; }
          .receipt-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
          .receipt-row:last-child { border-bottom: none; }
          .label { color: #666; }
          .value { font-weight: 600; color: #333; }
          .amount { font-size: 32px; font-weight: bold; color: #40E0D0; text-align: center; margin: 20px 0; }
          .impact-box { background: linear-gradient(135deg, rgba(64, 224, 208, 0.1), rgba(147, 112, 219, 0.1)); border: 2px solid #40E0D0; border-radius: 10px; padding: 20px; margin: 20px 0; }
          .tax-box { background-color: #EFF6FF; border: 2px solid #3B82F6; border-radius: 10px; padding: 20px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .icon { font-size: 48px; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="icon">✅</div>
            <h1 style="margin: 0;">Thank You for Your Donation!</h1>
          </div>
          <div class="content">
            <p>Dear ${name},</p>
            <p>Thank you for your generous donation to AFYA! Your support helps us make movement accessible to everyone, regardless of their circumstances.</p>
            
            <div class="amount">$${amount.toFixed(2)}</div>
            
            <div class="receipt-box">
              <h3 style="margin-top: 0; color: #333;">Donation Receipt</h3>
              <div class="receipt-row">
                <span class="label">Receipt Number:</span>
                <span class="value">${receiptNumber}</span>
              </div>
              <div class="receipt-row">
                <span class="label">Date:</span>
                <span class="value">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div class="receipt-row">
                <span class="label">Donor:</span>
                <span class="value">${name}</span>
              </div>
              <div class="receipt-row">
                <span class="label">Amount:</span>
                <span class="value">$${amount.toFixed(2)}</span>
              </div>
              ${isRecurring ? `
              <div class="receipt-row">
                <span class="label">Type:</span>
                <span class="value">Monthly Recurring</span>
              </div>
              ` : ''}
            </div>
            
            <div class="impact-box">
              <div style="text-align: center; font-size: 36px; margin-bottom: 10px;">${allocationIcon}</div>
              <h3 style="margin: 10px 0; color: #333; text-align: center;">${allocationTitle}</h3>
              <p style="margin: 10px 0; color: #555; font-size: 14px; text-align: center;">${allocationDescription}</p>
            </div>
            
            <div class="tax-box">
              <h3 style="margin-top: 0; color: #333;">📄 Tax Deduction Information</h3>
              <p style="margin: 10px 0; font-size: 14px;">
                AFYA is a registered 501(c)(3) nonprofit organization. Your donation may be tax-deductible to the extent allowed by law.
              </p>
              <p style="margin: 10px 0; font-size: 14px;">
                <strong>Tax ID (EIN):</strong> XX-XXXXXXX
              </p>
              <p style="margin: 10px 0; font-size: 14px;">
                Please keep this email for your tax records. No goods or services were provided in exchange for this donation.
              </p>
            </div>
            
            <h3 style="color: #333;">What Happens Next?</h3>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Your contribution will be put to work immediately supporting our programs</li>
              <li>You'll receive updates on the impact your donation is making</li>
              ${isRecurring ? '<li>Your monthly donation will be processed automatically on this date each month</li>' : ''}
              <li>You can view your donation history anytime on our website</li>
            </ul>
            
            <p>Thank you for being part of the AFYA community and helping us make movement accessible to everyone!</p>
            
            <p>With gratitude,<br>The AFYA Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} AFYA. All rights reserved.</p>
            <p>If you have any questions, please contact us at ${process.env.EMAIL_FROM}</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Dear ${name},

Thank you for your generous donation to AFYA! Your support helps us make movement accessible to everyone, regardless of their circumstances.

DONATION RECEIPT
Receipt Number: ${receiptNumber}
Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
Donor: ${name}
Amount: $${amount.toFixed(2)}
${isRecurring ? 'Type: Monthly Recurring' : ''}

YOUR IMPACT: ${allocationTitle}
${allocationDescription}

TAX DEDUCTION INFORMATION
AFYA is a registered 501(c)(3) nonprofit organization. Your donation may be tax-deductible to the extent allowed by law.

Tax ID (EIN): XX-XXXXXXX

Please keep this email for your tax records. No goods or services were provided in exchange for this donation.

WHAT HAPPENS NEXT?
- Your contribution will be put to work immediately supporting our programs
- You'll receive updates on the impact your donation is making
${isRecurring ? '- Your monthly donation will be processed automatically on this date each month' : ''}
- You can view your donation history anytime on our website

Thank you for being part of the AFYA community and helping us make movement accessible to everyone!

With gratitude,
The AFYA Team

If you have any questions, please contact us at ${process.env.EMAIL_FROM}
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
 * Generic email sending function
 * @param options - Email options
 */
export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<void> {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    text: options.text || options.html.replace(/<[^>]*>/g, ''), // Strip HTML if no text provided
    html: options.html,
  });
}

/**
 * Send performance alert email
 * @param email - Recipient email address
 * @param alerts - Array of performance alerts
 */
export async function sendPerformanceAlertEmail(
  email: string,
  alerts: Array<{
    type: 'warning' | 'error';
    message: string;
    page: string;
    metric: string;
    value: number;
    threshold: number;
  }>
): Promise<void> {
  const subject = `⚠️ Performance Alert: ${alerts.length} Issue${alerts.length > 1 ? 's' : ''} Detected`;
  
  const alertRows = alerts.map(alert => `
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 12px;">
        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${alert.type === 'error' ? '#ef4444' : '#f59e0b'}; margin-right: 8px;"></span>
        ${alert.page}
      </td>
      <td style="padding: 12px;">${alert.metric.toUpperCase()}</td>
      <td style="padding: 12px;">${Math.round(alert.value)}${alert.metric === 'cls' ? '' : 'ms'}</td>
      <td style="padding: 12px;">${alert.threshold}${alert.metric === 'cls' ? '' : 'ms'}</td>
      <td style="padding: 12px;">
        <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; background-color: ${alert.type === 'error' ? '#fee2e2' : '#fef3c7'}; color: ${alert.type === 'error' ? '#991b1b' : '#92400e'};">
          ${alert.type === 'error' ? 'Critical' : 'Warning'}
        </span>
      </td>
    </tr>
  `).join('');
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { background-color: #ef4444; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 20px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-top: none; }
          .alert-table { width: 100%; border-collapse: collapse; background-color: white; margin: 20px 0; }
          .alert-table th { background-color: #f3f4f6; padding: 12px; text-align: left; font-weight: 600; border-bottom: 2px solid #e5e7eb; }
          .button { display: inline-block; padding: 12px 24px; background-color: #8b5cf6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Performance Alert</h1>
            <p style="margin: 0; font-size: 16px;">${alerts.length} performance issue${alerts.length > 1 ? 's' : ''} detected on your website</p>
          </div>
          <div class="content">
            <p>The following performance issues have been detected:</p>
            
            <table class="alert-table">
              <thead>
                <tr>
                  <th>Page</th>
                  <th>Metric</th>
                  <th>Current Value</th>
                  <th>Threshold</th>
                  <th>Severity</th>
                </tr>
              </thead>
              <tbody>
                ${alertRows}
              </tbody>
            </table>
            
            <p><strong>Recommended Actions:</strong></p>
            <ul>
              <li>Review the performance dashboard for detailed metrics</li>
              <li>Check for recent deployments that may have caused regressions</li>
              <li>Analyze page-specific issues using the performance monitoring tools</li>
              <li>Consider implementing optimizations for affected pages</li>
            </ul>
            
            <p style="text-align: center;">
              <a href="${process.env.NEXTAUTH_URL}/admin/performance" class="button">View Performance Dashboard</a>
            </p>
          </div>
          <div class="footer">
            <p>This is an automated alert from the AFYA Performance Monitoring System.</p>
            <p>To adjust alert thresholds or notification settings, visit the admin dashboard.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject,
    html,
  });
}
