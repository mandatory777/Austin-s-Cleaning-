import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const GOAL_DESCRIPTIONS: Record<string, string> = {
  weight_loss: 'Weight Loss — calorie deficit, high protein, high fiber, low calorie-dense foods. Focus on lean proteins, vegetables, and volume eating.',
  muscle_gain: 'Muscle Gain — calorie surplus, very high protein, adequate carbs for training fuel. Include calorie-dense clean foods.',
  wellness: 'General Wellness — balanced macros, whole foods, anti-inflammatory ingredients, variety of micronutrients and colorful produce.',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { goal, macros, profile, preferences, date } = body;

    if (!goal || !macros || !profile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const goalDesc = GOAL_DESCRIPTIONS[goal] || GOAL_DESCRIPTIONS.wellness;

    const avoidText = preferences?.avoid?.length
      ? `\nFoods/ingredients to AVOID: ${preferences.avoid.join(', ')}`
      : '';
    const cuisineText = preferences?.cuisines?.length
      ? `\nPreferred cuisines: ${preferences.cuisines.join(', ')}`
      : '';
    const restrictionText = preferences?.dietaryRestrictions?.length
      ? `\nDietary restrictions: ${preferences.dietaryRestrictions.join(', ')}`
      : '';

    const prompt = `You are an expert sports nutritionist and professional chef creating an in-depth, personalized daily meal plan with restaurant-quality detail.

USER PROFILE:
- Name: ${profile.name}
- Age: ${profile.age}, Sex: ${profile.sex}
- Weight: ${profile.weight} lbs, Height: ${profile.height} inches
- Activity Level: ${profile.activityLevel}
- Goal: ${goalDesc}
${avoidText}${cuisineText}${restrictionText}

DAILY MACRO TARGETS:
- Calories: ${macros.calories} kcal
- Protein: ${macros.protein}g
- Carbs: ${macros.carbs}g
- Fat: ${macros.fat}g

Create a complete daily meal plan with 5 meals distributed as:
1. Breakfast (~25% of daily calories = ~${Math.round(macros.calories * 0.25)} kcal)
2. Morning Snack (~10% = ~${Math.round(macros.calories * 0.10)} kcal)
3. Lunch (~30% = ~${Math.round(macros.calories * 0.30)} kcal)
4. Afternoon Snack (~10% = ~${Math.round(macros.calories * 0.10)} kcal)
5. Dinner (~25% = ~${Math.round(macros.calories * 0.25)} kcal)

REQUIREMENTS:
- Each recipe MUST have real, specific ingredients with exact amounts
- Instructions must be DETAILED step-by-step with timing for each step and optional pro tips
- Include fiber, sugar, and sodium in macros for each recipe
- Provide 2-3 ingredient substitutions per recipe (with macro/taste impact notes)
- Include 2-3 professional chef tips per recipe (technique, flavor, texture advice)
- Include a serving suggestion (how to plate, what to pair with)
- Include a nutrition note explaining WHY this recipe's macro profile matters for the user's goal
- Macros must be realistic and add up close to daily targets
- Use commonly available grocery store ingredients
- Vary the cuisines and cooking methods across meals
- Make main meals restaurant-quality but achievable at home
- Snacks should be creative but simple

Return ONLY valid JSON matching this exact schema (no markdown, no code blocks, just raw JSON):
{
  "meals": [
    {
      "slotType": "breakfast",
      "slotLabel": "Breakfast",
      "name": "Recipe Name",
      "description": "2-3 sentence appetizing, detailed description that makes you want to cook it",
      "cuisineType": "e.g. American, Mediterranean, Asian, Mexican, Japanese",
      "prepTime": 10,
      "cookTime": 15,
      "servings": 1,
      "difficulty": "easy",
      "ingredients": [
        { "item": "ingredient name", "amount": "2", "unit": "cups", "category": "produce" }
      ],
      "instructions": [
        { "step": "Detailed instruction for this step", "duration": "3-4 minutes", "tip": "Optional pro tip for this step" }
      ],
      "macros": { "calories": 450, "protein": 30, "carbs": 50, "fat": 12, "fiber": 6, "sugar": 8, "sodium": 380 },
      "tags": ["high-protein", "quick", "meal-prep-friendly"],
      "goalTip": "Why this recipe supports the user's specific goal",
      "nutritionNotes": "Detailed explanation of the macro/micro profile and how it supports the goal — mention specific nutrients",
      "substitutions": [
        { "original": "chicken breast", "alternative": "firm tofu", "note": "Similar protein, adds isoflavones. Reduce cook time by 2 min." }
      ],
      "chefTips": [
        "Pat protein dry before searing for a better crust",
        "Let it rest 3 minutes after cooking to redistribute juices"
      ],
      "servingSuggestion": "Serve on a warm plate with a squeeze of lemon and fresh herbs on top"
    }
  ]
}

The slotType values must be exactly: "breakfast", "snack_am", "lunch", "snack_pm", "dinner"
The slotLabel values: "Breakfast", "Morning Snack", "Lunch", "Afternoon Snack", "Dinner"
Category values for ingredients: "produce", "protein", "dairy", "grains", "pantry", "spices", "oils", "frozen"
Difficulty: "easy", "medium", or "hard"
Tags should include relevant ones like: "high-protein", "low-carb", "high-fiber", "anti-inflammatory", "quick", "meal-prep-friendly", "one-pan", "no-cook", "budget-friendly", "comfort-food"`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
    });

    // Extract text from response
    const textBlock = message.content.find(b => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: 'No text response from AI' }, { status: 500 });
    }

    // Parse JSON — handle potential markdown wrapping
    let jsonText = textBlock.text.trim();
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const parsed = JSON.parse(jsonText);

    // Build the full meal plan
    const meals = parsed.meals.map((m: Record<string, unknown>, i: number) => ({
      ...m,
      id: `ai-${date}-${i}`,
      logged: false,
    }));

    const totalCalories = meals.reduce((s: number, m: { macros: { calories: number } }) => s + m.macros.calories, 0);
    const totalProtein = meals.reduce((s: number, m: { macros: { protein: number } }) => s + m.macros.protein, 0);
    const totalCarbs = meals.reduce((s: number, m: { macros: { carbs: number } }) => s + m.macros.carbs, 0);
    const totalFat = meals.reduce((s: number, m: { macros: { fat: number } }) => s + m.macros.fat, 0);

    const mealPlan = {
      date,
      goal,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      meals,
      generatedAt: new Date().toISOString(),
      aiGenerated: true as const,
    };

    return NextResponse.json(mealPlan);
  } catch (error) {
    console.error('Meal generation error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to generate meal plan: ${message}` }, { status: 500 });
  }
}
