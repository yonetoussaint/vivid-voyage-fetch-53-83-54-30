// components/easy/TaskTypeSelector.jsx
import React from 'react';
import { 
  Filter,
  Calendar, 
  Bell, 
  Target, 
  CheckSquare,
  AlertTriangle,
  CheckCircle,
  ListTodo,
  Flag,
  Users,
  Clock,
  BarChart3,
  FileText,
  AlertCircle
} from 'lucide-react';

const TaskTypeSelector = ({ taskType, setTaskType }) => {
  const taskTypes = [
    { 
      id: 'all', 
      label: 'All Tasks', 
      icon: <Filter className="w-4 h-4" />,
      color: 'bg-blue-600 text-white',
      borderColor: 'border-blue-600'
    },
    { 
      id: 'meeting', 
      label: 'Meetings', 
      icon: <Calendar className="w-4 h-4" />,
      color: 'bg-purple-600 text-white',
      borderColor: 'border-purple-600'
    },
    { 
      id: 'reminder', 
      label: 'Reminders', 
      icon: <Bell className="w-4 h-4" />,
      color: 'bg-orange-600 text-white',
      borderColor: 'border-orange-600'
    },
    { 
      id: 'task', 
      label: 'Tasks', 
      icon: <Target className="w-4 h-4" />,
      color: 'bg-green-600 text-white',
      borderColor: 'border-green-600'
    },
    { 
      id: 'todo', 
      label: 'To-Dos', 
      icon: <CheckSquare className="w-4 h-4" />,
      color: 'bg-indigo-600 text-white',
      borderColor: 'border-indigo-600'
    },
    { 
      id: 'pending', 
      label: 'Pending', 
      icon: <Clock className="w-4 h-4" />,
      color: 'bg-yellow-600 text-white',
      borderColor: 'border-yellow-600'
    },
    { 
      id: 'completed', 
      label: 'Completed', 
      icon: <CheckCircle className="w-4 h-4" />,
      color: 'bg-emerald-600 text-white',
      borderColor: 'border-emerald-600'
    },
    { 
      id: 'critical', 
      label: 'Critical', 
      icon: <AlertTriangle className="w-4 h-4" />,
      color: 'bg-red-600 text-white',
      borderColor: 'border-red-600'
    }
  ];

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 px-2 no-scrollbar">
      {taskTypes.map((type) => (
        <button
          key={type.id}
          onClick={() => setTaskType(type.id)}
          className={`px-3 py-1 font-medium text-sm whitespace-nowrap transition-all duration-200 border flex items-center gap-1.5 ${
            taskType === type.id
              ? `${type.color} ${type.borderColor}`
              : 'bg-transparent text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
          style={{ borderRadius: '20px !important' }}
        >
          {type.icon}
          {type.label}
        </button>
      ))}
    </div>
  );
};

export default TaskTypeSelector;