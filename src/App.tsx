/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { collection, doc, query, where, onSnapshot, setDoc, updateDoc, deleteDoc, serverTimestamp, getDoc } from 'firebase/firestore';

import { Navigation } from './components/Navigation';
import { ProfileScreen } from './components/ProfileScreen';
import { AddTaskScreen } from './components/AddTaskScreen';
import { TaskListScreen } from './components/TaskListScreen';
import { SummaryScreen } from './components/SummaryScreen';
import { AuthScreen } from './components/AuthScreen';
import { Profile, Task } from './types';
import { LogOut } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('profile');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setTasks([]);
      return;
    }

    // Load Profile
    const profileRef = doc(db, 'users', user.uid);
    const unsubProfile = onSnapshot(profileRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setProfile({ name: data.name, grade: data.grade });
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'users');
    });

    // Load Tasks
    const q = query(collection(db, 'users', user.uid, 'tasks'), where('userId', '==', user.uid));
    const unsubTasks = onSnapshot(q, (snap) => {
      const fetchedTasks = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      setTasks(fetchedTasks);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'tasks');
    });

    return () => {
      unsubProfile();
      unsubTasks();
    };
  }, [user]);

  const handleSaveProfile = async (newProfile: Profile) => {
    if (!user) return;
    try {
      const profileRef = doc(db, 'users', user.uid);
      const snap = await getDoc(profileRef);
      if (snap.exists()) {
        await updateDoc(profileRef, {
          name: newProfile.name,
          grade: newProfile.grade,
          updatedAt: serverTimestamp()
        });
      } else {
        await setDoc(profileRef, {
          userId: user.uid,
          name: newProfile.name,
          grade: newProfile.grade,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      setProfile(newProfile);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'users');
    }
  };

  const handleAddTask = async (newTaskData: Omit<Task, 'id' | 'completed'>) => {
    if (!user) return;
    const taskId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    try {
      const taskRef = doc(db, 'users', user.uid, 'tasks', taskId);
      await setDoc(taskRef, {
        userId: user.uid,
        ...newTaskData,
        completed: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'tasks');
    }
  };

  const handleToggleComplete = async (id: string) => {
    if (!user) return;
    const taskData = tasks.find(t => t.id === id);
    if (!taskData) return;
    try {
      const taskRef = doc(db, 'users', user.uid, 'tasks', id);
      await updateDoc(taskRef, {
        completed: !taskData.completed,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'tasks');
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!user) return;
    try {
      const taskRef = doc(db, 'users', user.uid, 'tasks', id);
      await deleteDoc(taskRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'tasks');
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  if (!authReady) return null;

  if (!user) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <AuthScreen />
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'profile':
        return <ProfileScreen profile={profile} onSaveProfile={handleSaveProfile} />;
      case 'add':
        return <AddTaskScreen onAddTask={handleAddTask} onGoToList={() => setCurrentView('list')} />;
      case 'list':
        return (
          <TaskListScreen 
            tasks={tasks} 
            onToggleComplete={handleToggleComplete} 
            onDeleteTask={handleDeleteTask} 
          />
        );
      case 'summary':
        return <SummaryScreen profile={profile} tasks={tasks} />;
      default:
        return <ProfileScreen profile={profile} onSaveProfile={handleSaveProfile} />;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        <header className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">
              S
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">StudentPlanner</h1>
          </div>
          <Navigation currentView={currentView} onChangeView={setCurrentView} />
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors text-sm font-semibold"
          >
            <LogOut size={16} /> Sign out
          </button>
        </header>
        
        <main className="flex-1 relative">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
