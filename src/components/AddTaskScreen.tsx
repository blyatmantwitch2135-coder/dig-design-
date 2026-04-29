import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Task, Priority } from '../types';

interface AddTaskScreenProps {
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  onGoToList: () => void;
}

export function AddTaskScreen({ onAddTask, onGoToList }: AddTaskScreenProps) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!dueDate) newErrors.dueDate = 'Due date is required';
    
    const timeNum = parseInt(estimatedTime, 10);
    if (isNaN(timeNum) || timeNum <= 0) {
      newErrors.estimatedTime = 'Time must be > 0';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onAddTask({
      title: title.trim(),
      subject: subject.trim() || 'General',
      dueDate,
      estimatedTime: timeNum,
      priority,
    });
    
    // Switch to list view after adding
    onGoToList();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="glass-panel p-10 max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-slate-800 mb-6">New Assignment</h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Task Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`glass-input ${errors.title ? 'border-red-400 ring-1 ring-red-400' : ''}`}
            placeholder="Submit History Essay"
          />
          {errors.title && <span className="text-red-500 text-xs ml-1">{errors.title}</span>}
        </div>

        <div className="col-span-2 md:col-span-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="glass-input"
            placeholder="History 101"
          />
        </div>

        <div className="col-span-2 md:col-span-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={`glass-input min-h-[46px] ${errors.dueDate ? 'border-red-400 ring-1 ring-red-400' : ''}`}
          />
          {errors.dueDate && <span className="text-red-500 text-xs ml-1">{errors.dueDate}</span>}
        </div>

        <div className="col-span-2 md:col-span-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Est. Time (min)</label>
          <input
            type="number"
            value={estimatedTime}
            onChange={(e) => setEstimatedTime(e.target.value)}
            className={`glass-input ${errors.estimatedTime ? 'border-red-400 ring-1 ring-red-400' : ''}`}
            placeholder="45"
            min="1"
          />
          {errors.estimatedTime && <span className="text-red-500 text-xs ml-1">{errors.estimatedTime}</span>}
        </div>

        <div className="col-span-2 md:col-span-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="glass-input appearance-none min-h-[46px]"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="col-span-2 pt-4">
          <button type="submit" className="glass-btn-dark h-14">
            Create Task
          </button>
        </div>
      </form>
    </motion.div>
  );
}
