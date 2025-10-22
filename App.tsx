import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, Meal, MealSuggestion, LoggedMeal } from './types';
import ProfileSetup from './components/ProfileSetup';
import Dashboard from './components/Dashboard';
import { getMealSuggestions } from './services/geminiService';

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [dailyTarget, setDailyTarget] = useState<number>(2000);
  const [loggedMeals, setLoggedMeals] = useState<LoggedMeal[]>([]);
  const [mealSuggestions, setMealSuggestions] = useState<MealSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      const savedMeals = localStorage.getItem('loggedMeals');
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

      if (savedProfile) {
        const profile: UserProfile = JSON.parse(savedProfile);
        setUserProfile(profile);
        calculateAndSetTDEE(profile);
      }
      if (savedMeals) {
        setLoggedMeals(JSON.parse(savedMeals));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('loggedMeals', JSON.stringify(loggedMeals));
  }, [loggedMeals]);

  // Handle theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const calculateAndSetTDEE = (profile: UserProfile) => {
    // Mifflin-St Jeor Equation for BMR
    const bmr = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age) + (profile.gender === 'male' ? 5 : -161);
    
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };
    
    let tdee = bmr * activityMultipliers[profile.activityLevel];

    const goalAdjustments = {
      lose: -500,
      maintain: 0,
      gain: 500,
    };
    
    tdee += goalAdjustments[profile.goal];
    setDailyTarget(Math.round(tdee));
  };
  
  const fetchSuggestions = useCallback(async (profile: UserProfile, target: number) => {
    setIsLoadingSuggestions(true);
    try {
      const suggestions = await getMealSuggestions(profile, target);
      setMealSuggestions(suggestions);
    } catch (error) {
      console.error("Failed to fetch meal suggestions:", error);
      // You might want to set an error state here
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, []);


  useEffect(() => {
    if (userProfile) {
      fetchSuggestions(userProfile, dailyTarget);
    }
  }, [userProfile, dailyTarget, fetchSuggestions]);

  const handleProfileSubmit = (profile: UserProfile) => {
    setUserProfile(profile);
    calculateAndSetTDEE(profile);
    setLoggedMeals([]); // Reset meals for new profile
  };

  const handleAddMeal = (meal: Meal) => {
    const newLoggedMeal: LoggedMeal = { ...meal, id: Date.now(), date: new Date().toISOString() };
    setLoggedMeals(prevMeals => [...prevMeals, newLoggedMeal]);
  };

  const handleRemoveMeal = (mealId: number) => {
    setLoggedMeals(prevMeals => prevMeals.filter(meal => meal.id !== mealId));
  };
  
  const handleReset = () => {
    localStorage.clear();
    setUserProfile(null);
    setLoggedMeals([]);
    setMealSuggestions([]);
    setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); // Reset theme to preference
  };

  return (
    <div className="main-bg min-h-screen w-full bg-gradient-to-br from-slate-50 to-indigo-100 text-slate-800 dark:from-slate-950 dark:to-indigo-950 dark:text-slate-200 transition-colors duration-500">
      {!userProfile ? (
        <ProfileSetup 
          onProfileSubmit={handleProfileSubmit} 
          theme={theme}
          onToggleTheme={handleThemeToggle}
        />
      ) : (
        <Dashboard
          userProfile={userProfile}
          dailyTarget={dailyTarget}
          loggedMeals={loggedMeals}
          mealSuggestions={mealSuggestions}
          onAddMeal={handleAddMeal}
          onRemoveMeal={handleRemoveMeal}
          isLoadingSuggestions={isLoadingSuggestions}
          onRefreshSuggestions={() => fetchSuggestions(userProfile, dailyTarget)}
          onResetProfile={handleReset}
          theme={theme}
          onToggleTheme={handleThemeToggle}
        />
      )}
    </div>
  );
};

export default App;