import React from 'react';
import { MealSuggestion } from '../types';
import { Utensils, RefreshCw, Loader2 } from 'lucide-react';

interface MealSuggestionsProps {
  suggestions: MealSuggestion[];
  isLoading: boolean;
  onRefresh: () => void;
}

const MealCard: React.FC<{ suggestion: MealSuggestion }> = ({ suggestion }) => {
  return (
    <div className="p-4 rounded-lg hover:bg-slate-500/10 transition-colors duration-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-slate-500 text-sm dark:text-slate-400">{suggestion.mealType}</p>
          <p className="text-slate-800 font-medium dark:text-slate-200">{suggestion.name}</p>
        </div>
        <p className="text-blue-600 font-bold text-lg dark:text-blue-400">{suggestion.calories}<span className="text-sm font-normal"> kcal</span></p>
      </div>
    </div>
  );
};

const SkeletonCard: React.FC = () => (
    <div className="p-4 rounded-lg">
        <div className="flex justify-between items-start animate-pulse">
            <div>
                <div className="h-4 bg-slate-200 rounded w-20 mb-2 dark:bg-slate-700"></div>
                <div className="h-5 bg-slate-200 rounded w-32 dark:bg-slate-700"></div>
            </div>
            <div className="h-6 bg-slate-200 rounded w-16 dark:bg-slate-700"></div>
        </div>
    </div>
);


const MealSuggestions: React.FC<MealSuggestionsProps> = ({ suggestions, isLoading, onRefresh }) => {
  return (
    <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-xl p-6 h-full dark:bg-slate-800/20 border border-white/20 dark:border-slate-700/50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 dark:text-slate-200">
            <Utensils className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            <span>AI Meal Suggestions</span>
        </h2>
        <button onClick={onRefresh} disabled={isLoading} className="text-slate-500 hover:text-blue-600 disabled:text-slate-400 transition-colors dark:text-slate-400 dark:hover:text-blue-400 dark:disabled:text-slate-600">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
        </button>
      </div>
      {isLoading ? (
        <div className="space-y-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : suggestions.length > 0 ? (
        <div className="space-y-1">
          {suggestions.map((s, i) => (
            <MealCard key={i} suggestion={s} />
          ))}
        </div>
      ) : (
        <p className="text-slate-500 text-center py-8 dark:text-slate-400">Could not load suggestions. Please try again.</p>
      )}
    </div>
  );
};

export default MealSuggestions;