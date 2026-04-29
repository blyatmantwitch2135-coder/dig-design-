import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Profile } from '../types';

interface ProfileScreenProps {
  profile: Profile | null;
  onSaveProfile: (profile: Profile) => void;
}

export function ProfileScreen({ profile, onSaveProfile }: ProfileScreenProps) {
  const [name, setName] = useState(profile?.name || '');
  const [grade, setGrade] = useState(profile?.grade || '');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setGrade(profile.grade);
    }
  }, [profile]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      setSaved(false);
      return;
    }
    
    setError('');
    onSaveProfile({ name: name.trim(), grade: grade.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="glass-panel p-10 max-w-lg mx-auto flex flex-col items-center justify-center text-center"
    >
      <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full mb-6 flex items-center justify-center shadow-2xl">
        <span className="text-white text-4xl">
          {profile?.name ? profile.name.charAt(0).toUpperCase() : '?'}
        </span>
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Create Your Profile</h2>
      <p className="text-slate-500 mb-8">
        {profile?.name ? `Welcome back, ${profile.name}!` : 'Tell us who you are to start tracking tasks.'}
      </p>

      <form onSubmit={handleSave} className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-1 text-left">
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="glass-input"
            placeholder="Your Full Name"
          />
          {error && <span className="text-red-500 text-sm ml-1">{error}</span>}
        </div>

        <div className="flex flex-col gap-1 text-left">
          <input
            id="grade"
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="glass-input"
            placeholder="Grade / Year (e.g. Sophomore)"
          />
        </div>

        <button type="submit" className="glass-btn mt-2 h-14 relative overflow-hidden">
          {saved ? 'Saved!' : 'Save Profile'}
        </button>
      </form>
    </motion.div>
  );
}
