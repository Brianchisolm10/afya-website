import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Validation schema
const gearDriveSubmissionSchema = z.object({
  donorName: z.string().min(1, 'Donor name is required'),
  donorEmail: z.string().email('Invalid email address'),
  donorPhone: z.string().optional(),
  itemTypes: z.array(z.string()).min(1, 'At least one item type is required'),
  estimatedQuantity: z.number().int().min(1, 'Quantity must be at least 1'),
  condition: z.enum(['EXCELLENT', 'GOOD', 'FAIR', 'WORN']),
  dropoffMethod: z.enum(['DROPOFF', 'PICKUP', 'SHIPPING']),
  preferredDate: z.string().optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
  }).optional(),
  notes: z.string().optional(),
});

/**
 * POST /api/impact/gear-drive
 * Submit a gear drive donation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = gearDriveSubmissionSchema.parse(body);

    // Validate address is provided for pickup
    if (validatedData.dropoffMethod === 'PICKUP' && !validatedData.address) {
      return NextResponse.json(
        { error: 'Address is required for pickup method' },
        { status: 400 }
      );
    }

    // Create submission in database
    const submission = await prisma.gearDriveSubmission.create({
      data: {
        donorName: validatedData.donorName,
        donorEmail: validatedData.donorEmail,
        donorPhone: validatedData.donorPhone || null,
        itemTypes: JSON.stringify(validatedData.itemTypes),
        estimatedQuantity: validatedData.estimatedQuantity,
        condition: validatedData.condition,
        dropoffMethod: validatedData.dropoffMethod,
        preferredDate: validatedData.preferredDate ? new Date(validatedData.preferredDate) : null,
        address: validatedData.address ? JSON.stringify(validatedData.address) : null,
        notes: validatedData.notes || null,
        status: 'PENDING',
      },
    });

    // Generate confirmation number (e.g., GD-20231119-ABC123)
    const confirmationNumber = `GD-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${submission.id.slice(-6).toUpperCase()}`;

    // Send confirmation email
    try {
      await sendGearDriveConfirmationEmail(
        validatedData.donorEmail,
        validatedData.donorName,
        confirmationNumber,
        validatedData.itemTypes,
        validatedData.estimatedQuantity,
        validatedData.dropoffMethod
      );
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    // Update community stats
    try {
      await updateCommunityGearStats(validatedData.estimatedQuantity);
    } catch (statsError) {
      console.error('Failed to update community stats:', statsError);
      // Don't fail the request if stats update fails
    }

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      confirmationNumber,
      message: 'Thank you for your donation! We will contact you soon with next steps.',
    });
  } catch (error) {
    console.error('Gear drive submission error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid submission data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to submit gear drive donation. Please try again.' },
      { status: 500 }
    );
  }
}

/**
 * Send confirmation email to donor
 */
async function sendGearDriveConfirmationEmail(
  email: string,
  name: string,
  confirmationNumber: string,
  itemTypes: string[],
  quantity: number,
  dropoffMethod: string
): Promise<void> {
  // Import email service
  const { sendGearDriveConfirmationEmail: sendEmail } = await import('@/lib/email');
  
  await sendEmail(
    email,
    name,
    confirmationNumber,
    itemTypes,
    quantity,
    dropoffMethod
  );
}

/**
 * Update community stats with new gear donation
 */
async function updateCommunityGearStats(quantity: number): Promise<void> {
  // Get or create community stats record
  let stats = await prisma.communityStats.findFirst();

  if (!stats) {
    stats = await prisma.communityStats.create({
      data: {
        totalMinutesMoved: 0,
        totalClientsServed: 0,
        totalDonationsRaised: 0,
        totalGearDonated: 0,
      },
    });
  }

  // Update gear donated count
  await prisma.communityStats.update({
    where: { id: stats.id },
    data: {
      totalGearDonated: {
        increment: quantity,
      },
      lastUpdated: new Date(),
    },
  });
}
