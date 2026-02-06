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
  ChevronDown,
  ChevronUp,
  Search,
  Download,
  Upload,
  Bell,
  CheckSquare,
  Square,
  Flag,
  Target,
  BarChart3,
  Mail,
  Phone,
  MapPin,
  Users,
  FileText,
  CalendarDays,
  AlertTriangle,
  CheckCheck,
  XCircle
} from 'lucide-react';

const TasksManager = ({ shift, date, vendeurs = [], taskType = 'all', vendeurActif = null }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    type: 'task',
    priority: 'medium',
    assignedTo: vendeurActif || '',
    dueDate: date,
    dueTime: '',
    shift: shift,
    status: 'pending',
    category: 'operations',
    location: 'Station',
    notes: ''
  });
  const [expandedTask, setExpandedTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);
  const [sortBy, setSortBy] = useState('priority');

  // Update newTask when vendeurActif changes
  useEffect(() => {
    if (vendeurActif) {
      setNewTask(prev => ({ ...prev, assignedTo: vendeurActif }));
    }
  }, [vendeurActif]);

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem(`gasStationTasks_${date}`);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      const sampleTasks = getSampleTasks(date);
      setTasks(sampleTasks);
      localStorage.setItem(`gasStationTasks_${date}`, JSON.stringify(sampleTasks));
    }
  }, [date]);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem(`gasStationTasks_${date}`, JSON.stringify(tasks));
  }, [tasks, date]);

  // Function to generate sample tasks
  const getSampleTasks = (currentDate) => {
    return [
      {
        id: 1,
        title: 'Weekly Staff Meeting',
        description: 'Discuss weekly performance, safety protocols, and schedule for next week',
        type: 'meeting',
        priority: 'high',
        assignedTo: 'Manager',
        dueDate: currentDate,
        dueTime: '09:00',
        shift: 'AM',
        status: 'pending',
        category: 'management',
        location: 'Office',
        notes: 'Bring performance reports',
        createdAt: new Date().toISOString(),
        reminders: ['30 minutes before', '1 hour before']
      },
      {
        id: 2,
        title: 'Check Fire Extinguishers',
        description: 'Monthly inspection of all fire extinguishers on premises',
        type: 'reminder',
        priority: 'critical',
        assignedTo: 'All',
        dueDate: currentDate,
        dueTime: '10:00',
        shift: 'AM',
        status: 'pending',
        category: 'safety',
        location: 'Entire Station',
        notes: 'Check expiry dates and pressure',
        createdAt: new Date().toISOString(),
        reminders: ['Daily at 10:00 AM']
      },
      {
        id: 3,
        title: 'Order Fuel Delivery',
        description: 'Place order for regular unleaded and diesel for next week',
        type: 'task',
        priority: 'high',
        assignedTo: 'Manager',
        dueDate: currentDate,
        dueTime: '14:00',
        shift: 'PM',
        status: 'pending',
        category: 'inventory',
        location: 'Office',
        notes: 'Check current stock levels first',
        createdAt: new Date().toISOString()
      },
      {
        id: 4,
        title: 'Clean Restrooms',
        description: 'Hourly check and cleaning of customer restrooms',
        type: 'todo',
        priority: 'medium',
        assignedTo: 'Attendant',
        dueDate: currentDate,
        dueTime: '11:00',
        shift: 'AM',
        status: 'completed',
        category: 'maintenance',
        location: 'Restrooms',
        notes: 'Use proper cleaning supplies',
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      },
      {
        id: 5,
        title: 'Pump Maintenance Check',
        description: 'Daily check of all fuel pumps for proper operation',
        type: 'task',
        priority: 'medium',
        assignedTo: 'Technician',
        dueDate: currentDate,
        dueTime: '08:00',
        shift: 'AM',
        status: 'pending',
        category: 'maintenance',
        location: 'Fuel Area',
        notes: 'Check for leaks and proper nozzle function',
        createdAt: new Date().toISOString()
      },
      {
        id: 6,
        title: 'Cash Register Audit',
        description: 'Daily audit of cash registers and safe',
        type: 'task',
        priority: 'high',
        assignedTo: 'Manager',
        dueDate: currentDate,
        dueTime: '17:00',
        shift: 'PM',
        status: 'pending',
        category: 'finance',
        location: 'Cashier Area',
        notes: 'Verify all transactions',
        createdAt: new Date().toISOString()
      },
      {
        id: 7,
        title: 'Supplier Payment',
        description: 'Pay monthly bills to suppliers',
        type: 'reminder',
        priority: 'high',
        assignedTo: 'Manager',
        dueDate: currentDate,
        dueTime: '15:00',
        shift: 'PM',
        status: 'pending',
        category: 'finance',
        location: 'Office',
        notes: 'Due today',
        createdAt: new Date().toISOString()
      },
      {
        id: 8,
        title: 'Safety Training Session',
        description: 'Monthly safety training for all staff',
        type: 'meeting',
        priority: 'critical',
        assignedTo: 'All',
        dueDate: currentDate,
        dueTime: '13:00',
        shift: 'Both',
        status: 'pending',
        category: 'safety',
        location: 'Training Room',
        notes: 'Mandatory for all employees',
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
      dueDate: newTask.dueDate || date,
      assignedTo: newTask.assignedTo || vendeurActif || 'All',
      reminders: newTask.type === 'reminder' ? ['Daily'] : []
    };

    setTasks([...tasks, taskToAdd]);
    
    // Reset form but keep current shift and date
    setNewTask({
      title: '',
      description: '',
      type: 'task',
      priority: 'medium',
      assignedTo: vendeurActif || '',
      dueDate: date,
      dueTime: '',
      shift: shift,
      status: 'pending',
      category: 'operations',
      location: 'Station',
      notes: ''
    });
  };

  const handleDeleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
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

  const handlePriorityChange = (id, priority) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, priority } : task
    ));
  };

  const handleStatusChange = (id, status) => {
    setTasks(tasks.map(task => 
      task.id === id ? { 
        ...task, 
        status,
        completedAt: status === 'completed' ? new Date().toISOString() : null
      } : task
    ));
  };

  const handleExportTasks = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `gas_station_tasks_${date}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportTasks = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedTasks = JSON.parse(e.target.result);
        setTasks(importedTasks);
        localStorage.setItem(`gasStationTasks_${date}`, JSON.stringify(importedTasks));
        alert('Tasks imported successfully!');
      } catch (error) {
        alert('Error importing tasks. Please check the file format.');
      }
    };
    reader.readAsText(file);
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
      case 'meeting': return <CalendarDays className="w-4 h-4" />;
      case 'reminder': return <Bell className="w-4 h-4" />;
      case 'todo': return <CheckSquare className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'safety': return 'bg-red-50 text-red-700';
      case 'management': return 'bg-blue-50 text-blue-700';
      case 'finance': return 'bg-green-50 text-green-700';
      case 'maintenance': return 'bg-orange-50 text-orange-700';
      case 'inventory': return 'bg-purple-50 text-purple-700';
      case 'operations': return 'bg-cyan-50 text-cyan-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  // Filter tasks based on multiple criteria
  const filteredTasks = tasks.filter(task => {
    // Filter by task type/category
    if (taskType !== 'all') {
      if (taskType === 'pending' && task.status !== 'pending') return false;
      if (taskType === 'completed' && task.status !== 'completed') return false;
      if (taskType === 'in-progress' && task.status !== 'in-progress') return false;
      if (taskType === 'critical' && task.priority !== 'critical') return false;
      if (['meeting', 'reminder', 'task', 'todo'].includes(taskType) && task.type !== taskType) return false;
    }

    // Filter by assigned vendor if vendeurActif is set
    if (vendeurActif && vendeurActif !== 'All' && task.assignedTo !== vendeurActif) {
      return false;
    }

    // Filter by shift
    if (task.shift !== 'Both' && task.shift !== shift && taskType !== 'all') {
      return false;
    }

    // Filter by completed status
    if (!showCompleted && task.status === 'completed') {
      return false;
    }

    // Filter by search query
    if (searchQuery && 
        !task.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !task.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !task.category.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !task.location.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch(sortBy) {
      case 'priority':
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case 'dueDate':
        return new Date(a.dueDate) - new Date(b.dueDate);
      case 'title':
        return a.title.localeCompare(b.title);
      case 'status':
        const statusOrder = { pending: 0, 'in-progress': 1, completed: 2, cancelled: 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      default:
        return 0;
    }
  });

  // Calculate statistics
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    critical: tasks.filter(t => t.priority === 'critical').length,
    high: tasks.filter(t => t.priority === 'high').length,
    meetings: tasks.filter(t => t.type === 'meeting').length,
    reminders: tasks.filter(t => t.type === 'reminder').length,
    todaysTasks: tasks.filter(t => t.dueDate === date).length,
    overdue: tasks.filter(t => new Date(t.dueDate) < new Date(date) && t.status !== 'completed').length
  };

  return (
    <div className="p-2 sm:p-4 max-w-7xl mx-auto">
      {/* Search and Controls Bar */}
      <div className="mb-6 bg-white rounded-lg shadow border p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, meetings, reminders..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="priority">Priority</option>
                <option value="dueDate">Due Date</option>
                <option value="title">Title</option>
                <option value="status">Status</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Show Completed</span>
            </label>

            <div className="flex gap-2">
              <button
                onClick={handleExportTasks}
                className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              
              <label className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 cursor-pointer">
                <Upload className="w-4 h-4" />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportTasks}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-sm text-gray-500 mb-1">Total Tasks</div>
          <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-xs text-gray-500 mt-1">{sortedTasks.length} filtered</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-red-100">
          <div className="text-sm text-gray-500 mb-1">Critical</div>
          <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
          <div className="text-xs text-red-500 mt-1">High priority</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-yellow-100">
          <div className="text-sm text-gray-500 mb-1">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-xs text-yellow-500 mt-1">To complete</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-green-100">
          <div className="text-sm text-gray-500 mb-1">Completed</div>
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-xs text-green-500 mt-1">Today</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-orange-100">
          <div className="text-sm text-gray-500 mb-1">Overdue</div>
          <div className="text-2xl font-bold text-orange-600">{stats.overdue}</div>
          <div className="text-xs text-orange-500 mt-1">Needs attention</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Add Task & Quick Stats */}
        <div className="lg:w-1/3 space-y-6">
          {/* Add Task Form */}
          <div className="bg-white rounded-lg shadow border p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <Plus className="w-5 h-5 mr-2 text-blue-600" />
                Add New Task
              </h2>
              {vendeurActif && (
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                  For: {vendeurActif}
                </span>
              )}
            </div>
            
            <form onSubmit={handleAddTask} className="space-y-3">
              <div>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  placeholder="Task title *"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Description"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="task">Task</option>
                    <option value="meeting">Meeting</option>
                    <option value="reminder">Reminder</option>
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
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    Category
                  </label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="operations">Operations</option>
                    <option value="safety">Safety</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inventory">Inventory</option>
                    <option value="finance">Finance</option>
                    <option value="management">Management</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <select
                    value={newTask.location}
                    onChange={(e) => setNewTask({...newTask, location: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Station">Station</option>
                    <option value="Office">Office</option>
                    <option value="Fuel Area">Fuel Area</option>
                    <option value="Store">Store</option>
                    <option value="Restrooms">Restrooms</option>
                    <option value="Entire Station">Entire Station</option>
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
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={newTask.notes}
                  onChange={(e) => setNewTask({...newTask, notes: e.target.value})}
                  placeholder="Additional notes..."
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="2"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </button>
            </form>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow border p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Quick Stats
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Meetings Today</span>
                <span className="font-medium">{tasks.filter(t => t.type === 'meeting' && t.dueDate === date).length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Reminders</span>
                <span className="font-medium">{stats.reminders}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">High Priority</span>
                <span className="font-medium">{stats.high}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">In Progress</span>
                <span className="font-medium">{stats.inProgress}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Due Today</span>
                <span className="font-medium">{stats.todaysTasks}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Tasks List */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow border overflow-hidden">
            {/* List Header */}
            <div className="px-4 py-3 border-b bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold">
                    Tasks List
                    <span className="ml-2 text-sm font-normal text-gray-600">
                      ({sortedTasks.length} of {tasks.length})
                    </span>
                  </h2>
                  {vendeurActif ? (
                    <p className="text-sm text-gray-500 mt-1">
                      Showing tasks for: <span className="font-medium text-blue-600">{vendeurActif}</span>
                      {taskType !== 'all' && (
                        <span className="ml-2">
                          • Type: <span className="font-medium capitalize">{taskType}</span>
                        </span>
                      )}
                    </p>
                  ) : taskType !== 'all' ? (
                    <p className="text-sm text-gray-500 mt-1">
                      Filter: <span className="font-medium capitalize">{taskType}</span>
                    </p>
                  ) : null}
                </div>
                
                <div className="text-sm text-gray-500">
                  {stats.overdue > 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium mr-2">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {stats.overdue} overdue
                    </span>
                  )}
                  Sorted by: {sortBy}
                </div>
              </div>
            </div>

            {/* Tasks List */}
            <div className="divide-y">
              {sortedTasks.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  {searchQuery ? (
                    <div className="space-y-2">
                      <Search className="w-12 h-12 mx-auto text-gray-300" />
                      <p>No tasks found for "{searchQuery}"</p>
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Clear search
                      </button>
                    </div>
                  ) : vendeurActif ? (
                    <div className="space-y-2">
                      <Users className="w-12 h-12 mx-auto text-gray-300" />
                      <p>No tasks assigned to <span className="font-medium">{vendeurActif}</span></p>
                      <p className="text-sm">Try changing the filter or assign a new task</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <CheckSquare className="w-12 h-12 mx-auto text-gray-300" />
                      <p>No tasks found</p>
                      <p className="text-sm">Add your first task to get started</p>
                    </div>
                  )}
                </div>
              ) : (
                sortedTasks.map((task) => (
                  <TaskItem 
                    key={task.id}
                    task={task}
                    expandedTask={expandedTask}
                    setExpandedTask={setExpandedTask}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDeleteTask}
                    onPriorityChange={handlePriorityChange}
                    onStatusChange={handleStatusChange}
                    getPriorityColor={getPriorityColor}
                    getTypeIcon={getTypeIcon}
                    getCategoryColor={getCategoryColor}
                    getStatusColor={getStatusColor}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Task Item Component
const TaskItem = ({ 
  task, 
  expandedTask, 
  setExpandedTask, 
  onToggleComplete, 
  onDelete, 
  onPriorityChange,
  onStatusChange,
  getPriorityColor,
  getTypeIcon,
  getCategoryColor,
  getStatusColor 
}) => {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';
  
  return (
    <div className={`p-4 hover:bg-gray-50 transition-all ${task.status === 'completed' ? 'bg-green-50' : ''} ${isOverdue ? 'bg-red-50 border-l-4 border-red-500' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button 
            onClick={() => onToggleComplete(task.id)}
            className="mt-1 flex-shrink-0"
            title={task.status === 'completed' ? 'Mark as pending' : 'Mark as completed'}
          >
            {task.status === 'completed' ? (
              <CheckCheck className="w-5 h-5 text-green-600" />
            ) : (
              <Square className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2 mb-1">
              <h3 className={`font-medium text-sm sm:text-base ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                {task.title}
                {isOverdue && (
                  <span className="ml-2 text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded">
                    OVERDUE
                  </span>
                )}
              </h3>
              
              <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(task.priority)}`}>
                <Flag className="w-3 h-3 inline mr-1" />
                {task.priority}
              </span>
              
              <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 border flex items-center">
                {getTypeIcon(task.type)}
                <span className="ml-1 capitalize">{task.type}</span>
              </span>
              
              <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(task.category)}`}>
                {task.category}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{task.description}</p>
            
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
              {task.assignedTo && (
                <span className="flex items-center">
                  <User className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{task.assignedTo}</span>
                </span>
              )}
              
              {task.location && (
                <span className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{task.location}</span>
                </span>
              )}
              
              {task.dueDate && (
                <span className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">
                    {task.dueDate}
                    {task.dueTime && ` • ${task.dueTime}`}
                  </span>
                </span>
              )}
              
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">{task.shift} Shift</span>
              </span>
              
              <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
            </div>
            
            {task.notes && (
              <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                <span className="font-medium">Notes:</span> {task.notes}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
          <button
            onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
            className="p-1.5 hover:bg-gray-200 rounded"
            title="Expand details"
          >
            {expandedTask === task.id ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 hover:bg-red-100 text-red-600 rounded"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Expanded Details */}
      {expandedTask === task.id && (
        <div className="mt-3 pl-8 pt-3 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Task Details</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Created:</span>
                  <span className="text-sm">{new Date(task.createdAt).toLocaleString()}</span>
                </div>
                {task.completedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Completed:</span>
                    <span className="text-sm">{new Date(task.completedAt).toLocaleString()}</span>
                  </div>
                )}
                {task.reminders && task.reminders.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-600">Reminders:</span>
                    <div className="mt-1">
                      {task.reminders.map((reminder, idx) => (
                        <span key={idx} className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded mr-1 mb-1">
                          {reminder}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Actions</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Change Status:</label>
                  <div className="flex flex-wrap gap-1">
                    {['pending', 'in-progress', 'completed', 'cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => onStatusChange(task.id, status)}
                        className={`px-2 py-1 text-xs rounded-full capitalize ${
                          task.status === status ? 'ring-2 ring-offset-1' : ''
                        } ${getStatusColor(status)}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Change Priority:</label>
                  <div className="flex flex-wrap gap-1">
                    {['low', 'medium', 'high', 'critical'].map((priority) => (
                      <button
                        key={priority}
                        onClick={() => onPriorityChange(task.id, priority)}
                        className={`px-2 py-1 text-xs rounded-full capitalize ${
                          task.priority === priority ? 'ring-2 ring-offset-1' : ''
                        } ${getPriorityColor(priority)}`}
                      >
                        <Flag className="w-3 h-3 inline mr-1" />
                        {priority}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksManager;