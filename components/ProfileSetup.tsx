import React, { useState } from 'react';
import { UserProfile, Goal, ActivityLevel, Gender } from '../types';
import { User, Weight, Ruler, Dumbbell, Activity, Target } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface ProfileSetupProps {
  onProfileSubmit: (profile: UserProfile) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onProfileSubmit, theme, onToggleTheme }) => {
  const [profile, setProfile] = useState<UserProfile>({
    age: 25,
    weight: 70,
    height: 175,
    gender: 'male',
    goal: 'maintain',
    activityLevel: 'moderate',
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: isNaN(Number(value)) ? value : Number(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.age <= 0 || profile.weight <= 0 || profile.height <= 0) {
      setError('Please enter valid values for age, weight, and height.');
      return;
    }
    setError('');
    onProfileSubmit(profile);
  };

  const goals: { id: Goal; label: string; icon: React.ReactNode }[] = [
    { id: 'lose', label: 'Lose Weight', icon: <Weight className="w-5 h-5" /> },
    { id: 'maintain', label: 'Maintain', icon: <Ruler className="w-5 h-5" /> },
    { id: 'gain', label: 'Gain Muscle', icon: <Dumbbell className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-2xl mx-auto bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl p-8 transition-all duration-500 relative dark:bg-slate-800/20 border border-white/20 dark:border-slate-700/50">
        <div className="absolute top-4 right-4">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
        <h1 className="text-4xl font-bold text-center text-slate-800 mb-2 dark:text-slate-100">Welcome to Arsh Cal.</h1>
        <p className="text-center text-slate-600 mb-8 dark:text-slate-400">Let's set up your profile to personalize your experience.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Age */}
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">Age</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                <input type="number" id="age" name="age" value={profile.age} onChange={handleChange} className="w-full pl-10 pr-4 py-2 bg-white/50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition dark:bg-slate-700/50 dark:border-slate-600 dark:text-white" required />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">Gender</label>
              <select id="gender" name="gender" value={profile.gender} onChange={handleChange} className="w-full p-2 bg-white/50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition dark:bg-slate-700/50 dark:border-slate-600 dark:text-white">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            
            {/* Weight */}
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">Weight (kg)</label>
              <div className="relative">
                <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                <input type="number" id="weight" name="weight" value={profile.weight} onChange={handleChange} className="w-full pl-10 pr-4 py-2 bg-white/50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition dark:bg-slate-700/50 dark:border-slate-600 dark:text-white" required />
              </div>
            </div>

            {/* Height */}
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">Height (cm)</label>
              <div className="relative">
                <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                <input type="number" id="height" name="height" value={profile.height} onChange={handleChange} className="w-full pl-10 pr-4 py-2 bg-white/50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition dark:bg-slate-700/50 dark:border-slate-600 dark:text-white" required />
              </div>
            </div>
          </div>
          
          {/* Goal */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 dark:text-slate-300">Your Goal</label>
            <div className="grid grid-cols-3 gap-3">
              {goals.map(({ id, label, icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setProfile(p => ({ ...p, goal: id }))}
                  className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all duration-300 ${profile.goal === id ? 'bg-blue-500/20 text-blue-600 border-blue-500 shadow-md dark:text-blue-300 dark:border-blue-400' : 'bg-white/30 hover:border-blue-400 dark:bg-slate-700/30 dark:text-slate-300 dark:border-slate-600 dark:hover:border-blue-500'}`}
                >
                  {icon}
                  <span className="text-sm mt-2 font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label htmlFor="activityLevel" className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">Daily Activity Level</label>
            <select id="activityLevel" name="activityLevel" value={profile.activityLevel} onChange={handleChange} className="w-full p-2 bg-white/50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition dark:bg-slate-700/50 dark:border-slate-600 dark:text-white">
              <option value="sedentary">Sedentary (little or no exercise)</option>
              <option value="light">Lightly active (light exercise/sports 1-3 days/week)</option>
              <option value="moderate">Moderately active (moderate exercise/sports 3-5 days/week)</option>
              <option value="active">Very active (hard exercise/sports 6-7 days a week)</option>
              <option value="veryActive">Extra active (very hard exercise/sports & physical job)</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-indigo-500/40">
            Create My Plan
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;