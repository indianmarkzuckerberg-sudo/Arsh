import React from 'react';
import { UserProfile, LoggedMeal, Meal, MealSuggestion } from '../types';
import CalorieTracker from './CalorieTracker';
import MealLogger from './MealLogger';
import MealSuggestions from './MealSuggestions';
import ThemeToggle from './ThemeToggle';
import { Trash2, User, LogOut, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const cardBaseStyle = "bg-white/20 backdrop-blur-xl rounded-2xl shadow-xl dark:bg-slate-800/20 border border-white/20 dark:border-slate-700/50";

// --- Weekly Trend Chart Component ---
interface TrendData {
  name: string; // Day of the week
  calories: number;
}

interface WeeklyTrendChartProps {
  data: TrendData[];
  theme: 'light' | 'dark';
}

const WeeklyTrendChart: React.FC<WeeklyTrendChartProps> = ({ data, theme }) => {
  const tooltipStyle = theme === 'dark' ? 
    {
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        backdropFilter: 'blur(4px)',
        border: '1px solid #475569',
        borderRadius: '0.5rem',
        color: '#f1f5f9',
    } : {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(4px)',
        border: '1px solid #e2e8f0',
        borderRadius: '0.5rem',
    };
  
  const axisStrokeColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const gridStrokeColor = theme === 'dark' ? 'rgba(51, 65, 85, 0.5)' : 'rgba(224, 231, 255, 0.5)';


  return (
    <div className={`${cardBaseStyle} p-6`}>
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 dark:text-slate-200">
        <TrendingUp className="w-5 h-5 text-blue-500 dark:text-blue-400" />
        <span>Weekly Calorie Trend</span>
      </h2>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} />
            <XAxis dataKey="name" stroke={axisStrokeColor} fontSize={12} />
            <YAxis stroke={axisStrokeColor} fontSize={12} />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ fill: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)' }}
            />
            <Bar dataKey="calories" fill={theme === 'dark' ? "#60a5fa" : "#3b82f6"} name="Calories Consumed" barSize={30} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};


// --- Dashboard Component ---
interface DashboardProps {
  userProfile: UserProfile;
  dailyTarget: number;
  loggedMeals: LoggedMeal[];
  mealSuggestions: MealSuggestion[];
  isLoadingSuggestions: boolean;
  onAddMeal: (meal: Meal) => void;
  onRemoveMeal: (mealId: number) => void;
  onRefreshSuggestions: () => void;
  onResetProfile: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  userProfile,
  dailyTarget,
  loggedMeals,
  mealSuggestions,
  isLoadingSuggestions,
  onAddMeal,
  onRemoveMeal,
  onRefreshSuggestions,
  onResetProfile,
  theme,
  onToggleTheme
}) => {
  const consumedCalories = loggedMeals
    .filter(meal => new Date(meal.date).toDateString() === new Date().toDateString())
    .reduce((acc, meal) => acc + meal.totalCalories, 0);

  const processWeeklyData = (meals: LoggedMeal[]) => {
    const dataPoints = new Map<string, number>();
    const dayLabels: string[] = [];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        dataPoints.set(dateString, 0);
        dayLabels.push(daysOfWeek[date.getDay()]);
    }
    
    meals.forEach(meal => {
        if (meal.date) {
            const mealDateString = new Date(meal.date).toISOString().split('T')[0];
            if (dataPoints.has(mealDateString)) {
                const currentCalories = dataPoints.get(mealDateString) || 0;
                dataPoints.set(mealDateString, currentCalories + meal.totalCalories);
            }
        }
    });

    return Array.from(dataPoints.values()).map((calories, index) => ({
        name: dayLabels[index],
        calories: calories,
    }));
  };

  const weeklyData = processWeeklyData(loggedMeals);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-fade-in">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">Hello!</h1>
          <p className="text-slate-600 dark:text-slate-400">Here's your nutritional summary for today.</p>
        </div>
        <div className="flex items-center gap-4">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <button onClick={onResetProfile} className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors dark:text-slate-400 dark:hover:text-blue-400">
                <LogOut className="w-4 h-4" /> Reset Profile
            </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <CalorieTracker consumed={consumedCalories} target={dailyTarget} theme={theme} />
          <MealLogger onAddMeal={onAddMeal} />
          <WeeklyTrendChart data={weeklyData} theme={theme} />
          <div className={`${cardBaseStyle} p-6`}>
            <h2 className="text-xl font-semibold mb-4 dark:text-slate-200">Today's Log</h2>
            {loggedMeals.filter(m => new Date(m.date).toDateString() === new Date().toDateString()).length === 0 ? (
              <p className="text-slate-500 text-center py-4 dark:text-slate-400">No meals logged today. Add a meal to get started!</p>
            ) : (
              <ul className="space-y-2">
                {loggedMeals.filter(m => new Date(m.date).toDateString() === new Date().toDateString()).map(meal => (
                  <li key={meal.id} className="flex justify-between items-start p-4 border-b border-slate-200/50 dark:border-slate-700/50 last:border-b-0">
                    <div>
                      <p className="font-semibold dark:text-slate-200">{meal.items.map(item => item.name).join(', ')}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{meal.items.map(i => `${i.name} (${i.calories} kcal)`).join(' • ')}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                       <p className="font-bold text-blue-600 dark:text-blue-400">{meal.totalCalories} kcal</p>
                       <button onClick={() => onRemoveMeal(meal.id)} className="text-red-500 hover:text-red-700 mt-1 transition-colors">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Column (Suggestions) */}
        <div className="space-y-8">
          <MealSuggestions 
            suggestions={mealSuggestions} 
            isLoading={isLoadingSuggestions}
            onRefresh={onRefreshSuggestions}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;