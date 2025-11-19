/**
 * Nutrition Packet Generation Logic
 * 
 * Implements detailed nutrition calculations and meal planning
 * based on client goals, activity level, and preferences.
 */

import { PopulatedContent, TemplateContext } from '@/types/intake';

export class NutritionGenerator {
  /**
   * Enhance nutrition packet with detailed calculations and meal plans
   */
  static enhanceNutritionContent(
    content: PopulatedContent,
    client: any,
    context: TemplateContext
  ): PopulatedContent {
    const enhanced = { ...content };
    
    // Add detailed calorie calculations
    enhanced.calorieBreakdown = this.generateCalorieBreakdown(client, context);
    
    // Add detailed macro calculations
    enhanced.macroDetails = this.generateMacroDetails(client, context);
    
    // Add meal timing recommendations
    enhanced.mealTiming = this.generateMealTiming(client, context);
    
    // Add sample meal plans
    enhanced.sampleMeals = this.generateSampleMeals(client, context);
    
    // Add shopping list
    enhanced.shoppingList = this.generateShoppingList(client, context);
    
    // Add adherence tips
    enhanced.adherenceTips = this.generateAdherenceTips(client, context);
    
    return enhanced;
  }
  
  /**
   * Generate detailed calorie breakdown with explanation
   */
  private static generateCalorieBreakdown(client: any, context: TemplateContext): any {
    const calculated = context.calculated;
    const dailyCalories = calculated.dailyCalories || 2000;
    
    // Calculate TDEE components
    const bmr = this.calculateBMR(client);
    const activityMultiplier = this.getActivityMultiplier(client.activityLevel);
    const tdee = Math.round(bmr * activityMultiplier);
    
    // Adjust for goals
    let targetCalories = tdee;
    let adjustment = 0;
    
    const goal = (client.goal || client.mainFitnessGoals || '').toLowerCase();
    
    if (goal.includes('lose') || goal.includes('fat loss') || goal.includes('weight loss')) {
      adjustment = -500; // 500 calorie deficit
      targetCalories = tdee - 500;
    } else if (goal.includes('gain') || goal.includes('muscle') || goal.includes('bulk')) {
      adjustment = 300; // 300 calorie surplus
      targetCalories = tdee + 300;
    }
    
    return {
      bmr: Math.round(bmr),
      tdee: tdee,
      adjustment: adjustment,
      targetCalories: Math.round(targetCalories),
      explanation: this.getCalorieExplanation(goal, adjustment)
    };
  }
  
  /**
   * Calculate Basal Metabolic Rate using Mifflin-St Jeor equation
   */
  private static calculateBMR(client: any): number {
    const weight = client.weightLbs || 150;
    const height = client.heightInches || 66;
    const age = client.dateOfBirth 
      ? new Date().getFullYear() - new Date(client.dateOfBirth).getFullYear()
      : 30;
    const gender = (client.gender || 'male').toLowerCase();
    
    // Convert to metric
    const weightKg = weight * 0.453592;
    const heightCm = height * 2.54;
    
    // Mifflin-St Jeor equation
    if (gender === 'female') {
      return (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
    } else {
      return (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
    }
  }
  
  /**
   * Get activity multiplier for TDEE calculation
   */
  private static getActivityMultiplier(activityLevel?: string): number {
    const level = (activityLevel || 'moderately-active').toLowerCase();
    
    if (level.includes('sedentary') || level.includes('little')) {
      return 1.2;
    } else if (level.includes('lightly') || level.includes('light')) {
      return 1.375;
    } else if (level.includes('moderately') || level.includes('moderate')) {
      return 1.55;
    } else if (level.includes('very') || level.includes('heavy')) {
      return 1.725;
    } else if (level.includes('extra') || level.includes('athlete')) {
      return 1.9;
    }
    
    return 1.55; // Default to moderate
  }
  
  /**
   * Get explanation for calorie adjustment
   */
  private static getCalorieExplanation(goal: string, adjustment: number): string {
    if (adjustment < 0) {
      return `To support fat loss, we've created a ${Math.abs(adjustment)} calorie deficit. This allows for sustainable weight loss of approximately 1 lb per week while maintaining energy for daily activities and training.`;
    } else if (adjustment > 0) {
      return `To support muscle gain, we've created a ${adjustment} calorie surplus. This provides extra energy for muscle growth while minimizing excess fat gain.`;
    } else {
      return `Your calories are set at maintenance level to support your current weight and performance goals.`;
    }
  }
  
  /**
   * Generate detailed macro breakdown
   */
  private static generateMacroDetails(client: any, context: TemplateContext): any {
    const calculated = context.calculated;
    const macros = calculated.macros || [];
    
    // Get target calories
    const targetCalories = calculated.dailyCalories || 2000;
    const weight = client.weightLbs || 150;
    
    // Calculate protein (0.8-1.2g per lb bodyweight depending on goal)
    const goal = (client.goal || '').toLowerCase();
    let proteinPerLb = 1.0;
    
    if (goal.includes('muscle') || goal.includes('gain') || goal.includes('athlete')) {
      proteinPerLb = 1.2;
    } else if (goal.includes('lose') || goal.includes('fat loss')) {
      proteinPerLb = 1.0;
    } else {
      proteinPerLb = 0.8;
    }
    
    const proteinGrams = Math.round(weight * proteinPerLb);
    const proteinCalories = proteinGrams * 4;
    
    // Calculate fats (25-30% of calories)
    const fatPercentage = 0.28;
    const fatCalories = Math.round(targetCalories * fatPercentage);
    const fatGrams = Math.round(fatCalories / 9);
    
    // Calculate carbs (remaining calories)
    const carbCalories = targetCalories - proteinCalories - fatCalories;
    const carbGrams = Math.round(carbCalories / 4);
    
    return {
      protein: {
        grams: proteinGrams,
        calories: proteinCalories,
        percentage: Math.round((proteinCalories / targetCalories) * 100),
        perMeal: Math.round(proteinGrams / (client.mealsPerDay || 3)),
        explanation: `Protein supports muscle maintenance and recovery. Aim for ${Math.round(proteinGrams / (client.mealsPerDay || 3))}g per meal.`
      },
      carbs: {
        grams: carbGrams,
        calories: carbCalories,
        percentage: Math.round((carbCalories / targetCalories) * 100),
        explanation: `Carbohydrates fuel your training and daily activities. Focus intake around workout times.`
      },
      fats: {
        grams: fatGrams,
        calories: fatCalories,
        percentage: Math.round((fatCalories / targetCalories) * 100),
        explanation: `Fats support hormone production and overall health. Include healthy sources like avocado, nuts, and olive oil.`
      },
      totalCalories: targetCalories
    };
  }
  
  /**
   * Generate meal timing recommendations
   */
  private static generateMealTiming(client: any, context: TemplateContext): any {
    const mealsPerDay = client.mealsPerDay || 3;
    const workoutTime = client.preferredWorkoutTime || 'morning';
    const daysPerWeek = client.daysPerWeek || 3;
    
    const timing: any = {
      mealsPerDay,
      schedule: []
    };
    
    // Generate meal schedule based on workout time
    if (workoutTime.toLowerCase().includes('morning') || workoutTime.toLowerCase().includes('early')) {
      timing.schedule = [
        {
          meal: 'Pre-Workout Snack',
          time: '6:00-7:00 AM',
          focus: 'Light carbs and protein',
          examples: 'Banana with peanut butter, Greek yogurt'
        },
        {
          meal: 'Post-Workout Breakfast',
          time: '8:00-9:00 AM',
          focus: 'Protein and carbs for recovery',
          examples: 'Eggs with toast and fruit, protein smoothie with oats'
        },
        {
          meal: 'Lunch',
          time: '12:00-1:00 PM',
          focus: 'Balanced meal with protein, carbs, and vegetables',
          examples: 'Chicken with rice and vegetables, turkey sandwich with salad'
        },
        {
          meal: 'Afternoon Snack',
          time: '3:00-4:00 PM',
          focus: 'Protein and healthy fats',
          examples: 'Nuts and fruit, protein bar, cottage cheese'
        },
        {
          meal: 'Dinner',
          time: '6:00-7:00 PM',
          focus: 'Protein and vegetables',
          examples: 'Salmon with roasted vegetables, lean beef stir-fry'
        }
      ];
    } else if (workoutTime.toLowerCase().includes('evening') || workoutTime.toLowerCase().includes('night')) {
      timing.schedule = [
        {
          meal: 'Breakfast',
          time: '7:00-8:00 AM',
          focus: 'Protein and carbs to start the day',
          examples: 'Oatmeal with protein powder, eggs with toast'
        },
        {
          meal: 'Mid-Morning Snack',
          time: '10:00-11:00 AM',
          focus: 'Light protein and fruit',
          examples: 'Greek yogurt with berries, protein shake'
        },
        {
          meal: 'Lunch',
          time: '12:00-1:00 PM',
          focus: 'Balanced meal',
          examples: 'Chicken salad with quinoa, turkey wrap'
        },
        {
          meal: 'Pre-Workout Snack',
          time: '4:00-5:00 PM',
          focus: 'Carbs for energy',
          examples: 'Banana, rice cakes with honey, energy bar'
        },
        {
          meal: 'Post-Workout Dinner',
          time: '7:00-8:00 PM',
          focus: 'Protein and carbs for recovery',
          examples: 'Chicken with sweet potato, salmon with rice'
        }
      ];
    } else {
      // Midday or flexible
      timing.schedule = [
        {
          meal: 'Breakfast',
          time: '7:00-8:00 AM',
          focus: 'Protein and carbs',
          examples: 'Eggs with toast, protein pancakes'
        },
        {
          meal: 'Pre-Workout Snack',
          time: '11:00 AM',
          focus: 'Light carbs',
          examples: 'Fruit, granola bar'
        },
        {
          meal: 'Post-Workout Lunch',
          time: '1:00-2:00 PM',
          focus: 'Protein and carbs for recovery',
          examples: 'Chicken with rice, protein bowl'
        },
        {
          meal: 'Afternoon Snack',
          time: '4:00-5:00 PM',
          focus: 'Protein and healthy fats',
          examples: 'Nuts, cheese and crackers'
        },
        {
          meal: 'Dinner',
          time: '7:00-8:00 PM',
          focus: 'Protein and vegetables',
          examples: 'Fish with vegetables, lean meat with salad'
        }
      ];
    }
    
    timing.recommendations = [
      'Eat protein with every meal to support muscle maintenance',
      'Time your largest carb portions around training sessions',
      'Stay consistent with meal timing to regulate hunger and energy',
      'Adjust portions based on hunger and energy levels'
    ];
    
    return timing;
  }
  
  /**
   * Generate sample meal plans
   */
  private static generateSampleMeals(client: any, context: TemplateContext): any {
    const dietType = (client.dietType || 'no restrictions').toLowerCase();
    const allergies = (client.foodAllergies || 'none').toLowerCase();
    const avoid = (client.foodsToAvoid || 'none').toLowerCase();
    const cultural = (client.culturalDietaryNeeds || 'none').toLowerCase();
    
    // Base meal options
    const meals = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: []
    };
    
    // Breakfast options
    meals.breakfast = [
      'Greek yogurt parfait with berries, granola, and honey',
      'Scrambled eggs with whole grain toast and avocado',
      'Protein oatmeal with banana and almond butter',
      'Smoothie bowl with protein powder, fruit, and nuts',
      'Egg white omelet with vegetables and cheese'
    ];
    
    // Lunch options
    meals.lunch = [
      'Grilled chicken salad with mixed greens, quinoa, and balsamic dressing',
      'Turkey and avocado wrap with side salad',
      'Chicken breast with brown rice and steamed broccoli',
      'Tuna salad on whole grain bread with fruit',
      'Burrito bowl with lean protein, beans, rice, and vegetables'
    ];
    
    // Dinner options
    meals.dinner = [
      'Baked salmon with roasted sweet potato and asparagus',
      'Lean ground turkey stir-fry with mixed vegetables and brown rice',
      'Grilled chicken breast with quinoa and roasted Brussels sprouts',
      'Lean beef with baked potato and green beans',
      'Shrimp and vegetable skewers with wild rice'
    ];
    
    // Snack options
    meals.snacks = [
      'Protein shake with banana',
      'Apple slices with almond butter',
      'Cottage cheese with berries',
      'Hard-boiled eggs',
      'Mixed nuts and dried fruit',
      'Protein bar',
      'Carrots and hummus',
      'Greek yogurt'
    ];
    
    // Filter based on dietary restrictions
    if (dietType.includes('vegetarian') || !client.eatsAnimalProducts) {
      meals.breakfast = meals.breakfast.filter(m => !m.includes('egg'));
      meals.lunch = meals.lunch.filter(m => !m.includes('chicken') && !m.includes('turkey') && !m.includes('tuna'));
      meals.dinner = meals.dinner.filter(m => !m.includes('salmon') && !m.includes('turkey') && !m.includes('chicken') && !m.includes('beef') && !m.includes('shrimp'));
      meals.snacks = meals.snacks.filter(m => !m.includes('egg'));
      
      // Add vegetarian alternatives
      meals.lunch.push('Chickpea salad with mixed greens and tahini dressing');
      meals.lunch.push('Black bean burger with sweet potato fries');
      meals.dinner.push('Lentil curry with brown rice');
      meals.dinner.push('Tofu stir-fry with vegetables and quinoa');
    }
    
    if (dietType.includes('vegan')) {
      meals.breakfast = meals.breakfast.filter(m => !m.includes('yogurt') && !m.includes('egg') && !m.includes('honey') && !m.includes('cheese'));
      meals.snacks = meals.snacks.filter(m => !m.includes('yogurt') && !m.includes('cottage cheese') && !m.includes('egg'));
      
      // Add vegan alternatives
      meals.breakfast.push('Overnight oats with plant-based protein and berries');
      meals.breakfast.push('Tofu scramble with vegetables and whole grain toast');
    }
    
    return {
      meals,
      note: `All meals can be adjusted based on your preferences. Avoid: ${avoid}. Allergies: ${allergies}.`
    };
  }
  
  /**
   * Generate shopping list
   */
  private static generateShoppingList(client: any, context: TemplateContext): any {
    const dietType = (client.dietType || 'no restrictions').toLowerCase();
    const isVegetarian = dietType.includes('vegetarian') || !client.eatsAnimalProducts;
    const isVegan = dietType.includes('vegan');
    
    const list: any = {
      proteins: [],
      carbs: [],
      fats: [],
      vegetables: [],
      fruits: [],
      pantry: []
    };
    
    // Proteins
    if (!isVegetarian) {
      list.proteins = [
        'Chicken breast',
        'Lean ground turkey',
        'Salmon fillets',
        'Tuna (canned)',
        'Lean ground beef (93/7)',
        'Shrimp',
        'Eggs',
        'Greek yogurt',
        'Cottage cheese',
        'Protein powder (whey or plant-based)'
      ];
    } else if (!isVegan) {
      list.proteins = [
        'Eggs',
        'Greek yogurt',
        'Cottage cheese',
        'Tofu',
        'Tempeh',
        'Lentils',
        'Chickpeas',
        'Black beans',
        'Protein powder (plant-based)'
      ];
    } else {
      list.proteins = [
        'Tofu',
        'Tempeh',
        'Lentils',
        'Chickpeas',
        'Black beans',
        'Quinoa',
        'Edamame',
        'Protein powder (plant-based)',
        'Nutritional yeast'
      ];
    }
    
    // Carbohydrates
    list.carbs = [
      'Brown rice',
      'Quinoa',
      'Sweet potatoes',
      'Oats (rolled or steel-cut)',
      'Whole grain bread',
      'Whole wheat pasta',
      'White rice (for post-workout)',
      'Potatoes'
    ];
    
    // Healthy fats
    list.fats = [
      'Avocados',
      'Almonds',
      'Walnuts',
      'Almond butter',
      'Peanut butter',
      'Olive oil',
      'Coconut oil',
      'Chia seeds',
      'Flax seeds'
    ];
    
    // Vegetables
    list.vegetables = [
      'Spinach',
      'Broccoli',
      'Bell peppers',
      'Carrots',
      'Tomatoes',
      'Cucumbers',
      'Mixed salad greens',
      'Asparagus',
      'Brussels sprouts',
      'Green beans',
      'Cauliflower',
      'Zucchini'
    ];
    
    // Fruits
    list.fruits = [
      'Bananas',
      'Apples',
      'Berries (strawberries, blueberries)',
      'Oranges',
      'Grapes',
      'Melon'
    ];
    
    // Pantry staples
    list.pantry = [
      'Spices (garlic powder, onion powder, paprika, cumin)',
      'Herbs (basil, oregano, thyme)',
      'Low-sodium soy sauce',
      'Balsamic vinegar',
      'Apple cider vinegar',
      'Honey or maple syrup',
      'Canned beans',
      'Canned tomatoes',
      'Vegetable or chicken broth'
    ];
    
    return list;
  }
  
  /**
   * Generate adherence tips
   */
  private static generateAdherenceTips(client: any, context: TemplateContext): string[] {
    const struggle = (client.biggestStruggle || '').toLowerCase();
    
    const tips = [
      'Track your intake for the first 2 weeks to learn portion sizes',
      'Meal prep on Sundays to make healthy eating convenient',
      'Keep healthy snacks readily available',
      'Stay hydrated - aim for 8-10 glasses of water daily',
      'Allow flexibility for social occasions (80/20 rule)',
      'Focus on whole foods but don\'t fear processed foods in moderation',
      'Eat slowly and mindfully to improve satiety',
      'Adjust portions based on hunger and energy levels'
    ];
    
    // Add specific tips based on struggles
    if (struggle.includes('time') || struggle.includes('busy')) {
      tips.push('Batch cook proteins and grains on weekends');
      tips.push('Use simple recipes with 5 ingredients or less');
      tips.push('Keep emergency healthy options on hand (protein bars, frozen meals)');
    }
    
    if (struggle.includes('consistency') || struggle.includes('motivation')) {
      tips.push('Start with small, achievable changes');
      tips.push('Track your progress with photos and measurements');
      tips.push('Find an accountability partner or coach');
    }
    
    if (struggle.includes('cravings') || struggle.includes('hunger')) {
      tips.push('Increase protein and fiber intake');
      tips.push('Drink water before reaching for snacks');
      tips.push('Allow yourself planned treats to prevent binge eating');
    }
    
    return tips;
  }
}
