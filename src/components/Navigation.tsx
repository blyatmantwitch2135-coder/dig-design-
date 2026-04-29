import React from 'react';
import { User, PlusCircle, ListTodo, BarChart2 } from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onChangeView: (view: string) => void;
}

export function Navigation({ currentView, onChangeView }: NavigationProps) {
  const navItems = [
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
    { id: 'add', label: 'Add Task', icon: <PlusCircle size={20} /> },
    { id: 'list', label: 'Tasks', icon: <ListTodo size={20} /> },
    { id: 'summary', label: 'Summary', icon: <BarChart2 size={20} /> },
  ];

  return (
    <nav className="glass-panel p-1.5 flex rounded-2xl gap-1">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onChangeView(item.id)}
          className={`flex items-center gap-2 nav-btn ${
            currentView === item.id 
              ? 'nav-btn-active' 
              : 'hover:bg-white/30 hover:text-slate-900'
          }`}
        >
          {item.icon}
          <span className="hidden sm:inline">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
