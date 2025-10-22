import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Target, Flame, MinusCircle } from 'lucide-react';

interface CalorieTrackerProps {
  consumed: number;
  target: number;
  theme: 'light' | 'dark';
}

const CalorieTracker: React.FC<CalorieTrackerProps> = ({ consumed, target, theme }) => {
  const remaining = Math.max(0, target - consumed);
  const percentage = target > 0 ? Math.min((consumed / target) * 100, 100) : 0;
  
  const data = [
    { name: 'Consumed', value: consumed },
    { name: 'Remaining', value: remaining },
  ];

  const COLORS = theme === 'dark' ? ['#60a5fa', '#334155'] : ['#3b82f6', '#e0e7ff'];

  return (
    <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-xl p-6 dark:bg-slate-800/20 border border-white/20 dark:border-slate-700/50">
      <h2 className="text-xl font-semibold mb-4 dark:text-slate-200">Calorie Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6">
        <div className="relative w-40 h-40 mx-auto">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={70}
                startAngle={90}
                endAngle={450}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                <Cell key={`cell-0`} fill={COLORS[0]} />
                <Cell key={`cell-1`} fill={COLORS[1]} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
             <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{Math.round(percentage)}%</span>
             <span className="text-sm text-slate-500 dark:text-slate-400">of target</span>
          </div>
        </div>
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center md:text-left">
            <div className="bg-blue-500/10 p-4 rounded-lg">
                <Target className="w-6 h-6 text-blue-500 dark:text-blue-400 mx-auto md:mx-0 mb-1" />
                <p className="text-sm text-slate-600 dark:text-slate-400">Daily Target</p>
                <p className="text-lg font-bold dark:text-slate-100">{target} kcal</p>
            </div>
            <div className="bg-orange-500/10 p-4 rounded-lg">
                <Flame className="w-6 h-6 text-orange-500 dark:text-orange-400 mx-auto md:mx-0 mb-1" />
                <p className="text-sm text-slate-600 dark:text-slate-400">Consumed</p>
                <p className="text-lg font-bold dark:text-slate-100">{consumed} kcal</p>
            </div>
             <div className="bg-indigo-500/10 p-4 rounded-lg">
                <MinusCircle className="w-6 h-6 text-indigo-500 dark:text-indigo-400 mx-auto md:mx-0 mb-1" />
                <p className="text-sm text-slate-600 dark:text-slate-400">Remaining</p>
                <p className="text-lg font-bold dark:text-slate-100">{remaining} kcal</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CalorieTracker;