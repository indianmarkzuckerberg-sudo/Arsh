export type Goal = 'lose' | 'maintain' | 'gain';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
export type Gender = 'male' | 'female';

export interface UserProfile {
  age: number;
  weight: number; // in kg
  height: number; // in cm
  gender: Gender;
  goal: Goal;
  activityLevel: ActivityLevel;
}

export interface MealItem {
  name: string;
  calories: number;
}

export interface Meal {
  totalCalories: number;
  items: MealItem[];
}

export interface LoggedMeal extends Meal {
  id: number;
  date: string; // ISO date string
}

export interface MealSuggestion {
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | string;
  name: string;
  calories: number;
}