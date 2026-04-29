import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle, Trash2, Clock, Calendar, BookOpen, AlertCircle } from 'lucide-react';
import { Task } from '../types';

interface TaskListScreenProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function TaskListScreen({ tasks, onToggleComplete, onDeleteTask }: TaskListScreenProps) {
  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-panel flex flex-col h-[550px] overflow-hidden"
      >
        <div className="p-8 border-b border-white/20 flex justify-between items-center shrink-0">
          <h2 className="text-2xl font-bold text-slate-800">Assignment List</h2>
          <span className="bg-white/50 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
            0 Tasks
          </span>
        </div>
        <div className="flex-1 flex items-center justify-center text-slate-400 p-8 text-center">
          No tasks added yet. Head to Add Task!
        </div>
      </motion.div>
    );
  }

  const priorityColors = {
    High: 'text-rose-500 bg-rose-100/50 border-rose-200',
    Medium: 'text-amber-600 bg-amber-100/50 border-amber-200',
    Low: 'text-emerald-600 bg-emerald-100/50 border-emerald-200',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-panel flex flex-col h-[550px] overflow-hidden"
    >
      <div className="p-8 border-b border-white/20 flex justify-between items-center shrink-0">
        <h2 className="text-2xl font-bold text-slate-800">Assignment List</h2>
        <span className="bg-white/50 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
          {tasks.length} Task{tasks.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-4 content-start [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-thumb]:bg-black/10 [&::-webkit-scrollbar-thumb]:rounded-full">
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-5 rounded-2xl bg-white/60 border border-white shadow-sm flex flex-col justify-between transition-all hover:shadow-md priority-${task.priority} ${
                task.completed ? 'opacity-50 grayscale-[0.5]' : ''
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">
                    {task.subject}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {task.dueDate}
                  </span>
                </div>
                <h3 className={`font-bold text-slate-800 ${task.completed ? 'line-through text-slate-400' : ''}`}>
                  {task.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2">
                  ⏳ {task.estimatedTime} min • {task.priority}
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => onToggleComplete(task.id)}
                  className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-colors ${
                    task.completed 
                      ? 'bg-slate-200 text-slate-600 hover:bg-slate-300' 
                      : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                  }`}
                >
                  {task.completed ? 'Undo' : 'Complete'}
                </button>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="px-3 py-2 text-[10px] font-bold rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                  aria-label="Delete task"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
