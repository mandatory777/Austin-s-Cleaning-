export interface FoodItem {
  id: string;
  name: string;
  category: string;
  cuisine: string;
  calories: number;  // per serving
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
  tags: string[];
}

export const FOOD_DATABASE: FoodItem[] = [
  // === AMERICAN / WESTERN ===
  { id: 'f1', name: 'Grilled Chicken Breast', category: 'protein', cuisine: 'western', calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: '100g', tags: ['high-protein', 'lean'] },
  { id: 'f2', name: 'Scrambled Eggs', category: 'protein', cuisine: 'western', calories: 147, protein: 10, carbs: 1.6, fat: 11, serving: '2 eggs', tags: ['breakfast', 'quick'] },
  { id: 'f3', name: 'Salmon Fillet', category: 'protein', cuisine: 'western', calories: 208, protein: 20, carbs: 0, fat: 13, serving: '100g', tags: ['omega-3', 'high-protein'] },
  { id: 'f4', name: 'Greek Yogurt', category: 'dairy', cuisine: 'western', calories: 100, protein: 17, carbs: 6, fat: 0.7, serving: '170g', tags: ['snack', 'high-protein'] },
  { id: 'f5', name: 'Oatmeal', category: 'grain', cuisine: 'western', calories: 150, protein: 5, carbs: 27, fat: 2.5, serving: '1 cup cooked', tags: ['breakfast', 'fiber'] },
  { id: 'f6', name: 'Brown Rice', category: 'grain', cuisine: 'western', calories: 216, protein: 5, carbs: 45, fat: 1.8, serving: '1 cup cooked', tags: ['complex-carb'] },
  { id: 'f7', name: 'Sweet Potato', category: 'vegetable', cuisine: 'western', calories: 103, protein: 2, carbs: 24, fat: 0.1, serving: '1 medium', tags: ['complex-carb', 'fiber'] },
  { id: 'f8', name: 'Broccoli', category: 'vegetable', cuisine: 'western', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, serving: '1 cup', tags: ['fiber', 'vitamins'] },
  { id: 'f9', name: 'Avocado', category: 'fruit', cuisine: 'western', calories: 240, protein: 3, carbs: 12, fat: 22, serving: '1 whole', tags: ['healthy-fat'] },
  { id: 'f10', name: 'Almonds', category: 'nuts', cuisine: 'western', calories: 164, protein: 6, carbs: 6, fat: 14, serving: '28g', tags: ['snack', 'healthy-fat'] },
  { id: 'f11', name: 'Turkey Breast', category: 'protein', cuisine: 'western', calories: 135, protein: 30, carbs: 0, fat: 1, serving: '100g', tags: ['lean', 'high-protein'] },
  { id: 'f12', name: 'Cottage Cheese', category: 'dairy', cuisine: 'western', calories: 98, protein: 11, carbs: 3.4, fat: 4.3, serving: '100g', tags: ['snack', 'high-protein'] },
  { id: 'f13', name: 'Whole Wheat Toast', category: 'grain', cuisine: 'western', calories: 128, protein: 4, carbs: 24, fat: 2, serving: '2 slices', tags: ['breakfast', 'fiber'] },
  { id: 'f14', name: 'Banana', category: 'fruit', cuisine: 'western', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, serving: '1 medium', tags: ['snack', 'quick-energy'] },
  { id: 'f15', name: 'Protein Shake', category: 'protein', cuisine: 'western', calories: 120, protein: 24, carbs: 3, fat: 1, serving: '1 scoop + water', tags: ['post-workout', 'quick'] },

  // === MEXICAN / LATIN ===
  { id: 'f16', name: 'Black Bean Bowl', category: 'protein', cuisine: 'mexican', calories: 227, protein: 15, carbs: 41, fat: 1, serving: '1 cup', tags: ['plant-protein', 'fiber'] },
  { id: 'f17', name: 'Chicken Burrito Bowl', category: 'meal', cuisine: 'mexican', calories: 450, protein: 35, carbs: 48, fat: 12, serving: '1 bowl', tags: ['balanced'] },
  { id: 'f18', name: 'Guacamole with Veggies', category: 'snack', cuisine: 'mexican', calories: 180, protein: 3, carbs: 12, fat: 15, serving: '1/2 cup', tags: ['healthy-fat', 'snack'] },
  { id: 'f19', name: 'Fish Tacos', category: 'meal', cuisine: 'mexican', calories: 340, protein: 24, carbs: 30, fat: 14, serving: '2 tacos', tags: ['omega-3'] },
  { id: 'f20', name: 'Pozole', category: 'meal', cuisine: 'mexican', calories: 300, protein: 22, carbs: 35, fat: 8, serving: '1 bowl', tags: ['comfort-food'] },

  // === CHINESE ===
  { id: 'f21', name: 'Steamed Chicken & Broccoli', category: 'meal', cuisine: 'chinese', calories: 280, protein: 30, carbs: 12, fat: 12, serving: '1 plate', tags: ['lean', 'high-protein'] },
  { id: 'f22', name: 'Congee (Rice Porridge)', category: 'grain', cuisine: 'chinese', calories: 150, protein: 5, carbs: 30, fat: 1, serving: '1 bowl', tags: ['breakfast', 'comfort-food'] },
  { id: 'f23', name: 'Stir-Fried Tofu & Vegetables', category: 'meal', cuisine: 'chinese', calories: 220, protein: 14, carbs: 18, fat: 11, serving: '1 plate', tags: ['plant-protein'] },
  { id: 'f24', name: 'Steamed Fish with Ginger', category: 'protein', cuisine: 'chinese', calories: 180, protein: 28, carbs: 2, fat: 6, serving: '1 fillet', tags: ['lean', 'omega-3'] },
  { id: 'f25', name: 'Egg Drop Soup', category: 'soup', cuisine: 'chinese', calories: 90, protein: 6, carbs: 8, fat: 4, serving: '1 bowl', tags: ['light'] },
  { id: 'f26', name: 'Mapo Tofu', category: 'meal', cuisine: 'chinese', calories: 250, protein: 16, carbs: 10, fat: 17, serving: '1 plate', tags: ['spicy'] },

  // === INDIAN ===
  { id: 'f27', name: 'Dal (Lentil Curry)', category: 'meal', cuisine: 'indian', calories: 230, protein: 16, carbs: 36, fat: 4, serving: '1 cup', tags: ['plant-protein', 'fiber'] },
  { id: 'f28', name: 'Tandoori Chicken', category: 'protein', cuisine: 'indian', calories: 260, protein: 30, carbs: 6, fat: 12, serving: '2 pieces', tags: ['high-protein', 'spicy'] },
  { id: 'f29', name: 'Chana Masala', category: 'meal', cuisine: 'indian', calories: 280, protein: 12, carbs: 42, fat: 8, serving: '1 cup', tags: ['plant-protein', 'fiber'] },
  { id: 'f30', name: 'Raita', category: 'side', cuisine: 'indian', calories: 60, protein: 3, carbs: 5, fat: 3, serving: '1/2 cup', tags: ['cooling', 'probiotic'] },
  { id: 'f31', name: 'Roti (Whole Wheat)', category: 'grain', cuisine: 'indian', calories: 120, protein: 4, carbs: 22, fat: 2, serving: '1 piece', tags: ['complex-carb'] },
  { id: 'f32', name: 'Palak Paneer', category: 'meal', cuisine: 'indian', calories: 300, protein: 14, carbs: 12, fat: 22, serving: '1 cup', tags: ['vegetarian'] },
  { id: 'f33', name: 'Idli with Sambar', category: 'meal', cuisine: 'indian', calories: 200, protein: 8, carbs: 38, fat: 2, serving: '3 idli + sambar', tags: ['breakfast', 'fermented'] },

  // === JAPANESE ===
  { id: 'f34', name: 'Sashimi (Mixed)', category: 'protein', cuisine: 'japanese', calories: 160, protein: 26, carbs: 0, fat: 6, serving: '8 pieces', tags: ['omega-3', 'lean'] },
  { id: 'f35', name: 'Miso Soup', category: 'soup', cuisine: 'japanese', calories: 50, protein: 3, carbs: 5, fat: 2, serving: '1 bowl', tags: ['probiotic', 'light'] },
  { id: 'f36', name: 'Edamame', category: 'snack', cuisine: 'japanese', calories: 120, protein: 11, carbs: 9, fat: 5, serving: '1 cup', tags: ['plant-protein', 'snack'] },
  { id: 'f37', name: 'Grilled Teriyaki Salmon', category: 'protein', cuisine: 'japanese', calories: 240, protein: 24, carbs: 8, fat: 12, serving: '1 fillet', tags: ['omega-3'] },
  { id: 'f38', name: 'Onigiri (Rice Ball)', category: 'grain', cuisine: 'japanese', calories: 180, protein: 4, carbs: 38, fat: 1, serving: '1 piece', tags: ['snack', 'portable'] },

  // === KOREAN ===
  { id: 'f39', name: 'Bibimbap', category: 'meal', cuisine: 'korean', calories: 490, protein: 22, carbs: 65, fat: 14, serving: '1 bowl', tags: ['balanced'] },
  { id: 'f40', name: 'Kimchi', category: 'side', cuisine: 'korean', calories: 23, protein: 1.3, carbs: 4, fat: 0.5, serving: '100g', tags: ['probiotic', 'fermented'] },
  { id: 'f41', name: 'Korean BBQ Beef (Bulgogi)', category: 'protein', cuisine: 'korean', calories: 280, protein: 26, carbs: 12, fat: 14, serving: '150g', tags: ['high-protein'] },
  { id: 'f42', name: 'Japchae (Glass Noodles)', category: 'meal', cuisine: 'korean', calories: 250, protein: 8, carbs: 38, fat: 8, serving: '1 plate', tags: ['balanced'] },

  // === MEDITERRANEAN ===
  { id: 'f43', name: 'Hummus with Pita', category: 'snack', cuisine: 'mediterranean', calories: 270, protein: 10, carbs: 36, fat: 10, serving: '1/3 cup + 1 pita', tags: ['plant-protein', 'snack'] },
  { id: 'f44', name: 'Grilled Lamb Kofta', category: 'protein', cuisine: 'mediterranean', calories: 280, protein: 22, carbs: 4, fat: 20, serving: '3 pieces', tags: ['high-protein'] },
  { id: 'f45', name: 'Falafel Wrap', category: 'meal', cuisine: 'mediterranean', calories: 380, protein: 14, carbs: 44, fat: 16, serving: '1 wrap', tags: ['plant-protein'] },
  { id: 'f46', name: 'Tabbouleh', category: 'side', cuisine: 'mediterranean', calories: 120, protein: 3, carbs: 16, fat: 5, serving: '1 cup', tags: ['fiber', 'fresh'] },
  { id: 'f47', name: 'Greek Salad', category: 'side', cuisine: 'mediterranean', calories: 150, protein: 5, carbs: 10, fat: 11, serving: '1 bowl', tags: ['fresh', 'light'] },
  { id: 'f48', name: 'Shakshuka', category: 'meal', cuisine: 'mediterranean', calories: 250, protein: 14, carbs: 18, fat: 14, serving: '1 serving', tags: ['breakfast', 'high-protein'] },

  // === AFRICAN ===
  { id: 'f49', name: 'Jollof Rice with Chicken', category: 'meal', cuisine: 'african', calories: 420, protein: 25, carbs: 52, fat: 12, serving: '1 plate', tags: ['balanced'] },
  { id: 'f50', name: 'Egusi Soup', category: 'soup', cuisine: 'african', calories: 300, protein: 18, carbs: 12, fat: 20, serving: '1 bowl', tags: ['comfort-food'] },
  { id: 'f51', name: 'Fufu with Light Soup', category: 'meal', cuisine: 'african', calories: 350, protein: 15, carbs: 55, fat: 8, serving: '1 serving', tags: ['comfort-food'] },
  { id: 'f52', name: 'Suya (Grilled Meat Skewers)', category: 'protein', cuisine: 'african', calories: 250, protein: 28, carbs: 4, fat: 14, serving: '3 skewers', tags: ['high-protein', 'spicy'] },
  { id: 'f53', name: 'Moin Moin (Bean Pudding)', category: 'protein', cuisine: 'african', calories: 180, protein: 12, carbs: 22, fat: 5, serving: '1 piece', tags: ['plant-protein'] },

  // === CARIBBEAN ===
  { id: 'f54', name: 'Jerk Chicken', category: 'protein', cuisine: 'caribbean', calories: 260, protein: 28, carbs: 6, fat: 14, serving: '1 breast', tags: ['high-protein', 'spicy'] },
  { id: 'f55', name: 'Rice and Peas', category: 'grain', cuisine: 'caribbean', calories: 250, protein: 8, carbs: 44, fat: 5, serving: '1 cup', tags: ['fiber'] },
  { id: 'f56', name: 'Callaloo', category: 'vegetable', cuisine: 'caribbean', calories: 80, protein: 4, carbs: 8, fat: 4, serving: '1 cup', tags: ['vitamins', 'iron'] },

  // === SOUTHEAST ASIAN ===
  { id: 'f57', name: 'Pho (Beef Noodle Soup)', category: 'meal', cuisine: 'vietnamese', calories: 380, protein: 24, carbs: 48, fat: 8, serving: '1 bowl', tags: ['comfort-food'] },
  { id: 'f58', name: 'Pad Thai (Chicken)', category: 'meal', cuisine: 'thai', calories: 400, protein: 20, carbs: 52, fat: 14, serving: '1 plate', tags: ['balanced'] },
  { id: 'f59', name: 'Tom Yum Soup', category: 'soup', cuisine: 'thai', calories: 120, protein: 12, carbs: 8, fat: 4, serving: '1 bowl', tags: ['spicy', 'light'] },
  { id: 'f60', name: 'Green Papaya Salad', category: 'side', cuisine: 'thai', calories: 90, protein: 2, carbs: 18, fat: 2, serving: '1 plate', tags: ['fresh', 'spicy'] },
  { id: 'f61', name: 'Nasi Goreng', category: 'meal', cuisine: 'indonesian', calories: 380, protein: 16, carbs: 50, fat: 12, serving: '1 plate', tags: ['balanced'] },
  { id: 'f62', name: 'Gado-Gado', category: 'meal', cuisine: 'indonesian', calories: 300, protein: 14, carbs: 28, fat: 16, serving: '1 plate', tags: ['plant-protein'] },

  // === MIDDLE EASTERN ===
  { id: 'f63', name: 'Chicken Shawarma Plate', category: 'meal', cuisine: 'middle_eastern', calories: 450, protein: 32, carbs: 40, fat: 16, serving: '1 plate', tags: ['high-protein'] },
  { id: 'f64', name: 'Lentil Soup', category: 'soup', cuisine: 'middle_eastern', calories: 180, protein: 12, carbs: 28, fat: 3, serving: '1 bowl', tags: ['plant-protein', 'fiber'] },
  { id: 'f65', name: 'Baba Ganoush', category: 'snack', cuisine: 'middle_eastern', calories: 130, protein: 3, carbs: 10, fat: 9, serving: '1/3 cup', tags: ['healthy-fat'] },

  // === ETHIOPIAN ===
  { id: 'f66', name: 'Misir Wot (Lentil Stew)', category: 'meal', cuisine: 'ethiopian', calories: 260, protein: 14, carbs: 38, fat: 6, serving: '1 cup', tags: ['plant-protein', 'spicy'] },
  { id: 'f67', name: 'Doro Wot (Chicken Stew)', category: 'meal', cuisine: 'ethiopian', calories: 350, protein: 28, carbs: 18, fat: 18, serving: '1 serving', tags: ['high-protein'] },
  { id: 'f68', name: 'Injera', category: 'grain', cuisine: 'ethiopian', calories: 130, protein: 4, carbs: 26, fat: 1, serving: '1 piece', tags: ['fermented'] },

  // === SOUTH AMERICAN ===
  { id: 'f69', name: 'Ceviche', category: 'protein', cuisine: 'peruvian', calories: 180, protein: 22, carbs: 12, fat: 4, serving: '1 cup', tags: ['lean', 'omega-3'] },
  { id: 'f70', name: 'Açaí Bowl', category: 'meal', cuisine: 'brazilian', calories: 350, protein: 6, carbs: 55, fat: 12, serving: '1 bowl', tags: ['antioxidants', 'breakfast'] },
  { id: 'f71', name: 'Feijoada (Black Bean Stew)', category: 'meal', cuisine: 'brazilian', calories: 400, protein: 24, carbs: 42, fat: 14, serving: '1 bowl', tags: ['comfort-food', 'protein'] },

  // === GENERAL SNACKS & SUPPLEMENTS ===
  { id: 'f72', name: 'Mixed Berries', category: 'fruit', cuisine: 'universal', calories: 70, protein: 1, carbs: 17, fat: 0.5, serving: '1 cup', tags: ['snack', 'antioxidants'] },
  { id: 'f73', name: 'Apple with Peanut Butter', category: 'snack', cuisine: 'universal', calories: 280, protein: 8, carbs: 34, fat: 16, serving: '1 apple + 2 tbsp PB', tags: ['snack', 'balanced'] },
  { id: 'f74', name: 'Trail Mix', category: 'snack', cuisine: 'universal', calories: 175, protein: 5, carbs: 16, fat: 11, serving: '1/4 cup', tags: ['snack', 'energy'] },
  { id: 'f75', name: 'Hard-Boiled Eggs', category: 'protein', cuisine: 'universal', calories: 155, protein: 13, carbs: 1.1, fat: 11, serving: '2 eggs', tags: ['snack', 'high-protein', 'quick'] },
  { id: 'f76', name: 'Quinoa', category: 'grain', cuisine: 'universal', calories: 222, protein: 8, carbs: 39, fat: 3.5, serving: '1 cup cooked', tags: ['plant-protein', 'complex-carb'] },
  { id: 'f77', name: 'Spinach Salad', category: 'vegetable', cuisine: 'universal', calories: 40, protein: 3, carbs: 4, fat: 1, serving: '2 cups', tags: ['iron', 'vitamins'] },
  { id: 'f78', name: 'Tuna Salad', category: 'protein', cuisine: 'universal', calories: 190, protein: 25, carbs: 2, fat: 9, serving: '1 cup', tags: ['high-protein', 'omega-3'] },
  { id: 'f79', name: 'Overnight Oats', category: 'grain', cuisine: 'universal', calories: 300, protein: 12, carbs: 45, fat: 8, serving: '1 jar', tags: ['breakfast', 'meal-prep'] },
  { id: 'f80', name: 'Chicken Stir-Fry', category: 'meal', cuisine: 'universal', calories: 350, protein: 30, carbs: 28, fat: 12, serving: '1 plate', tags: ['balanced', 'quick'] },
];

export const CUISINES = Array.from(new Set(FOOD_DATABASE.map(f => f.cuisine)));
export const CATEGORIES = Array.from(new Set(FOOD_DATABASE.map(f => f.category)));

export function getFoodsByCuisine(cuisine: string): FoodItem[] {
  return FOOD_DATABASE.filter(f => f.cuisine === cuisine);
}

export function getFoodsByCategory(category: string): FoodItem[] {
  return FOOD_DATABASE.filter(f => f.category === category);
}

export function searchFoods(query: string): FoodItem[] {
  const q = query.toLowerCase();
  return FOOD_DATABASE.filter(f =>
    f.name.toLowerCase().includes(q) ||
    f.cuisine.toLowerCase().includes(q) ||
    f.tags.some(t => t.includes(q))
  );
}
