import { Macros } from './profile';
import { FoodItem, FOOD_DATABASE } from './foods';

export interface MealSlot {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack_am' | 'snack_pm';
  label: string;
  food: FoodItem;
  servings: number;
  logged: boolean;
  loggedAt?: string;
}

export interface DayMealPlan {
  date: string;
  meals: MealSlot[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface MealLog {
  date: string;
  mealSlotId: string;
  foodId: string;
  servings: number;
  loggedAt: string;
  estimated?: boolean;
}

const MEAL_SLOT_LABELS: Record<MealSlot['type'], string> = {
  breakfast: 'Breakfast',
  snack_am: 'Morning Snack',
  lunch: 'Lunch',
  snack_pm: 'Afternoon Snack',
  dinner: 'Dinner',
};

const MEAL_SLOT_TARGETS: Record<MealSlot['type'], number> = {
  breakfast: 0.25,
  snack_am: 0.10,
  lunch: 0.30,
  snack_pm: 0.10,
  dinner: 0.25,
};

function pickFoodForSlot(
  slotType: MealSlot['type'],
  targetCals: number,
  pantryItems?: string[],
  usedFoodIds: Set<string> = new Set()
): { food: FoodItem; servings: number } {
  const validTags: Record<string, string[]> = {
    breakfast: ['breakfast', 'quick'],
    snack_am: ['snack', 'quick-energy'],
    lunch: ['balanced', 'high-protein', 'plant-protein'],
    snack_pm: ['snack', 'healthy-fat'],
    dinner: ['balanced', 'high-protein', 'comfort-food', 'lean'],
  };

  let candidates = FOOD_DATABASE.filter(f => !usedFoodIds.has(f.id));

  if (pantryItems && pantryItems.length > 0) {
    const pantryMatches = candidates.filter(f =>
      pantryItems.some(p => f.name.toLowerCase().includes(p.toLowerCase()))
    );
    if (pantryMatches.length > 0) candidates = pantryMatches;
  }

  const tags = validTags[slotType] || [];
  const tagged = candidates.filter(f => f.tags.some(t => tags.includes(t)));
  const pool = tagged.length > 0 ? tagged : candidates;

  const idx = Math.floor(seededRandom(slotType + targetCals) * pool.length);
  const food = pool[idx] || FOOD_DATABASE[0];
  const servings = Math.max(0.5, Math.round((targetCals / food.calories) * 2) / 2);

  return { food, servings };
}

let seedCounter = 0;
let dateSeed = '';
function seededRandom(seed: string): number {
  let hash = 0;
  const s = dateSeed + seed + (seedCounter++);
  for (let i = 0; i < s.length; i++) {
    const chr = s.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return Math.abs(hash % 1000) / 1000;
}

export function generateMealPlan(
  date: string,
  macros: Macros,
  pantryItems?: string[]
): DayMealPlan {
  seedCounter = 0;
  dateSeed = date;
  const slots: MealSlot['type'][] = ['breakfast', 'snack_am', 'lunch', 'snack_pm', 'dinner'];
  const usedFoodIds = new Set<string>();
  const meals: MealSlot[] = slots.map((slotType, i) => {
    const targetCals = macros.calories * MEAL_SLOT_TARGETS[slotType];
    const { food, servings } = pickFoodForSlot(slotType, targetCals, pantryItems, usedFoodIds);
    usedFoodIds.add(food.id);
    return {
      id: `${date}-${slotType}-${i}`,
      type: slotType,
      label: MEAL_SLOT_LABELS[slotType],
      food,
      servings,
      logged: false,
    };
  });

  return {
    date,
    meals,
    totalCalories: meals.reduce((s, m) => s + m.food.calories * m.servings, 0),
    totalProtein: meals.reduce((s, m) => s + m.food.protein * m.servings, 0),
    totalCarbs: meals.reduce((s, m) => s + m.food.carbs * m.servings, 0),
    totalFat: meals.reduce((s, m) => s + m.food.fat * m.servings, 0),
  };
}

export function swapMeal(plan: DayMealPlan, mealId: string, macros: Macros): DayMealPlan {
  const usedIds = new Set(plan.meals.map(m => m.food.id));
  const meals = plan.meals.map(m => {
    if (m.id !== mealId) return m;
    const targetCals = macros.calories * MEAL_SLOT_TARGETS[m.type];
    const { food, servings } = pickFoodForSlot(m.type, targetCals, undefined, usedIds);
    usedIds.add(food.id);
    return { ...m, food, servings };
  });
  return {
    ...plan,
    meals,
    totalCalories: meals.reduce((s, m) => s + m.food.calories * m.servings, 0),
    totalProtein: meals.reduce((s, m) => s + m.food.protein * m.servings, 0),
    totalCarbs: meals.reduce((s, m) => s + m.food.carbs * m.servings, 0),
    totalFat: meals.reduce((s, m) => s + m.food.fat * m.servings, 0),
  };
}

export function getShoppingList(plans: DayMealPlan[]): { name: string; quantity: string; category: string }[] {
  const items: Record<string, { servings: number; serving: string; category: string }> = {};
  for (const plan of plans) {
    for (const meal of plan.meals) {
      if (items[meal.food.name]) {
        items[meal.food.name].servings += meal.servings;
      } else {
        items[meal.food.name] = {
          servings: meal.servings,
          serving: meal.food.serving,
          category: meal.food.category,
        };
      }
    }
  }
  return Object.entries(items).map(([name, info]) => ({
    name,
    quantity: `${info.servings} x ${info.serving}`,
    category: info.category,
  }));
}
