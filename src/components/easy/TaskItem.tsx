import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  Clock, 
  User, 
  MessageSquare,
  CheckCircle,
  Circle,
  Trash2,
  ChevronDown,
  ChevronUp,
  Calendar
} from 'lucide-react';

const TaskItem = ({ task, onDelete, onToggleComplete, vendeurs, isMeeting }) => {
  const [expanded, setExpanded] = useState(false);

  const getPriorityDot = (priority) => {
    switch(priority) {
      case 'critical': return 'w-1.5 h-1.5 bg-red-500';
      case 'high': return 'w-1.5 h-1.5 bg-orange-500';
      case 'medium': return 'w-1.5 h-1.5 bg-yellow-500';
      default: return 'w-1.5 h-1.5 bg-green-500';
    }
  };

  const getStatusColor = (status) => {
    return status === 'completed' 
      ? 'text-green-600 line-through'
      : 'text-gray-800';
  };

  if (isMeeting) {
    return (
      <div className={`bg-white border rounded p-1.5 ${task.status === 'completed' ? 'bg-gray-50' : ''}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-1.5 flex-1 min-w-0">
            <button 
              onClick={() => onToggleComplete(task.id)}
              className="mt-0.5 flex-shrink-0"
            >
              {task.status === 'completed' ? (
                <CheckCircle className="w-3.5 h-3.5 text-green-600" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-gray-400" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <div className={`${getPriorityDot(task.priority)} rounded-full`}></div>
                <h3 className={`text-xs font-medium truncate ${getStatusColor(task.status)}`}>
                  {task.title}
                </h3>
                <span className="flex-shrink-0 px-1 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded">
                  <Users className="w-2.5 h-2.5 inline mr-0.5" />
                  Meet
                </span>
              </div>

              {/* Meeting Details - First Row */}
              <div className="flex items-center gap-2 text-[10px] text-gray-600 mb-0.5">
                {task.location && (
                  <span className="flex items-center gap-0.5">
                    <MapPin className="w-2.5 h-2.5" />
                    {task.location}
                  </span>
                )}
                
                {task.dueTime && (
                  <span className="flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {task.dueTime}
                  </span>
                )}

                {task.assignedTo && (
                  <span className="flex items-center gap-0.5">
                    <User className="w-2.5 h-2.5" />
                    {task.assignedTo}
                  </span>
                )}

                {task.duration && (
                  <span className="text-gray-500">
                    {task.duration}min
                  </span>
                )}
              </div>

              {/* Attendees - Compact Display */}
              {task.attendees && task.attendees.length > 0 && !expanded && (
                <div className="flex items-center gap-1 text-[10px] text-gray-600">
                  <Users className="w-2.5 h-2.5 flex-shrink-0" />
                  <div className="flex items-center gap-0.5 truncate">
                    {task.attendees.slice(0, 3).map((attendee, idx) => (
                      <span key={idx} className="truncate">{attendee}</span>
                    ))}
                    {task.attendees.length > 3 && (
                      <span className="text-gray-500">+{task.attendees.length - 3}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-0.5 ml-1 flex-shrink-0">
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-0.5 hover:bg-gray-100 rounded text-gray-500"
              title={expanded ? "Collapse" : "Expand"}
            >
              {expanded ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-0.5 hover:bg-red-50 text-red-600 rounded"
              title="Delete"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Expanded Meeting Details */}
        {expanded && (
          <div className="mt-1.5 pt-1.5 border-t border-gray-100 space-y-1">
            {/* Agenda */}
            {task.agenda && (
              <div className="text-[10px]">
                <div className="font-medium text-gray-700 mb-0.5">Agenda:</div>
                <div className="text-gray-600 line-clamp-2">{task.agenda}</div>
              </div>
            )}

            {/* Full Attendees List */}
            {task.attendees && task.attendees.length > 0 && (
              <div className="text-[10px]">
                <div className="font-medium text-gray-700 mb-0.5">Attendees ({task.attendees.length}):</div>
                <div className="flex flex-wrap gap-0.5">
                  {task.attendees.map((attendee, idx) => (
                    <span 
                      key={idx} 
                      className="px-1 py-0.5 bg-gray-100 text-gray-700 rounded truncate max-w-[80px]"
                      title={attendee}
                    >
                      {attendee}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex items-center gap-1 pt-1">
              <button className="px-1.5 py-0.5 text-[10px] bg-blue-50 text-blue-700 rounded hover:bg-blue-100">
                Send Reminder
              </button>
              <button className="px-1.5 py-0.5 text-[10px] bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                Reschedule
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Regular Task - Ultra Compact
  return (
    <div className={`bg-white border rounded p-1.5 ${task.status === 'completed' ? 'bg-gray-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 flex-1">
          <button 
            onClick={() => onToggleComplete(task.id)}
            className="flex-shrink-0"
          >
            {task.status === 'completed' ? (
              <CheckCircle className="w-3.5 h-3.5 text-green-600" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-gray-400" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <div className={`${getPriorityDot(task.priority)} rounded-full`}></div>
              <h3 className={`text-xs truncate ${getStatusColor(task.status)}`}>
                {task.title}
              </h3>
            </div>
            
            <div className="flex items-center gap-2 text-[10px] text-gray-600 mt-0.5">
              {task.assignedTo && (
                <span className="flex items-center gap-0.5">
                  <User className="w-2.5 h-2.5" />
                  {task.assignedTo}
                </span>
              )}
              
              {task.dueTime && (
                <span className="flex items-center gap-0.5">
                  <Clock className="w-2.5 h-2.5" />
                  {task.dueTime}
                </span>
              )}
              
              {task.shift && (
                <span>{task.shift}</span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => onDelete(task.id)}
          className="p-0.5 hover:bg-red-50 text-red-600 rounded ml-1"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;