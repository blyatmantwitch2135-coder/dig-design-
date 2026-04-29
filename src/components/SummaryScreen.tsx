import React from 'react';
import { motion } from 'motion/react';
import { Profile, Task } from '../types';

interface SummaryScreenProps {
  profile: Profile | null;
  tasks: Task[];
}

export function SummaryScreen({ profile, tasks }: SummaryScreenProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const remainingTasks = totalTasks - completedTasks;
  
  const totalMinutes = tasks.reduce((acc, curr) => acc + (curr.completed ? 0 : curr.estimatedTime), 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Feedback logic
  let feedbackMessage = "On Track";
  let feedbackColor = "bg-indigo-100 text-indigo-700";
  
  if (totalTasks === 0) {
    feedbackMessage = "No tasks yet.";
    feedbackColor = "bg-slate-100 text-slate-500";
  } else if (remainingTasks === 0) {
    feedbackMessage = "All clear! Nice work.";
    feedbackColor = "bg-green-100 text-green-700";
  } else if (remainingTasks > 5) {
    feedbackMessage = "Heavy workload!";
    feedbackColor = "bg-rose-100 text-rose-700";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[550px]"
    >
      <div className="col-span-1 md:col-span-2 glass-panel p-8 flex flex-col justify-between">
        <div className="flex justify-between">
          <div className="space-y-1">
            <p className="text-slate-500 font-medium">Study Statistics</p>
            <h2 className="text-4xl font-bold text-slate-800">
              {profile?.name || 'Student Name'}
            </h2>
          </div>
          <div className="text-right">
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${feedbackColor}`}>
              {feedbackMessage}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-white/40 p-6 rounded-3xl border border-white/50">
            <p className="text-slate-400 text-xs font-bold uppercase mb-1">Total</p>
            <p className="text-3xl font-bold text-slate-800">{totalTasks}</p>
          </div>
          <div className="bg-white/40 p-6 rounded-3xl border border-white/50">
            <p className="text-green-500/70 text-xs font-bold uppercase mb-1">Done</p>
            <p className="text-3xl font-bold text-slate-800">{completedTasks}</p>
          </div>
          <div className="bg-white/40 p-6 rounded-3xl border border-white/50">
            <p className="text-orange-500/70 text-xs font-bold uppercase mb-1">Pending</p>
            <p className="text-3xl font-bold text-slate-800">{remainingTasks}</p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/20">
          <p className="text-slate-400 text-sm font-bold uppercase mb-4">Total Estimated Workload</p>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-light text-slate-800">{hours}</span>
            <span className="text-lg font-bold text-slate-400 pb-1">HOURS</span>
            <span className="text-5xl font-light text-slate-800 ml-4">{minutes}</span>
            <span className="text-lg font-bold text-slate-400 pb-1">MIN</span>
          </div>
        </div>
      </div>
      
      <div className="glass-panel p-8 flex flex-col">
        <h3 className="font-bold text-slate-800 mb-6">Profile Info</h3>
        <div className="space-y-6 flex-1">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-bold uppercase">Student Level</p>
            <p className="text-lg font-medium text-slate-700">
              {profile?.grade || 'Not Set'}
            </p>
          </div>
          <div className="p-6 bg-indigo-600 rounded-3xl text-white shadow-xl shadow-indigo-100 mt-auto hidden md:block">
            <p className="text-[10px] font-bold uppercase opacity-60 mb-2">Daily Tip</p>
            <p className="text-sm leading-relaxed">
              Break your sessions into 25-minute sprints using the Pomodoro technique for better focus.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
