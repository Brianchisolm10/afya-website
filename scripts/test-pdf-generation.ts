/**
 * Test script for PDF generation
 * 
 * Usage: npm run test-pdf
 */

import { PDFExportService } from '../lib/intake/pdf-export-service';
import { PopulatedContent } from '../types/intake';

async function testPDFGeneration() {
  console.log('Testing PDF generation...\n');

  // Sample packet content
  const sampleContent: PopulatedContent = {
    overview: {
      title: 'Your Personalized Nutrition Plan',
      description: 'This plan has been created specifically for your goals and preferences.',
      goals: ['Lose weight', 'Build muscle', 'Improve energy'],
    },
    calorieBreakdown: {
      bmr: 1800,
      tdee: 2400,
      targetCalories: 1900,
      adjustment: -500,
      explanation: 'To support fat loss, we\'ve created a 500 calorie deficit.',
    },
    macroDetails: {
      protein: {
        grams: 150,
        calories: 600,
        percentage: 32,
        explanation: 'Protein supports muscle maintenance and recovery.',
      },
      carbs: {
        grams: 180,
        calories: 720,
        percentage: 38,
        explanation: 'Carbohydrates fuel your training and daily activities.',
      },
      fats: {
        grams: 64,
        calories: 580,
        percentage: 30,
        explanation: 'Fats support hormone production and overall health.',
      },
    },
    mealTiming: {
      mealsPerDay: 4,
      schedule: [
        {
          meal: 'Breakfast',
          time: '7:00-8:00 AM',
          focus: 'Protein and carbs to start the day',
          examples: 'Oatmeal with protein powder, eggs with toast',
        },
        {
          meal: 'Lunch',
          time: '12:00-1:00 PM',
          focus: 'Balanced meal',
          examples: 'Chicken salad with quinoa, turkey wrap',
        },
        {
          meal: 'Pre-Workout Snack',
          time: '4:00-5:00 PM',
          focus: 'Carbs for energy',
          examples: 'Banana, rice cakes with honey',
        },
        {
          meal: 'Dinner',
          time: '7:00-8:00 PM',
          focus: 'Protein and vegetables',
          examples: 'Salmon with vegetables, chicken with salad',
        },
      ],
    },
    sampleMeals: {
      breakfast: [
        'Greek yogurt parfait with berries and granola',
        'Scrambled eggs with whole grain toast and avocado',
        'Protein oatmeal with banana and almond butter',
      ],
      lunch: [
        'Grilled chicken salad with mixed greens and quinoa',
        'Turkey and avocado wrap with side salad',
        'Chicken breast with brown rice and steamed broccoli',
      ],
      dinner: [
        'Baked salmon with roasted sweet potato and asparagus',
        'Lean ground turkey stir-fry with mixed vegetables',
        'Grilled chicken breast with quinoa and Brussels sprouts',
      ],
    },
    shoppingList: {
      proteins: [
        'Chicken breast',
        'Salmon fillets',
        'Greek yogurt',
        'Eggs',
        'Protein powder',
      ],
      carbs: [
        'Brown rice',
        'Quinoa',
        'Sweet potatoes',
        'Oats',
        'Whole grain bread',
      ],
      fats: [
        'Avocados',
        'Almonds',
        'Almond butter',
        'Olive oil',
        'Chia seeds',
      ],
      vegetables: [
        'Spinach',
        'Broccoli',
        'Bell peppers',
        'Carrots',
        'Asparagus',
      ],
    },
    adherenceTips: [
      'Track your intake for the first 2 weeks to learn portion sizes',
      'Meal prep on Sundays to make healthy eating convenient',
      'Keep healthy snacks readily available',
      'Stay hydrated - aim for 8-10 glasses of water daily',
      'Allow flexibility for social occasions (80/20 rule)',
    ],
    metadata: {
      packetType: 'NUTRITION',
      generatedAt: new Date().toISOString(),
      version: '1.0',
    },
  };

  try {
    // Generate PDF
    const pdfUrl = await PDFExportService.generatePDF(
      'test-packet-id',
      sampleContent,
      'John Doe',
      'NUTRITION',
      {
        title: 'Nutrition Plan - John Doe',
        author: 'Afya Performance',
        subject: 'Personalized Nutrition Plan',
        keywords: ['nutrition', 'fitness', 'health'],
      }
    );

    console.log('✓ PDF generated successfully!');
    console.log(`  PDF URL: ${pdfUrl}`);
    console.log(`  File location: public${pdfUrl}`);
    console.log('\nYou can view the PDF by:');
    console.log('1. Starting the dev server: npm run dev');
    console.log(`2. Opening: http://localhost:3000${pdfUrl}`);

  } catch (error) {
    console.error('✗ PDF generation failed:', error);
    process.exit(1);
  }
}

// Run test
testPDFGeneration();
