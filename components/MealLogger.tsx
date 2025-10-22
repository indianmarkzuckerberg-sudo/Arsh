import React, { useState, useRef } from 'react';
import { Meal } from '../types';
import { analyzeMealFromText, analyzeMealFromImage } from '../services/geminiService';
import { PlusCircle, Type, Camera, Loader2, Sparkles } from 'lucide-react';

interface MealLoggerProps {
  onAddMeal: (meal: Meal) => void;
}

const MealLogger: React.FC<MealLoggerProps> = ({ onAddMeal }) => {
  const [inputText, setInputText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [analyzedMeal, setAnalyzedMeal] = useState<Meal | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setInputText(''); // Clear text input if image is selected
      setAnalyzedMeal(null);
    }
  };

  const handleAnalyze = async () => {
    if (!inputText && !imageFile) {
      setError('Please describe your meal or upload an image.');
      return;
    }

    setIsLoading(true);
    setError('');
    setAnalyzedMeal(null);

    try {
      let meal: Meal;
      if (imageFile) {
        meal = await analyzeMealFromImage(imageFile);
      } else {
        meal = await analyzeMealFromText(inputText);
      }
      setAnalyzedMeal(meal);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLog = () => {
    if (analyzedMeal) {
      onAddMeal(analyzedMeal);
      // Reset state
      setAnalyzedMeal(null);
      setInputText('');
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const clearInputs = () => {
    setInputText('');
    setImageFile(null);
    setAnalyzedMeal(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  return (
    <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-xl p-6 dark:bg-slate-800/20 border border-white/20 dark:border-slate-700/50">
      <h2 className="text-xl font-semibold mb-4 dark:text-slate-200">Log a Meal</h2>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-grow">
          <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={inputText}
            onChange={(e) => {
                setInputText(e.target.value);
                setImageFile(null);
                setAnalyzedMeal(null);
            }}
            placeholder="e.g., a bowl of oatmeal with berries"
            className="w-full pl-10 pr-4 py-3 bg-white/50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition dark:bg-slate-700/50 dark:border-slate-600 dark:text-white"
            disabled={isLoading}
          />
        </div>
        <div className="flex items-center gap-2">
            <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                disabled={isLoading}
            >
                <Camera className="w-5 h-5" />
                <span>{imageFile ? "Change Image" : "Upload"}</span>
            </button>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />

            <button
                onClick={handleAnalyze}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-indigo-500/40"
                disabled={isLoading}
            >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                <span>Analyze</span>
            </button>
        </div>
      </div>
      {imageFile && <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Selected: {imageFile.name}</p>}

      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      {analyzedMeal && (
        <div className="mt-4 p-4 bg-blue-500/10 rounded-lg animate-fade-in border border-blue-500/20">
          <h3 className="font-semibold text-blue-800 dark:text-blue-300">Analysis Result</h3>
          <p className="text-2xl font-bold my-2 dark:text-white">{analyzedMeal.totalCalories} <span className="text-lg font-normal">kcal</span></p>
          <ul className="list-disc list-inside text-slate-700 dark:text-slate-300">
            {analyzedMeal.items.map((item, index) => (
              <li key={index}>{item.name}: {item.calories} kcal</li>
            ))}
          </ul>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddLog}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
              Add to Log
            </button>
            <button
              onClick={clearInputs}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500 transition-colors"
            >
                Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealLogger;