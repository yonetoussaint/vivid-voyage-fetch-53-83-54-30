// TaskTypeSelector.jsx - Unified filter with all requested types
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
  Mail,
  Shield,
  Wrench,
  Users,
  ShoppingCart,
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  Flag,
  GraduationCap,
  UserCheck,
  Briefcase,
  Truck
} from 'lucide-react';

const TaskTypeSelector = ({ filterType, setFilterType }) => {
  const filterOptions = [
    // Core types
    { id: 'all', label: 'All', icon: ClipboardList },
    { id: 'tasks', label: 'Tasks', icon: ClipboardList },
    { id: 'meetings', label: 'Meetings', icon: Calendar },
    { id: 'reminders', label: 'Reminders', icon: Bell },
    
    // New requested types
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
    { id: 'inspections', label: 'Inspections', icon: FileText },
    { id: 'dépenses', label: 'Dépenses', icon: DollarSign },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'appels', label: 'Appels', icon: Phone },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'emails', label: 'Emails', icon: Mail },
    
    // Additional useful types
    { id: 'safety', label: 'Safety', icon: Shield },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'staff', label: 'Staff', icon: Users },
    { id: 'inventory', label: 'Inventory', icon: ShoppingCart },
    { id: 'supplies', label: 'Supplies', icon: Package },
    { id: 'training', label: 'Training', icon: GraduationCap },
    { id: 'evaluations', label: 'Evaluations', icon: UserCheck },
    { id: 'deliveries', label: 'Deliveries', icon: Truck },
    { id: 'shift-handover', label: 'Shift', icon: Users },
    
    // Status based
    { id: 'pending', label: 'Pending', icon: Clock },
    { id: 'urgent', label: 'Urgent', icon: AlertCircle },
    { id: 'completed', label: 'Completed', icon: CheckCircle },
    { id: 'critical', label: 'Critical', icon: Flag },
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