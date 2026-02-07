import React, { useState, useEffect } from 'react';
import { Calendar, Users, MapPin, Clock, MessageSquare } from 'lucide-react';
import TaskList from './TaskList';

const TasksManager = ({ shift, date, vendeurs = [] }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    type: 'task',
    priority: 'medium',
    assignedTo: '',
    dueDate: date,
    dueTime: '',
    shift: shift,
    status: 'pending',
    category: 'operations'
  });

  useEffect(() => {
    const savedTasks = localStorage.getItem(`tasks_${date}`);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      const sampleTasks = getSampleTasks(date, vendeurs);
      setTasks(sampleTasks);
      localStorage.setItem(`tasks_${date}`, JSON.stringify(sampleTasks));
    }
  }, [date, vendeurs]);

  useEffect(() => {
    localStorage.setItem(`tasks_${date}`, JSON.stringify(tasks));
  }, [tasks, date]);

  const getSampleTasks = (currentDate, vendeurs) => {
    return [
      {
        id: 1,
        title: 'Weekly Staff Meeting',
        description: 'Discuss weekly performance, safety protocols, and schedule',
        type: 'meeting',
        priority: 'high',
        assignedTo: vendeurs[0] || 'Manager',
        dueDate: currentDate,
        dueTime: '09:00',
        shift: 'AM',
        status: 'pending',
        category: 'management',
        location: 'Main Office',
        attendees: vendeurs.length > 0 ? vendeurs : ['Manager', 'Supervisor'],
        agenda: '1. Weekly review\n2. Safety updates\n3. Schedule planning',
        notes: 'Bring performance reports',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Safety Committee Meeting',
        description: 'Monthly safety committee review',
        type: 'meeting',
        priority: 'critical',
        assignedTo: vendeurs[0] || 'Manager',
        dueDate: currentDate,
        dueTime: '14:00',
        shift: 'PM',
        status: 'pending',
        category: 'safety',
        location: 'Conference Room',
        attendees: ['Manager', 'All Supervisors'],
        agenda: '1. Incident review\n2. Training updates\n3. Equipment check',
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        title: 'Check Fuel Pumps',
        description: 'Daily maintenance check',
        type: 'task',
        priority: 'medium',
        assignedTo: vendeurs[1] || 'Technician',
        dueDate: currentDate,
        dueTime: '08:00',
        shift: 'AM',
        status: 'pending',
        category: 'maintenance',
        createdAt: new Date().toISOString()
      }
    ];
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const taskToAdd = {
      ...newTask,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      attendees: newTask.type === 'meeting' ? ['Manager', ...vendeurs] : [],
      agenda: newTask.type === 'meeting' ? 'Meeting agenda points...' : ''
    };

    setTasks([...tasks, taskToAdd]);
    setNewTask({
      title: '',
      type: 'task',
      priority: 'medium',
      assignedTo: '',
      dueDate: date,
      dueTime: '',
      shift: shift,
      status: 'pending',
      category: 'operations'
    });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'type' && value === 'meeting' ? {
        location: 'Main Office',
        attendees: ['Manager', ...vendeurs]
      } : {})
    }));
  };

  return (
    <div className="p-2 space-y-2 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-2 bg-white border rounded">
        <h1 className="text-lg font-bold">Tasks Manager</h1>
        <div className="flex items-center gap-4 text-xs text-gray-600 mt-1">
          <span>{date}</span>
          <span>•</span>
          <span>{shift} Shift</span>
          <span>•</span>
          <span>{tasks.length} tasks</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-2">
        <div className="p-2 bg-white border rounded text-center">
          <div className="text-xs text-gray-500">Total</div>
          <div className="text-sm font-bold">{tasks.length}</div>
        </div>
        <div className="p-2 bg-white border rounded text-center">
          <div className="text-xs text-gray-500">Meetings</div>
          <div className="text-sm font-bold text-blue-600">
            {tasks.filter(t => t.type === 'meeting').length}
          </div>
        </div>
        <div className="p-2 bg-white border rounded text-center">
          <div className="text-xs text-gray-500">Pending</div>
          <div className="text-sm font-bold text-yellow-600">
            {tasks.filter(t => t.status === 'pending').length}
          </div>
        </div>
        <div className="p-2 bg-white border rounded text-center">
          <div className="text-xs text-gray-500">Completed</div>
          <div className="text-sm font-bold text-green-600">
            {tasks.filter(t => t.status === 'completed').length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        {/* Add Task Form */}
        <div className="lg:col-span-1">
          <div className="p-2 bg-white border rounded">
            <h2 className="text-sm font-bold mb-2">Add New Task</h2>
            
            <form onSubmit={handleAddTask} className="space-y-2">
              <input
                type="text"
                name="title"
                value={newTask.title}
                onChange={handleChange}
                placeholder="Task title"
                className="w-full p-2 border rounded text-sm"
                required
              />

              <div className="grid grid-cols-2 gap-2">
                <select
                  name="type"
                  value={newTask.type}
                  onChange={handleChange}
                  className="p-2 border rounded text-sm"
                >
                  <option value="task">Task</option>
                  <option value="meeting">Meeting</option>
                </select>

                <select
                  name="priority"
                  value={newTask.priority}
                  onChange={handleChange}
                  className="p-2 border rounded text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              {newTask.type === 'meeting' && (
                <div className="space-y-2 p-2 bg-blue-50 rounded border">
                  <div className="flex items-center gap-1 text-xs font-medium text-blue-700">
                    <Users className="w-3 h-3" />
                    <span>Meeting Details</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      name="location"
                      value={newTask.location || 'Main Office'}
                      onChange={handleChange}
                      className="p-1 border rounded text-xs"
                    >
                      <option value="Main Office">Main Office</option>
                      <option value="Conference Room">Conference Room</option>
                      <option value="Training Room">Training Room</option>
                      <option value="Break Room">Break Room</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Attendees"
                      value={newTask.attendees?.join(', ') || ''}
                      onChange={(e) => setNewTask(prev => ({
                        ...prev,
                        attendees: e.target.value.split(',').map(a => a.trim())
                      }))}
                      className="p-1 border rounded text-xs"
                    />
                  </div>

                  <textarea
                    name="agenda"
                    value={newTask.agenda || ''}
                    onChange={handleChange}
                    placeholder="Meeting agenda points..."
                    rows="2"
                    className="w-full p-1 border rounded text-xs"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <select
                  name="assignedTo"
                  value={newTask.assignedTo}
                  onChange={handleChange}
                  className="p-2 border rounded text-sm"
                >
                  <option value="">Assign to</option>
                  <option value="Manager">Manager</option>
                  {vendeurs.map((v, i) => (
                    <option key={i} value={v}>{v}</option>
                  ))}
                </select>

                <select
                  name="shift"
                  value={newTask.shift}
                  onChange={handleChange}
                  className="p-2 border rounded text-sm"
                >
                  <option value="AM">AM Shift</option>
                  <option value="PM">PM Shift</option>
                  <option value="Both">Both</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  name="dueDate"
                  value={newTask.dueDate}
                  onChange={handleChange}
                  className="p-2 border rounded text-sm"
                />
                <input
                  type="time"
                  name="dueTime"
                  value={newTask.dueTime}
                  onChange={handleChange}
                  className="p-2 border rounded text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full p-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
              >
                Add Task
              </button>
            </form>
          </div>
        </div>

        {/* Tasks List */}
        <div className="lg:col-span-2">
          <TaskList 
            tasks={tasks}
            onDelete={handleDeleteTask}
            onToggleComplete={handleToggleComplete}
            vendeurs={vendeurs}
          />
        </div>
      </div>
    </div>
  );
};

export default TasksManager;