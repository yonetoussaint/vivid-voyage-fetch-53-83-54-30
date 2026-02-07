import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Clock, 
  User, 
  Flag, 
  MessageSquare,
  CheckCircle,
  Circle,
  Trash2
} from 'lucide-react';

const TaskItem = ({ task, onDelete, onToggleComplete, vendeurs }) => {
  const [expanded, setExpanded] = useState(false);

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type) => {
    return type === 'meeting' 
      ? 'bg-blue-100 text-blue-800 border-blue-200'
      : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className={`p-2 bg-white border rounded ${task.status === 'completed' ? 'bg-green-50' : ''}`}>
      <div className="flex items-start gap-2">
        <button 
          onClick={() => onToggleComplete(task.id)}
          className="mt-0.5 flex-shrink-0"
        >
          {task.status === 'completed' ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <Circle className="w-4 h-4 text-gray-400" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-xs text-gray-600 mt-0.5">{task.description}</p>
              )}
            </div>

            <button
              onClick={() => onDelete(task.id)}
              className="p-1 hover:bg-red-50 text-red-600 rounded ml-1"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1 mt-2">
            <span className={`px-1.5 py-0.5 text-xs rounded-full border ${getTypeColor(task.type)}`}>
              {task.type === 'meeting' ? (
                <>
                  <Users className="w-3 h-3 inline mr-0.5" />
                  Meeting
                </>
              ) : 'Task'}
            </span>

            <span className={`px-1.5 py-0.5 text-xs rounded-full border ${getPriorityColor(task.priority)}`}>
              <Flag className="w-3 h-3 inline mr-0.5" />
              {task.priority}
            </span>

            {task.assignedTo && (
              <span className="px-1.5 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700 border flex items-center">
                <User className="w-3 h-3 mr-0.5" />
                {task.assignedTo}
              </span>
            )}

            {task.dueDate && (
              <span className="px-1.5 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700 border flex items-center">
                <Calendar className="w-3 h-3 mr-0.5" />
                {task.dueDate}
              </span>
            )}

            {task.dueTime && (
              <span className="px-1.5 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700 border flex items-center">
                <Clock className="w-3 h-3 mr-0.5" />
                {task.dueTime}
              </span>
            )}

            {task.shift && (
              <span className="px-1.5 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700 border">
                {task.shift} Shift
              </span>
            )}
          </div>

          {/* Meeting Specific Details */}
          {task.type === 'meeting' && (
            <div className="mt-2 pt-2 border-t">
              <div className="flex items-center gap-2 text-xs text-gray-700 mb-1">
                <MapPin className="w-3 h-3 text-blue-600" />
                <span className="font-medium">Location:</span>
                <span>{task.location || 'Main Office'}</span>
              </div>

              <div className="flex items-start gap-2 text-xs text-gray-700">
                <Users className="w-3 h-3 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-medium mb-0.5">Attendees:</div>
                  <div className="flex flex-wrap gap-1">
                    {task.attendees && task.attendees.map((attendee, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                        {attendee}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {task.agenda && (
                <div className="mt-2 flex gap-2 text-xs text-gray-700">
                  <MessageSquare className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium mb-0.5">Agenda:</div>
                    <div className="whitespace-pre-line text-gray-600">
                      {task.agenda}
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-blue-600 hover:text-blue-800 mt-2"
              >
                {expanded ? 'Show less' : 'Add meeting notes...'}
              </button>

              {expanded && (
                <div className="mt-2 p-2 bg-gray-50 rounded border">
                  <textarea
                    placeholder="Add meeting notes..."
                    className="w-full p-1 text-xs border rounded"
                    rows="2"
                    defaultValue={task.notes || ''}
                  />
                  <div className="flex justify-end mt-1">
                    <button className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                      Save Notes
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;