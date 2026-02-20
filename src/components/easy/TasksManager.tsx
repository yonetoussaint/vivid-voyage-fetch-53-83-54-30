// TasksManager.jsx - Using MeetingList component
import React, { useState, useEffect } from 'react';
import MeetingList from './MeetingList'; // Reusing the same MeetingList component

const TasksManager = ({ shift, date, vendeurs = [], filterType = 'all' }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const savedTasks = localStorage.getItem(`gasStationTasks_${date}`);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      // Sample tasks if needed
      const sampleTasks = [
        {
          id: 1,
          description: 'Check pump calibration',
          dueDate: date,
          dueTime: '08:00',
          shift: 'AM',
          status: 'pending',
          meetingType: 'task', // Using meetingType field to distinguish
          category: 'inspection',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          description: 'Call supplier about fuel delivery',
          dueDate: date,
          dueTime: '10:30',
          shift: 'AM',
          status: 'pending',
          meetingType: 'task',
          category: 'appels',
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          description: 'Submit incident report',
          dueDate: date,
          dueTime: '15:00',
          shift: 'PM',
          status: 'pending',
          meetingType: 'task',
          category: 'incident',
          createdAt: new Date().toISOString()
        }
      ];
      setTasks(sampleTasks);
      localStorage.setItem(`gasStationTasks_${date}`, JSON.stringify(sampleTasks));
    }
  }, [date]);

  // Filter tasks based on filterType
  const getFilteredTasks = () => {
    switch(filterType) {
      case 'all':
      case 'tasks': // Show all tasks
        return tasks;
      case 'incidents':
        return tasks.filter(task => task.category === 'incident');
      case 'inspections':
        return tasks.filter(task => task.category === 'inspection');
      case 'dépenses':
        return tasks.filter(task => task.category === 'expense');
      case 'payments':
        return tasks.filter(task => task.category === 'payment');
      case 'appels':
        return tasks.filter(task => task.category === 'appels' || task.category === 'call');
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
      
      {/* Using the same MeetingList component */}
      <MeetingList 
        meetings={filteredTasks}
        onDelete={handleDeleteTask}
        onUpdateMeeting={handleUpdateTask}
      />
    </div>
  );
};

export default TasksManager;