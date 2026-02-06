// components/easy/TasksManager.jsx
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Circle,
  User,
  Filter,
  Plus,
  Trash2,
  Edit,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const TasksManager = ({ shift, date, vendeurs = [] }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    type: 'task', // task, reminder, meeting, todo
    priority: 'medium', // low, medium, high, critical
    assignedTo: '',
    dueDate: '',
    dueTime: '',
    shift: 'AM',
    status: 'pending' // pending, in-progress, completed, cancelled
  });
  const [filter, setFilter] = useState('all');
  const [expandedTask, setExpandedTask] = useState(null);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem(`gasStationTasks_${date}`);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      // Initialize with sample tasks
      const sampleTasks = [
        {
          id: 1,
          title: 'Weekly Staff Meeting',
          description: 'Discuss weekly performance, safety protocols, and schedule',
          type: 'meeting',
          priority: 'high',
          assignedTo: 'Manager',
          dueDate: date,
          dueTime: '09:00',
          shift: 'AM',
          status: 'pending',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Check Fire Extinguishers',
          description: 'Monthly inspection of all fire extinguishers',
          type: 'reminder',
          priority: 'critical',
          assignedTo: 'All',
          dueDate: date,
          dueTime: '10:00',
          shift: 'AM',
          status: 'pending',
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          title: 'Order Fuel Delivery',
          description: 'Place order for regular unleaded and diesel',
          type: 'task',
          priority: 'high',
          assignedTo: 'Manager',
          dueDate: date,
          dueTime: '14:00',
          shift: 'PM',
          status: 'pending',
          createdAt: new Date().toISOString()
        },
        {
          id: 4,
          title: 'Clean Restrooms',
          description: 'Hourly check and cleaning of customer restrooms',
          type: 'todo',
          priority: 'medium',
          assignedTo: 'Attendant',
          dueDate: date,
          dueTime: '11:00',
          shift: 'AM',
          status: 'completed',
          createdAt: new Date().toISOString(),
          completedAt: new Date().toISOString()
        }
      ];
      setTasks(sampleTasks);
      localStorage.setItem(`gasStationTasks_${date}`, JSON.stringify(sampleTasks));
    }
  }, [date]);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`gasStationTasks_${date}`, JSON.stringify(tasks));
  }, [tasks, date]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const taskToAdd = {
      ...newTask,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      dueDate: newTask.dueDate || date
    };

    setTasks([...tasks, taskToAdd]);
    
    // Reset form
    setNewTask({
      title: '',
      description: '',
      type: 'task',
      priority: 'medium',
      assignedTo: '',
      dueDate: '',
      dueTime: '',
      shift: shift,
      status: 'pending'
    });
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
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

  const handlePriorityChange = (id, priority) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, priority } : task
    ));
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'meeting': return <Calendar className="w-4 h-4" />;
      case 'reminder': return <AlertCircle className="w-4 h-4" />;
      case 'todo': return <Circle className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'cancelled': return 'bg-gray-500';
      default: return 'bg-yellow-500';
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'shift') return task.shift === shift;
    if (filter === 'today') return task.dueDate === date;
    if (filter === 'pending') return task.status === 'pending';
    if (filter === 'completed') return task.status === 'completed';
    if (filter === 'meetings') return task.type === 'meeting';
    if (filter === 'critical') return task.priority === 'critical';
    return true;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    critical: tasks.filter(t => t.priority === 'critical').length,
    meetings: tasks.filter(t => t.type === 'meeting').length
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Tasks & Reminders</h1>
          <div className="flex items-center space-x-2 text-sm">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
              {date}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full">
              Shift: {shift}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <div className="bg-white p-3 rounded-lg shadow border">
            <div className="text-sm text-gray-500">Total Tasks</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow border border-green-200">
            <div className="text-sm text-gray-500">Completed</div>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow border border-yellow-200">
            <div className="text-sm text-gray-500">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow border border-red-200">
            <div className="text-sm text-gray-500">Critical</div>
            <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow border border-blue-200">
            <div className="text-sm text-gray-500">Meetings</div>
            <div className="text-2xl font-bold text-blue-600">{stats.meetings}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Add Task & Filters */}
        <div className="lg:w-1/3 space-y-6">
          {/* Add Task Form */}
          <div className="bg-white rounded-lg shadow border p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Add New Task
            </h2>
            <form onSubmit={handleAddTask} className="space-y-3">
              <div>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  placeholder="Task title"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Description"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={newTask.type}
                    onChange={(e) => setNewTask({...newTask, type: e.target.value})}
                    className="w-full p-2 border rounded"
                  >
                    <option value="task">Task</option>
                    <option value="reminder">Reminder</option>
                    <option value="meeting">Meeting</option>
                    <option value="todo">To-Do</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    className="w-full p-2 border rounded"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assign To
                  </label>
                  <select
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select person</option>
                    <option value="Manager">Manager</option>
                    <option value="All">All Staff</option>
                    {vendeurs.map((vendeur, index) => (
                      <option key={index} value={vendeur}>
                        {vendeur}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shift
                  </label>
                  <select
                    value={newTask.shift}
                    onChange={(e) => setNewTask({...newTask, shift: e.target.value})}
                    className="w-full p-2 border rounded"
                  >
                    <option value="AM">AM Shift</option>
                    <option value="PM">PM Shift</option>
                    <option value="Both">Both Shifts</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newTask.dueTime}
                    onChange={(e) => setNewTask({...newTask, dueTime: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition flex items-center justify-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </button>
            </form>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow border p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </h2>
            <div className="space-y-2">
              {[
                { id: 'all', label: 'All Tasks' },
                { id: 'shift', label: 'Current Shift' },
                { id: 'today', label: 'Due Today' },
                { id: 'pending', label: 'Pending' },
                { id: 'completed', label: 'Completed' },
                { id: 'meetings', label: 'Meetings Only' },
                { id: 'critical', label: 'Critical Priority' }
              ].map(filterOption => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id)}
                  className={`w-full text-left px-3 py-2 rounded transition ${
                    filter === filterOption.id 
                    ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                    : 'hover:bg-gray-50'
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Tasks List */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow border overflow-hidden">
            <div className="px-4 py-3 border-b bg-gray-50">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                  Tasks List ({filteredTasks.length})
                </h2>
                <span className="text-sm text-gray-500">
                  Showing {filter === 'all' ? 'all' : filter} tasks
                </span>
              </div>
            </div>

            <div className="divide-y">
              {filteredTasks.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No tasks found. Add a new task to get started.
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`p-4 hover:bg-gray-50 transition ${
                      task.status === 'completed' ? 'bg-green-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <button
                          onClick={() => handleToggleComplete(task.id)}
                          className="mt-1"
                        >
                          {task.status === 'completed' ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        
                        <div className="flex-1">
                          <div className="flex items-center flex-wrap gap-2 mb-1">
                            <h3 className={`font-medium ${
                              task.status === 'completed' 
                              ? 'text-gray-500 line-through' 
                              : 'text-gray-800'
                            }`}>
                              {task.title}
                            </h3>
                            
                            <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                            
                            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 border flex items-center">
                              {getTypeIcon(task.type)}
                              <span className="ml-1 capitalize">{task.type}</span>
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">
                            {task.description}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                            {task.assignedTo && (
                              <span className="flex items-center">
                                <User className="w-3 h-3 mr-1" />
                                {task.assignedTo}
                              </span>
                            )}
                            
                            {task.dueDate && (
                              <span className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {task.dueDate}
                                {task.dueTime && ` • ${task.dueTime}`}
                              </span>
                            )}
                            
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {task.shift} Shift
                            </span>
                            
                            <span className="flex items-center">
                              <div className={`w-2 h-2 rounded-full mr-1 ${getStatusColor(task.status)}`}></div>
                              <span className="capitalize">{task.status}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          {expandedTask === task.id ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                        
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1 hover:bg-red-100 text-red-600 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Expanded section for priority change */}
                    {expandedTask === task.id && (
                      <div className="mt-3 pl-8 pt-3 border-t">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">Change Priority:</span>
                          {['low', 'medium', 'high', 'critical'].map((priority) => (
                            <button
                              key={priority}
                              onClick={() => handlePriorityChange(task.id, priority)}
                              className={`px-3 py-1 text-xs rounded-full capitalize ${
                                task.priority === priority
                                ? 'ring-2 ring-offset-1'
                                : ''
                              } ${getPriorityColor(priority)}`}
                            >
                              {priority}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksManager;