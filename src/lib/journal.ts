export interface JournalEntry {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodNames: string[];
  energy: 1 | 2 | 3;    // 1=low, 2=okay, 3=great
  mood: 1 | 2 | 3;      // 1=poor, 2=okay, 3=great
  digestion: 1 | 2 | 3; // 1=bad, 2=okay, 3=great
  timestamp: string;
}

export interface FoodCorrelation {
  foodName: string;
  avgEnergy: number;
  avgMood: number;
  avgDigestion: number;
  overallScore: number;
  entries: number;
  verdict: 'great' | 'good' | 'neutral' | 'poor';
}

export const ENERGY_LABELS = ['', 'Low Energy', 'Okay', 'Energized'];
export const MOOD_LABELS = ['', 'Not Great', 'Okay', 'Feeling Good'];
export const DIGESTION_LABELS = ['', 'Uncomfortable', 'Fine', 'Great'];

export const ENERGY_EMOJIS = ['', '🔋', '⚡', '🚀'];
export const MOOD_EMOJIS = ['', '😔', '😐', '😊'];
export const DIGESTION_EMOJIS = ['', '😣', '😌', '✨'];

export function analyzeFoodCorrelations(entries: JournalEntry[]): FoodCorrelation[] {
  if (entries.length < 5) return [];

  const foodStats: Record<string, { energy: number[]; mood: number[]; digestion: number[] }> = {};

  for (const entry of entries) {
    for (const food of entry.foodNames) {
      const name = food.toLowerCase().trim();
      if (!foodStats[name]) {
        foodStats[name] = { energy: [], mood: [], digestion: [] };
      }
      foodStats[name].energy.push(entry.energy);
      foodStats[name].mood.push(entry.mood);
      foodStats[name].digestion.push(entry.digestion);
    }
  }

  const correlations: FoodCorrelation[] = [];

  for (const [foodName, stats] of Object.entries(foodStats)) {
    if (stats.energy.length < 2) continue;

    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
    const avgEnergy = avg(stats.energy);
    const avgMood = avg(stats.mood);
    const avgDigestion = avg(stats.digestion);
    const overallScore = (avgEnergy + avgMood + avgDigestion) / 3;

    let verdict: FoodCorrelation['verdict'];
    if (overallScore >= 2.5) verdict = 'great';
    else if (overallScore >= 2.0) verdict = 'good';
    else if (overallScore >= 1.5) verdict = 'neutral';
    else verdict = 'poor';

    correlations.push({
      foodName,
      avgEnergy: Math.round(avgEnergy * 10) / 10,
      avgMood: Math.round(avgMood * 10) / 10,
      avgDigestion: Math.round(avgDigestion * 10) / 10,
      overallScore: Math.round(overallScore * 10) / 10,
      entries: stats.energy.length,
      verdict,
    });
  }

  return correlations.sort((a, b) => b.overallScore - a.overallScore);
}

export function getTopFoods(correlations: FoodCorrelation[], count = 5): FoodCorrelation[] {
  return correlations.filter(c => c.entries >= 2).slice(0, count);
}

export function getWorstFoods(correlations: FoodCorrelation[], count = 5): FoodCorrelation[] {
  return correlations
    .filter(c => c.entries >= 2)
    .sort((a, b) => a.overallScore - b.overallScore)
    .slice(0, count);
}
