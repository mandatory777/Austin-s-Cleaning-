// AI-powered meal plan types

export interface AIIngredient {
  item: string;
  amount: string;
  unit: string;
  category: string; // produce, protein, dairy, grains, pantry, spices
}

export interface AIRecipe {
  id: string;
  slotType: 'breakfast' | 'snack_am' | 'lunch' | 'snack_pm' | 'dinner';
  slotLabel: string;
  name: string;
  description: string;
  cuisineType: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: AIIngredient[];
  instructions: InstructionStep[];
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
    sodium?: number; // mg
  };
  tags: string[];
  goalTip: string; // why this recipe fits the user's goal
  nutritionNotes: string; // detailed breakdown of why these macros matter
  substitutions: Substitution[]; // ingredient swap suggestions
  chefTips: string[]; // pro cooking tips
  servingSuggestion: string; // plating / pairing ideas
  logged?: boolean;
}

export interface InstructionStep {
  step: string;
  duration?: string; // e.g. "3-4 minutes"
  tip?: string; // optional pro tip for this step
}

export interface Substitution {
  original: string;
  alternative: string;
  note: string; // how it affects macros/taste
}

export interface AIMealPlan {
  date: string;
  goal: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  meals: AIRecipe[];
  generatedAt: string;
  aiGenerated: true;
}

export interface MealGenRequest {
  goal: string;
  macros: { calories: number; protein: number; carbs: number; fat: number };
  profile: {
    age: number;
    sex: string;
    weight: number;
    height: number;
    activityLevel: string;
    name: string;
  };
  preferences?: {
    cuisines?: string[];
    avoid?: string[];
    dietaryRestrictions?: string[];
  };
  date: string;
}

// Generate a shopping list from an AI meal plan
export function getAIShoppingList(plan: AIMealPlan): { name: string; quantity: string; category: string; checked: boolean }[] {
  const itemMap = new Map<string, { quantity: string[]; category: string }>();

  for (const meal of plan.meals) {
    for (const ing of meal.ingredients) {
      const key = ing.item.toLowerCase();
      if (itemMap.has(key)) {
        itemMap.get(key)!.quantity.push(`${ing.amount} ${ing.unit}`.trim());
      } else {
        itemMap.set(key, {
          quantity: [`${ing.amount} ${ing.unit}`.trim()],
          category: ing.category,
        });
      }
    }
  }

  return Array.from(itemMap.entries()).map(([name, data]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    quantity: data.quantity.join(' + '),
    category: data.category,
    checked: false,
  }));
}
