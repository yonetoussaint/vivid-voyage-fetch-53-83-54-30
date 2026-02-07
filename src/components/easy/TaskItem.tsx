import React from 'react';
import { CheckCircle, Square, User, Calendar, Clock, Trash2 } from 'lucide-react';

const TaskItem = ({ task, onDelete, onToggleComplete }) => {
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`p-4 ${task.status === 'completed' ? 'bg-green-50' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button 
            onClick={() => onToggleComplete(task.id)}
            className="mt-1"
            title={task.status === 'completed' ? 'Mark as pending' : 'Mark as completed'}
          >
            {task.status === 'completed' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <Square className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>

          <div className="flex-1">
            <h3 className={`font-medium ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
              {task.title}
            </h3>
            
            <p className="text-sm text-gray-600 mt-1 mb-2">{task.description}</p>

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

              <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>

              <span className={`px-2 py-0.5 text-xs rounded-full ${
                task.status === 'completed' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {task.status}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onDelete(task.id)}
          className="p-1.5 hover:bg-red-100 text-red-600 rounded"
          title="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;