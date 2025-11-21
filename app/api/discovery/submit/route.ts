import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { discoveryFormSchema } from '@/lib/discovery/validation';
import { sendEmail } from '@/lib/email';

// Discovery form submission handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate form data
    const validatedData = discoveryFormSchema.parse(body);
    
    // Get client IP and user agent for tracking
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Create lead record
    const lead = await prisma.lead.create({
      data: {
        fullName: validatedData.fullName,
        email: validatedData.email.toLowerCase(),
        phone: validatedData.phone,
        primaryGoal: validatedData.primaryGoal,
        goalDescription: validatedData.goalDescription,
        startTimeframe: validatedData.startTimeframe,
        referralSource: validatedData.referralSource,
        ipAddress,
        userAgent,
        status: 'PENDING_CALL',
      },
    });
    
    // Send confirmation email to user
    try {
      await sendEmail({
        to: lead.email,
        subject: 'Welcome to AFYA - Next Steps',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #40E0D0;">Welcome to AFYA, ${lead.fullName}!</h1>
            
            <p>Thank you for taking the first step toward your wellness journey. We're excited to learn more about you!</p>
            
            <h2>What's Next?</h2>
            <p>The next step is to schedule a brief discovery call with our team. This is a no-pressure conversation where we'll:</p>
            <ul>
              <li>Learn more about your goals and current situation</li>
              <li>Answer any questions you have about AFYA</li>
              <li>Recommend the best program for your needs</li>
              <li>Discuss next steps if you'd like to move forward</li>
            </ul>
            
            <p style="margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/book-call?lead=${lead.id}" 
                 style="background-color: #40E0D0; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                Schedule Your Discovery Call
              </a>
            </p>
            
            <p>If you have any questions in the meantime, feel free to reply to this email.</p>
            
            <p>Looking forward to connecting with you!</p>
            
            <p style="margin-top: 40px; color: #666; font-size: 14px;">
              The AFYA Team<br>
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}" style="color: #40E0D0;">afya-wellness.com</a>
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the request if email fails
    }
    
    // Send notification email to admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@afya-wellness.com';
      await sendEmail({
        to: adminEmail,
        subject: `New Lead: ${lead.fullName}`,
        html: `
          <div style="font-family: Arial, sans-serif;">
            <h2>New Discovery Form Submission</h2>
            
            <p><strong>Name:</strong> ${lead.fullName}</p>
            <p><strong>Email:</strong> ${lead.email}</p>
            <p><strong>Phone:</strong> ${lead.phone}</p>
            <p><strong>Primary Goal:</strong> ${lead.primaryGoal}</p>
            <p><strong>Start Timeframe:</strong> ${lead.startTimeframe}</p>
            ${lead.goalDescription ? `<p><strong>Description:</strong> ${lead.goalDescription}</p>` : ''}
            ${lead.referralSource ? `<p><strong>Referral Source:</strong> ${lead.referralSource}</p>` : ''}
            
            <p style="margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/leads/${lead.id}" 
                 style="background-color: #40E0D0; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                View Lead in Admin
              </a>
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError);
      // Don't fail the request if email fails
    }
    
    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: 'Thank you! Please schedule your discovery call.',
    });
    
  } catch (error: any) {
    console.error('Discovery form submission error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.errors },
        { status: 400 }
      );
    }
    
    // Check for duplicate email
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return NextResponse.json(
        { error: 'This email is already registered. Please log in or use a different email.' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to submit form. Please try again.' },
      { status: 500 }
    );
  }
}
