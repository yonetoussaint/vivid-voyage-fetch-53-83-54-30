// components/easy/TaskTypeSelector.jsx
import React from 'react';
import { 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  Circle,
  ListTodo,
  Filter
} from 'lucide-react';

const TaskTypeSelector = ({ taskType, setTaskType }) => {
  const taskTypes = [
    { 
      id: 'all', 
      label: 'All Tasks', 
      icon: <Filter className="w-4 h-4" />,
      color: 'bg-gray-100 text-gray-800 border-gray-300'
    },
    { 
      id: 'meeting', 
      label: 'Meetings', 
      icon: <Calendar className="w-4 h-4" />,
      color: 'bg-blue-100 text-blue-800 border-blue-300'
    },
    { 
      id: 'reminder', 
      label: 'Reminders', 
      icon: <AlertCircle className="w-4 h-4" />,
      color: 'bg-orange-100 text-orange-800 border-orange-300'
    },
    { 
      id: 'task', 
      label: 'Tasks', 
      icon: <CheckCircle className="w-4 h-4" />,
      color: 'bg-green-100 text-green-800 border-green-300'
    },
    { 
      id: 'todo', 
      label: 'To-Dos', 
      icon: <Circle className="w-4 h-4" />,
      color: 'bg-purple-100 text-purple-800 border-purple-300'
    },
    { 
      id: 'pending', 
      label: 'Pending', 
      icon: <ListTodo className="w-4 h-4" />,
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    },
    { 
      id: 'completed', 
      label: 'Completed', 
      icon: <CheckCircle className="w-4 h-4" />,
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    { 
      id: 'critical', 
      label: 'Critical', 
      icon: <AlertCircle className="w-4 h-4" />,
      color: 'bg-red-100 text-red-800 border-red-300'
    }
  ];

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 px-2 no-scrollbar">
      {taskTypes.map((type) => (
        <button
          key={type.id}
          onClick={() => setTaskType(type.id)}
          className={`px-3 py-1.5 font-medium text-sm whitespace-nowrap transition-all duration-200 border flex items-center gap-1.5 rounded-full ${
            taskType === type.id
              ? `${type.color} border-2 shadow-sm`
              : 'bg-transparent text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <div className={`${taskType === type.id ? 'text-current' : 'text-slate-500'}`}>
            {type.icon}
          </div>
          {type.label}
        </button>
      ))}
    </div>
  );
};

export default TaskTypeSelector;