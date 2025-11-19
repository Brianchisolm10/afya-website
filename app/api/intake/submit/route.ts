import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import {
  isValidEmail,
  isNonEmptyString,
  ValidationError,
  handlePrismaError,
  formatErrorResponse,
  getErrorStatusCode,
  logError,
} from '@/lib/utils';
import { generateToken, hashToken } from '@/lib/tokens';
import { sendClientWelcomeEmail } from '@/lib/email';

interface IntakeRequestBody {
  // Basic Information
  fullName: string;
  email: string;
  gender?: string;
  dateOfBirth?: string;
  heightInches?: string;
  weightLbs?: string;
  
  // Activity & Goals
  activityLevel?: string;
  dailyMovementPattern?: string;
  mainFitnessGoals?: string;
  trainingExperience?: string;
  trainingHistory?: string;
  
  // Training Preferences
  daysPerWeek?: string;
  sessionDuration?: string;
  preferredWorkoutTime?: string;
  availableEquipment?: string;
  workoutLocation?: string;
  trainingStyle?: string;
  coachingStyle?: string;
  
  // Motivation & Challenges
  motivation?: string;
  biggestStruggle?: string;
  
  // Health & Medical
  injuries?: string;
  medicalConditions?: string;
  medications?: string;
  painOrDiscomfort?: string;
  
  // Nutrition
  dietType?: string;
  foodAllergies?: string;
  foodsToAvoid?: string;
  eatsBreakfast?: string;
  eatsAnimalProducts?: string;
  mealsPerDay?: string;
  beverageConsumption?: string;
  waterIntakeOz?: string;
  typicalDayEating?: string;
  favoriteMeals?: string;
  preferredMacros?: string;
  fastingPattern?: string;
  culturalDietaryNeeds?: string;
  
  // Program Delivery
  deliveryPreference?: string;
  wantsWeeklyCheckins?: string;
  
  // Sport-Specific (Optional)
  sportsPlayed?: string;
  schoolGrade?: string;
  eatsBeforePractice?: string;
  staysHydrated?: string;
  seasonMotivation?: string;
  seasonChallenges?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: IntakeRequestBody = await request.json();

    // Server-side validation
    if (!isNonEmptyString(body.fullName)) {
      throw new ValidationError('Full name is required', 'fullName');
    }

    if (!isNonEmptyString(body.email)) {
      throw new ValidationError('Email is required', 'email');
    }

    if (!isValidEmail(body.email)) {
      throw new ValidationError('Invalid email format', 'email');
    }

    // Helper function to parse optional numeric values
    const parseOptionalInt = (value?: string): number | undefined => {
      if (!value || value.trim() === '') return undefined;
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? undefined : parsed;
    };

    const parseOptionalFloat = (value?: string): number | undefined => {
      if (!value || value.trim() === '') return undefined;
      const parsed = parseFloat(value);
      return isNaN(parsed) ? undefined : parsed;
    };

    const parseOptionalBoolean = (value?: string): boolean | undefined => {
      if (!value || value.trim() === '') return undefined;
      return value === 'yes';
    };

    const parseOptionalDate = (value?: string): Date | undefined => {
      if (!value || value.trim() === '') return undefined;
      const date = new Date(value);
      return isNaN(date.getTime()) ? undefined : date;
    };

    // Generate setup token for account activation
    const plainToken = generateToken();
    const hashedToken = hashToken(plainToken);
    const tokenExpiresAt = new Date();
    tokenExpiresAt.setHours(tokenExpiresAt.getHours() + 72); // 72 hours expiration

    // Create User and Client in a transaction
    const result = await prisma.$transaction(async (tx: any) => {
      // Create User with CLIENT role (no password yet)
      const user = await tx.user.create({
        data: {
          email: body.email.toLowerCase().trim(),
          name: body.fullName.trim(),
          role: 'CLIENT',
          status: 'ACTIVE', // Set to ACTIVE, but user needs to set password
        },
      });

      // Create account setup token
      const inviteToken = await tx.inviteToken.create({
        data: {
          userId: user.id,
          token: hashedToken,
          type: 'ACCOUNT_SETUP',
          expiresAt: tokenExpiresAt,
        },
      });

      // Create Client record with all fields
      const client = await tx.client.create({
        data: {
          userId: user.id,
          fullName: body.fullName.trim(),
          email: body.email.toLowerCase().trim(),
          goal: body.mainFitnessGoals || undefined,
          
          // Basic Information
          gender: body.gender || undefined,
          dateOfBirth: parseOptionalDate(body.dateOfBirth),
          heightInches: parseOptionalInt(body.heightInches),
          weightLbs: parseOptionalFloat(body.weightLbs),
          
          // Activity & Goals
          activityLevel: body.activityLevel || undefined,
          dailyMovementPattern: body.dailyMovementPattern || undefined,
          mainFitnessGoals: body.mainFitnessGoals || undefined,
          trainingExperience: body.trainingExperience || undefined,
          trainingHistory: body.trainingHistory || undefined,
          
          // Training Preferences
          daysPerWeek: parseOptionalInt(body.daysPerWeek),
          sessionDuration: parseOptionalInt(body.sessionDuration?.split('-')[0]),
          preferredWorkoutTime: body.preferredWorkoutTime || undefined,
          availableEquipment: body.availableEquipment || undefined,
          workoutLocation: body.workoutLocation || undefined,
          trainingStyle: body.trainingStyle || undefined,
          coachingStyle: body.coachingStyle || undefined,
          
          // Motivation & Challenges
          motivation: body.motivation || undefined,
          biggestStruggle: body.biggestStruggle || undefined,
          
          // Health & Medical
          injuries: body.injuries || undefined,
          medicalConditions: body.medicalConditions || undefined,
          medications: body.medications || undefined,
          painOrDiscomfort: body.painOrDiscomfort || undefined,
          
          // Nutrition
          dietType: body.dietType || undefined,
          foodAllergies: body.foodAllergies || undefined,
          foodsToAvoid: body.foodsToAvoid || undefined,
          eatsBreakfast: parseOptionalBoolean(body.eatsBreakfast),
          eatsAnimalProducts: parseOptionalBoolean(body.eatsAnimalProducts),
          mealsPerDay: parseOptionalInt(body.mealsPerDay?.split('-')[0]),
          beverageConsumption: body.beverageConsumption || undefined,
          waterIntakeOz: parseOptionalInt(body.waterIntakeOz),
          typicalDayEating: body.typicalDayEating || undefined,
          favoriteMeals: body.favoriteMeals || undefined,
          preferredMacros: body.preferredMacros || undefined,
          fastingPattern: body.fastingPattern || undefined,
          culturalDietaryNeeds: body.culturalDietaryNeeds || undefined,
          
          // Program Delivery
          deliveryPreference: body.deliveryPreference || undefined,
          wantsWeeklyCheckins: body.wantsWeeklyCheckins === 'yes',
          
          // Sport-Specific (Optional)
          sportsPlayed: body.sportsPlayed || undefined,
          schoolGrade: body.schoolGrade || undefined,
          eatsBeforePractice: parseOptionalBoolean(body.eatsBeforePractice),
          staysHydrated: parseOptionalBoolean(body.staysHydrated),
          seasonMotivation: body.seasonMotivation || undefined,
          seasonChallenges: body.seasonChallenges || undefined,
        },
      });

      // Create INTRO Packet with PENDING status
      const packet = await tx.packet.create({
        data: {
          clientId: client.id,
          type: 'INTRO',
          status: 'PENDING',
        },
      });

      return { user, client, packet, plainToken };
    });

    // Send welcome email with account setup link
    const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const setupUrl = `${appUrl}/setup/${result.plainToken}`;
    
    try {
      await sendClientWelcomeEmail(
        result.client.email,
        result.client.fullName,
        setupUrl
      );
    } catch (emailError) {
      // Log email error but don't fail the request
      logError(emailError as Error, {
        context: 'Failed to send welcome email',
        userId: result.user.id,
        email: result.client.email,
      });
    }

    // Return success response
    return NextResponse.json({
      success: true,
      client: {
        id: result.client.id,
        fullName: result.client.fullName,
        email: result.client.email,
      },
      packets: [
        {
          id: result.packet.id,
          type: result.packet.type,
          status: result.packet.status,
        },
      ],
    });
  } catch (error: any) {
    // Log error with context
    logError(error, {
      endpoint: '/api/intake/submit',
      email: error?.email || 'unknown',
    });

    // Handle Prisma errors
    if (error?.code?.startsWith('P')) {
      const prismaError = handlePrismaError(error);
      return NextResponse.json(
        formatErrorResponse(prismaError),
        { status: getErrorStatusCode(prismaError) }
      );
    }

    // Handle custom errors
    if (error instanceof ValidationError) {
      return NextResponse.json(
        formatErrorResponse(error),
        { status: getErrorStatusCode(error) }
      );
    }

    // Generic error response
    return NextResponse.json(
      formatErrorResponse(new Error('Failed to process intake form')),
      { status: 500 }
    );
  }
}
