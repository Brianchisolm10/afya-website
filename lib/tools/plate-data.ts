export type GoalType = 'energy' | 'performance' | 'recovery';
export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface PlateSection {
  label: string;
  percentage: number;
  color: string;
  description: string;
}

export interface MealExample {
  name: string;
  dietaryNote?: string;
}

export interface PlateConfiguration {
  sections: PlateSection[];
  examples: MealExample[];
  explanation: string;
}

// Color palette for food groups
const COLORS = {
  vegetables: '#10b981', // green
  protein: '#f59e0b', // amber
  carbs: '#8b5cf6', // purple
  fats: '#ec4899', // pink
};

// Plate configurations for each goal/meal combination
export const PLATE_CONFIGURATIONS: Record<GoalType, Record<MealType, PlateConfiguration>> = {
  energy: {
    breakfast: {
      sections: [
        { label: 'Carbs', percentage: 40, color: COLORS.carbs, description: 'Whole grains, fruits' },
        { label: 'Protein', percentage: 25, color: COLORS.protein, description: 'Eggs, yogurt, nuts' },
        { label: 'Vegetables', percentage: 20, color: COLORS.vegetables, description: 'Greens, peppers' },
        { label: 'Fats', percentage: 15, color: COLORS.fats, description: 'Avocado, nut butter' },
      ],
      examples: [
        { name: 'Oatmeal with berries, almonds, and a side of scrambled eggs' },
        { name: 'Whole grain toast with avocado, poached eggs, and sautéed spinach' },
        { name: 'Greek yogurt parfait with granola, fruit, and a handful of walnuts', dietaryNote: 'Vegetarian' },
      ],
      explanation: 'Energy-focused breakfasts emphasize carbs for fuel while including protein and healthy fats for sustained energy throughout the morning.',
    },
    lunch: {
      sections: [
        { label: 'Carbs', percentage: 35, color: COLORS.carbs, description: 'Rice, pasta, bread' },
        { label: 'Protein', percentage: 30, color: COLORS.protein, description: 'Chicken, fish, beans' },
        { label: 'Vegetables', percentage: 25, color: COLORS.vegetables, description: 'Mixed vegetables' },
        { label: 'Fats', percentage: 10, color: COLORS.fats, description: 'Olive oil, nuts' },
      ],
      examples: [
        { name: 'Grilled chicken sandwich on whole grain bread with side salad' },
        { name: 'Brown rice bowl with black beans, roasted vegetables, and salsa', dietaryNote: 'Vegetarian' },
        { name: 'Pasta with lean turkey meatballs and marinara sauce, side of steamed broccoli' },
      ],
      explanation: 'Energy lunches provide balanced fuel for afternoon activities with moderate carbs and protein.',
    },
    dinner: {
      sections: [
        { label: 'Vegetables', percentage: 35, color: COLORS.vegetables, description: 'Variety of colors' },
        { label: 'Protein', percentage: 30, color: COLORS.protein, description: 'Meat, fish, tofu' },
        { label: 'Carbs', percentage: 25, color: COLORS.carbs, description: 'Potatoes, grains' },
        { label: 'Fats', percentage: 10, color: COLORS.fats, description: 'Cooking oils' },
      ],
      examples: [
        { name: 'Baked salmon with roasted sweet potato and mixed green salad' },
        { name: 'Stir-fried tofu with brown rice and colorful vegetables', dietaryNote: 'Vegetarian' },
        { name: 'Grilled chicken breast with quinoa and roasted Brussels sprouts' },
      ],
      explanation: 'Energy dinners shift toward more vegetables while maintaining good protein and moderate carbs for recovery.',
    },
  },
  performance: {
    breakfast: {
      sections: [
        { label: 'Carbs', percentage: 45, color: COLORS.carbs, description: 'Quick-digesting carbs' },
        { label: 'Protein', percentage: 30, color: COLORS.protein, description: 'Lean protein' },
        { label: 'Vegetables', percentage: 15, color: COLORS.vegetables, description: 'Light vegetables' },
        { label: 'Fats', percentage: 10, color: COLORS.fats, description: 'Minimal fats' },
      ],
      examples: [
        { name: 'Banana pancakes with protein powder, topped with berries and a drizzle of honey' },
        { name: 'Egg white omelet with whole grain toast and orange juice' },
        { name: 'Smoothie bowl with banana, protein powder, granola, and sliced fruit', dietaryNote: 'Vegetarian' },
      ],
      explanation: 'Performance breakfasts prioritize carbs and protein to fuel intense training or competition, with lighter fats for easier digestion.',
    },
    lunch: {
      sections: [
        { label: 'Carbs', percentage: 40, color: COLORS.carbs, description: 'Energy-dense carbs' },
        { label: 'Protein', percentage: 35, color: COLORS.protein, description: 'Lean protein' },
        { label: 'Vegetables', percentage: 20, color: COLORS.vegetables, description: 'Easy-to-digest' },
        { label: 'Fats', percentage: 5, color: COLORS.fats, description: 'Minimal fats' },
      ],
      examples: [
        { name: 'Grilled chicken breast with white rice and steamed carrots' },
        { name: 'Turkey and cheese wrap with pretzels and apple slices' },
        { name: 'Pasta with marinara sauce, grilled shrimp, and side of green beans' },
      ],
      explanation: 'Performance lunches maximize carbs and protein for athletes, keeping fats low for optimal digestion before training.',
    },
    dinner: {
      sections: [
        { label: 'Protein', percentage: 35, color: COLORS.protein, description: 'Recovery protein' },
        { label: 'Carbs', percentage: 35, color: COLORS.carbs, description: 'Replenish glycogen' },
        { label: 'Vegetables', percentage: 25, color: COLORS.vegetables, description: 'Nutrient-dense' },
        { label: 'Fats', percentage: 5, color: COLORS.fats, description: 'Light fats' },
      ],
      examples: [
        { name: 'Lean steak with baked potato and grilled asparagus' },
        { name: 'Grilled salmon with jasmine rice and roasted zucchini' },
        { name: 'Chicken stir-fry with noodles and mixed vegetables' },
      ],
      explanation: 'Performance dinners emphasize protein for muscle recovery and carbs to replenish energy stores after training.',
    },
  },
  recovery: {
    breakfast: {
      sections: [
        { label: 'Protein', percentage: 35, color: COLORS.protein, description: 'Muscle repair' },
        { label: 'Vegetables', percentage: 25, color: COLORS.vegetables, description: 'Anti-inflammatory' },
        { label: 'Carbs', percentage: 25, color: COLORS.carbs, description: 'Moderate carbs' },
        { label: 'Fats', percentage: 15, color: COLORS.fats, description: 'Healthy fats' },
      ],
      examples: [
        { name: 'Veggie omelet with whole grain toast and avocado' },
        { name: 'Greek yogurt with berries, chia seeds, and a small portion of granola', dietaryNote: 'Vegetarian' },
        { name: 'Smoked salmon with cream cheese on whole grain bagel and cucumber slices' },
      ],
      explanation: 'Recovery breakfasts prioritize protein for muscle repair and include anti-inflammatory foods to support healing.',
    },
    lunch: {
      sections: [
        { label: 'Vegetables', percentage: 35, color: COLORS.vegetables, description: 'Colorful variety' },
        { label: 'Protein', percentage: 30, color: COLORS.protein, description: 'Quality protein' },
        { label: 'Carbs', percentage: 20, color: COLORS.carbs, description: 'Moderate carbs' },
        { label: 'Fats', percentage: 15, color: COLORS.fats, description: 'Omega-3 rich' },
      ],
      examples: [
        { name: 'Large salad with grilled chicken, quinoa, avocado, and olive oil dressing' },
        { name: 'Buddha bowl with chickpeas, roasted vegetables, tahini, and brown rice', dietaryNote: 'Vegetarian' },
        { name: 'Tuna salad with mixed greens, cherry tomatoes, and whole grain crackers' },
      ],
      explanation: 'Recovery lunches emphasize vegetables for nutrients and antioxidants, with quality protein and healthy fats.',
    },
    dinner: {
      sections: [
        { label: 'Vegetables', percentage: 40, color: COLORS.vegetables, description: 'Nutrient-rich' },
        { label: 'Protein', percentage: 30, color: COLORS.protein, description: 'Lean protein' },
        { label: 'Fats', percentage: 20, color: COLORS.fats, description: 'Anti-inflammatory' },
        { label: 'Carbs', percentage: 10, color: COLORS.carbs, description: 'Light carbs' },
      ],
      examples: [
        { name: 'Baked cod with roasted vegetables and a side of quinoa' },
        { name: 'Lentil soup with mixed vegetables and a small whole grain roll', dietaryNote: 'Vegetarian' },
        { name: 'Grilled chicken with large mixed salad, olive oil, and sweet potato' },
      ],
      explanation: 'Recovery dinners maximize vegetables and include quality protein with healthy fats to support overnight repair and reduce inflammation.',
    },
  },
};

// Helper function to get plate configuration
export function getPlateConfiguration(goal: GoalType, mealType: MealType): PlateConfiguration {
  return PLATE_CONFIGURATIONS[goal][mealType];
}
