'use client';

import { useState, useRef, useMemo } from 'react';
import { FoodItem, FOOD_DATABASE } from '@/lib/foods';

interface MealPhotoLoggerProps {
  onLog: (foods: { food: FoodItem; servings: number }[], photoUrl: string) => void;
}

type Stage = 'initial' | 'photo' | 'selected' | 'logged';

export default function MealPhotoLogger({ onLog }: MealPhotoLoggerProps) {
  const [stage, setStage] = useState<Stage>('initial');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFoods, setSelectedFoods] = useState<{ food: FoodItem; servings: number }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return FOOD_DATABASE.filter(f =>
      f.name.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [searchQuery]);

  const totals = useMemo(() => {
    return selectedFoods.reduce(
      (acc, { food, servings }) => ({
        calories: acc.calories + food.calories * servings,
        protein: acc.protein + food.protein * servings,
        carbs: acc.carbs + food.carbs * servings,
        fat: acc.fat + food.fat * servings,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [selectedFoods]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoUrl(reader.result as string);
      setStage('photo');
    };
    reader.readAsDataURL(file);
  };

  const handleSelectFood = (food: FoodItem) => {
    if (selectedFoods.some(sf => sf.food.id === food.id)) return;
    setSelectedFoods(prev => [...prev, { food, servings: 1 }]);
    setSearchQuery('');
    if (stage === 'photo') setStage('selected');
  };

  const handleRemoveFood = (foodId: string) => {
    setSelectedFoods(prev => prev.filter(sf => sf.food.id !== foodId));
  };

  const handleServingsChange = (foodId: string, servings: number) => {
    if (servings < 0.25) return;
    setSelectedFoods(prev =>
      prev.map(sf => (sf.food.id === foodId ? { ...sf, servings } : sf))
    );
  };

  const handleLog = () => {
    if (selectedFoods.length === 0) return;
    onLog(selectedFoods, photoUrl);
    setStage('logged');
  };

  const handleReset = () => {
    setStage('initial');
    setPhotoUrl('');
    setSearchQuery('');
    setSelectedFoods([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Logged success state
  if (stage === 'logged') {
    return (
      <div className="neu-flat p-5 text-center space-y-3">
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-emerald-700">Meal Logged!</p>
        <p className="text-sm text-gray-500">
          {selectedFoods.length} item{selectedFoods.length !== 1 ? 's' : ''} &middot; {Math.round(totals.calories)} kcal
        </p>
        <button onClick={handleReset} className="neu-btn text-sm py-2 px-6 text-gray-600">
          Log Another
        </button>
      </div>
    );
  }

  return (
    <div className="neu-flat p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <h2 className="text-base font-semibold text-emerald-700">Photo Meal Logger</h2>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Initial: Snap button */}
      {stage === 'initial' && (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="neu-btn w-full py-4 flex flex-col items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm font-medium">Snap Your Meal</span>
          <span className="text-xs text-gray-400">Take a photo or upload an image</span>
        </button>
      )}

      {/* Photo preview + search */}
      {(stage === 'photo' || stage === 'selected') && (
        <>
          {/* Photo preview */}
          <div className="relative">
            <div className="neu-pressed rounded-xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoUrl}
                alt="Meal photo"
                className="w-full h-48 object-cover"
              />
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute top-2 right-2 neu-btn p-2 rounded-full text-gray-500"
              title="Retake photo"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Food search */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600">
              What&apos;s in this meal?
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search foods (e.g. chicken, rice, salad...)"
                className="neu-input text-sm pr-8"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Search results */}
            {searchResults.length > 0 && (
              <div className="neu-pressed rounded-xl p-2 max-h-48 overflow-y-auto space-y-1">
                {searchResults.map(food => {
                  const alreadySelected = selectedFoods.some(sf => sf.food.id === food.id);
                  return (
                    <button
                      key={food.id}
                      onClick={() => handleSelectFood(food)}
                      disabled={alreadySelected}
                      className={`w-full text-left p-2.5 rounded-lg text-sm transition-colors ${
                        alreadySelected
                          ? 'bg-emerald-50 text-emerald-600 cursor-default'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{food.name}</span>
                        {alreadySelected && (
                          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {food.calories} cal &middot; P: {food.protein}g &middot; C: {food.carbs}g &middot; F: {food.fat}g &middot; {food.serving}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected foods with servings */}
          {selectedFoods.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-600">Selected Foods</h3>
              <div className="space-y-2">
                {selectedFoods.map(({ food, servings }) => (
                  <div key={food.id} className="neu-flat p-3 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{food.name}</span>
                      <button
                        onClick={() => handleRemoveFood(food.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleServingsChange(food.id, servings - 0.25)}
                          className="neu-btn w-7 h-7 flex items-center justify-center text-sm font-bold text-gray-500 rounded-lg"
                        >
                          -
                        </button>
                        <span className="text-sm font-semibold text-gray-700 w-10 text-center">
                          {servings}
                        </span>
                        <button
                          onClick={() => handleServingsChange(food.id, servings + 0.25)}
                          className="neu-btn w-7 h-7 flex items-center justify-center text-sm font-bold text-gray-500 rounded-lg"
                        >
                          +
                        </button>
                        <span className="text-xs text-gray-400">{food.serving}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {Math.round(food.calories * servings)} cal
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Running totals */}
              <div className="neu-pressed rounded-xl p-3">
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="text-sm font-bold text-rose-500">{Math.round(totals.calories)}</p>
                    <p className="text-xs text-gray-400">kcal</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-violet-500">{Math.round(totals.protein)}g</p>
                    <p className="text-xs text-gray-400">protein</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-amber-500">{Math.round(totals.carbs)}g</p>
                    <p className="text-xs text-gray-400">carbs</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-500">{Math.round(totals.fat)}g</p>
                    <p className="text-xs text-gray-400">fat</p>
                  </div>
                </div>
              </div>

              {/* Log button */}
              <button
                onClick={handleLog}
                className="neu-btn-green w-full py-3 text-sm font-semibold"
              >
                Log Meal ({selectedFoods.length} item{selectedFoods.length !== 1 ? 's' : ''})
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
