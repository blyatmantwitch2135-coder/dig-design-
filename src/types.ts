export interface Profile {
  name: string;
  grade: string;
}

export type Priority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  estimatedTime: number; // in minutes
  priority: Priority;
  completed: boolean;
}
