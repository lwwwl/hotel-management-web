import { useState } from 'react';
import { Task } from '../types';

// 初始任务数据
const initialTasks: Task[] = [
  {
    id: 1,
    roomNumber: '301',
    title: '需要加毛巾',
    description: '客人需要额外毛巾',
    department: 'housekeeping',
    priority: 'medium',
    status: 'pending',
    createdAt: '2小时前'
  },
  {
    id: 2,
    roomNumber: '205',
    title: '空调维修',
    description: '空调不制冷需要维修',
    department: 'maintenance',
    priority: 'high',
    status: 'in_progress',
    createdAt: '1小时前'
  },
  {
    id: 3,
    roomNumber: '408',
    title: '客房清洁',
    description: '客房深度清洁完成',
    department: 'housekeeping',
    priority: 'low',
    status: 'review',
    createdAt: '30分钟前'
  },
  {
    id: 4,
    roomNumber: '102',
    title: 'WiFi问题',
    description: 'WiFi密码重置完成',
    department: 'maintenance',
    priority: 'medium',
    status: 'completed',
    createdAt: '2小时前'
  },
  {
    id: 5,
    roomNumber: '315',
    title: '房间设备故障',
    description: '电视无法开机',
    department: 'maintenance',
    priority: 'high',
    status: 'pending',
    createdAt: '3小时前'
  }
];

export function useTasks(filters: { department: string; priority: string }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  
  const getColumnTasks = (status: Task['status']) => {
    let filtered = tasks.filter(task => task.status === status);
    
    if (filters.department) {
      filtered = filtered.filter(task => task.department === filters.department);
    }
    
    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }
    
    return filtered;
  };

  const getColumnCount = (status: Task['status']) => {
    return getColumnTasks(status).length;
  };

  const updateTaskStatus = (task: Task, newStatus: Task['status']) => {
    const updatedTasks = tasks.map(t => 
      t.id === task.id ? { ...t, status: newStatus } : t
    );
    setTasks(updatedTasks);
  };

  const createNewTask = (newTask: Omit<Task, 'id' | 'status' | 'createdAt'>) => {
    const task: Task = {
      id: Date.now(),
      ...newTask,
      status: 'pending',
      createdAt: '刚刚'
    };
    
    setTasks([...tasks, task]);
    return task;
  };
  
  return { 
    tasks, 
    setTasks, 
    getColumnTasks, 
    getColumnCount, 
    updateTaskStatus,
    createNewTask
  };
} 