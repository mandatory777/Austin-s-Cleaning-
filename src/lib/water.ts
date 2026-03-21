export interface WaterLog {
  date: string;
  glasses: number; // each glass = 8oz
  goal: number; // glasses per day (default 8 = 64oz)
  lastLoggedAt: string;
}

export interface PetState {
  name: string;
  type: 'cat' | 'dog' | 'bunny' | 'frog';
  mood: 'thriving' | 'happy' | 'okay' | 'thirsty' | 'parched';
  streak: number; // days in a row hitting water goal
  createdAt: string;
}

export function getPetMood(glasses: number, goal: number): PetState['mood'] {
  const ratio = glasses / goal;
  if (ratio >= 1) return 'thriving';
  if (ratio >= 0.75) return 'happy';
  if (ratio >= 0.5) return 'okay';
  if (ratio >= 0.25) return 'thirsty';
  return 'parched';
}

export function getPetMessage(mood: PetState['mood'], name: string, glasses: number, goal: number): string {
  switch (mood) {
    case 'thriving':
      return `${name} is SO happy! 💧 You hit your water goal!`;
    case 'happy':
      return `${name} is feeling great! Just ${goal - glasses} more glass${goal - glasses === 1 ? '' : 'es'} to go!`;
    case 'okay':
      return `${name} could use some water... ${goal - glasses} glasses left today`;
    case 'thirsty':
      return `${name} is getting thirsty! Please drink some water 🥺`;
    case 'parched':
      return `${name} needs water! Tap + to log a glass 💧`;
  }
}

export const PET_TYPES = [
  { type: 'cat' as const, label: 'Cat', emoji: '🐱' },
  { type: 'dog' as const, label: 'Dog', emoji: '🐶' },
  { type: 'bunny' as const, label: 'Bunny', emoji: '🐰' },
  { type: 'frog' as const, label: 'Frog', emoji: '🐸' },
];
