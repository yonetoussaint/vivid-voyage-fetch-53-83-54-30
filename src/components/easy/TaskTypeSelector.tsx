// TaskTypeSelector.jsx - Keep exactly as you have it
import React from 'react';
import { 
  Calendar,
  ClipboardList,
  Bell,
  AlertTriangle,
  FileText,
  DollarSign,
  CreditCard,
  Phone,
  MessageSquare,
  Mail
} from 'lucide-react';

const TaskTypeSelector = ({ filterType, setFilterType }) => {
  const filterOptions = [
    { id: 'all', label: 'All', icon: ClipboardList },
    { id: 'tasks', label: 'Tasks', icon: ClipboardList },
    { id: 'meetings', label: 'Meetings', icon: Calendar },
    { id: 'reminders', label: 'Reminders', icon: Bell },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
    { id: 'inspections', label: 'Inspections', icon: FileText },
    { id: 'dépenses', label: 'Dépenses', icon: DollarSign },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'appels', label: 'Appels', icon: Phone },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'emails', label: 'Emails', icon: Mail },
  ];

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="flex items-center overflow-x-auto scrollbar-hide px-2 py-1 gap-1">
        {filterOptions.map((option) => {
          const Icon = option.icon;
          const isActive = filterType === option.id;
          
          return (
            <button
              key={option.id}
              onClick={() => setFilterType(option.id)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0
                ${isActive 
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
              title={option.label}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TaskTypeSelector;