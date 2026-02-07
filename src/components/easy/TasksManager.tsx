import React, { useState, useEffect } from 'react';
import TaskList from './TaskList';
import AddTaskForm from './AddTaskForm';
import { getSampleTasks } from './taskUtils';

const TasksManager = ({ shift, date, vendeurs = [] }) => {
  const [tasks, setTasks] = useState([]);
  const [showCompleted, setShowCompleted] = useState(true);

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem(`tasks_${date}`);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      const sampleTasks = getSampleTasks(date);
      setTasks(sampleTasks);
      localStorage.setItem(`tasks_${date}`, JSON.stringify(sampleTasks));
    }
  }, [date]);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem(`tasks_${date}`, JSON.stringify(tasks));
  }, [tasks, date]);

  const handleAddTask = (newTask) => {
    const taskToAdd = {
      ...newTask,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      dueDate: newTask.dueDate || date,
      assignedTo: newTask.assignedTo || 'All',
      status: 'pending'
    };

    setTasks([...tasks, taskToAdd]);
  };

  const handleDeleteTask = (id) => {
    if (window.confirm('Delete this task?')) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const handleToggleComplete = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        return {
          ...task,
          status: newStatus,
          completedAt: newStatus === 'completed' ? new Date().toISOString() : null
        };
      }
      return task;
    }));
  };

  const filteredTasks = showCompleted 
    ? tasks 
    : tasks.filter(task => task.status !== 'completed');

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tasks Manager</h1>
        <p className="text-gray-600">{date} • {shift} Shift</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AddTaskForm 
            date={date}
            shift={shift}
            vendeurs={vendeurs}
            onAddTask={handleAddTask}
          />
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow border">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Tasks ({filteredTasks.length})
                </h2>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showCompleted}
                    onChange={(e) => setShowCompleted(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Show Completed</span>
                </label>
              </div>
            </div>

            <TaskList 
              tasks={filteredTasks}
              onDelete={handleDeleteTask}
              onToggleComplete={handleToggleComplete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksManager;