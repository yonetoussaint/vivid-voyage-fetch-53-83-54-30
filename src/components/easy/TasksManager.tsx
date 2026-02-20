// TasksManager.jsx - Update to use filterType
import React, { useState, useEffect } from 'react';
import TaskList from './TaskList';

const TasksManager = ({ shift, date, vendeurs = [], filterType = 'all' }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const savedTasks = localStorage.getItem(`gasStationTasks_${date}`);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      // Sample tasks if needed
      setTasks([]);
    }
  }, [date]);

  // Filter tasks based on filterType
  const getFilteredTasks = () => {
    switch(filterType) {
      case 'all':
        return tasks;
      case 'tasks':
        return tasks; // Show all tasks
      case 'incidents':
        return tasks.filter(task => task.category === 'incident');
      case 'inspections':
        return tasks.filter(task => task.category === 'inspection');
      case 'dépenses':
        return tasks.filter(task => task.category === 'expense');
      case 'payments':
        return tasks.filter(task => task.category === 'payment');
      case 'appels':
        return tasks.filter(task => task.category === 'call');
      case 'messages':
        return tasks.filter(task => task.category === 'message');
      case 'emails':
        return tasks.filter(task => task.category === 'email');
      case 'pending':
        return tasks.filter(task => task.status === 'pending');
      case 'completed':
        return tasks.filter(task => task.status === 'completed');
      case 'urgent':
      case 'critical':
        return tasks.filter(task => task.priority === 'critical' || task.priority === 'high');
      default:
        return tasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  const handleDeleteTask = (id) => {
    if (window.confirm('Delete this task?')) {
      const updatedTasks = tasks.filter(task => task.id !== id);
      setTasks(updatedTasks);
      localStorage.setItem(`gasStationTasks_${date}`, JSON.stringify(updatedTasks));
    }
  };

  const handleUpdateTask = (id, updates) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem(`gasStationTasks_${date}`, JSON.stringify(updatedTasks));
  };

  return (
    <div className="space-y-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-700">
          {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
        </h2>
      </div>
      
      <TaskList 
        tasks={filteredTasks}
        onDelete={handleDeleteTask}
        onUpdateTask={handleUpdateTask}
      />
    </div>
  );
};

export default TasksManager;