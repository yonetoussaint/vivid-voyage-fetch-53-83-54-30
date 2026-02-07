import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Clock, 
  User, 
  Flag, 
  MessageSquare,
  ClipboardList,
  Video,
  Phone,
  CheckCircle,
  Circle,
  Trash2,
  Edit2,
  Save,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const TaskItem = ({ task, onDelete, onToggleComplete, vendeurs }) => {
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [meetingNotes, setMeetingNotes] = useState(task.notes || '');

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getMeetingTypeColor = () => {
    if (task.location?.includes('Virtual') || task.location?.includes('Zoom')) {
      return 'bg-purple-100 text-purple-800 border-purple-200';
    }
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const handleSaveNotes = () => {
    // Here you would typically update the task in your state
    setIsEditing(false);
    // Call parent function to update task notes
  };

  if (task.type === 'meeting') {
    return (
      <div className={`p-3 mb-3 bg-white border rounded-lg shadow-sm ${task.status === 'completed' ? 'border-green-300 bg-green-50' : 'border-blue-100'}`}>
        {/* Meeting Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3">
            <button 
              onClick={() => onToggleComplete(task.id)}
              className="mt-1 flex-shrink-0"
            >
              {task.status === 'completed' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`text-base font-semibold ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                  {task.title}
                </h3>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                  {task.priority.toUpperCase()}
                </span>
              </div>
              
              {task.description && (
                <p className="text-sm text-gray-600">{task.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-1.5 hover:bg-blue-50 text-blue-600 rounded"
              title="Edit meeting"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1.5 hover:bg-red-50 text-red-600 rounded"
              title="Delete meeting"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Meeting Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Left Column - Time & Location */}
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date & Time</div>
                <div className="text-sm font-semibold text-gray-800">
                  {task.dueDate} • {task.dueTime || 'All day'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  <span className="inline-flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {task.shift} Shift
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Location</div>
                <div className="text-sm font-semibold text-gray-800">
                  {task.location || 'To be determined'}
                </div>
                {task.location?.includes('Virtual') && (
                  <div className="flex items-center gap-2 mt-1">
                    <Video className="w-3 h-3 text-purple-500" />
                    <span className="text-xs text-purple-600">Virtual meeting link will be shared</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - People */}
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Attendees</div>
                  <span className="text-xs text-gray-500">{task.attendees?.length || 0} people</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {task.attendees?.map((attendee, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border rounded-lg">
                      <User className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-700">{attendee}</span>
                      {attendee === task.assignedTo && (
                        <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">Host</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Organizer</div>
                <div className="text-sm font-semibold text-gray-800">{task.assignedTo || 'Not assigned'}</div>
                <div className="text-xs text-gray-500 mt-1">Meeting coordinator</div>
              </div>
            </div>
          </div>
        </div>

        {/* Agenda Section */}
        {task.agenda && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <ClipboardList className="w-4 h-4 text-gray-600" />
              <div className="text-sm font-medium text-gray-700">Meeting Agenda</div>
            </div>
            <div className="space-y-2">
              {task.agenda.split('\n').map((item, idx) => (
                item.trim() && (
                  <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-white border rounded-full text-xs font-medium">
                      {idx + 1}
                    </div>
                    <span>{item}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* Notes Section */}
        <div className="border-t pt-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Meeting Notes</span>
              {meetingNotes && (
                <span className="text-xs text-gray-500">• Has notes</span>
              )}
            </div>
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          {expanded && (
            <div className="mt-2">
              {isEditing ? (
                <div className="space-y-2">
                  <textarea
                    value={meetingNotes}
                    onChange={(e) => setMeetingNotes(e.target.value)}
                    placeholder="Add detailed meeting notes, action items, or follow-ups..."
                    className="w-full p-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveNotes}
                      className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
                    >
                      <Save className="w-3 h-3" />
                      Save Notes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg">
                  {meetingNotes ? (
                    <div className="text-sm text-gray-700 whitespace-pre-line">
                      {meetingNotes}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      No notes added yet. Click edit to add meeting notes.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Status & Actions */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getMeetingTypeColor()} border`}>
              {task.location?.includes('Virtual') ? (
                <span className="flex items-center gap-1">
                  <Video className="w-3 h-3" />
                  Virtual Meeting
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  In-Person Meeting
                </span>
              )}
            </span>
            
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
              task.status === 'completed' 
                ? 'bg-green-100 text-green-800 border-green-200' 
                : 'bg-yellow-100 text-yellow-800 border-yellow-200'
            } border`}>
              {task.status === 'completed' ? 'Meeting Completed' : 'Upcoming Meeting'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
            {task.status === 'completed' && task.completedAt && (
              <span>• Completed: {new Date(task.completedAt).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Regular Task Card (simplified)
  return (
    <div className="p-3 mb-2 bg-white border rounded-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <button 
            onClick={() => onToggleComplete(task.id)}
            className="mt-0.5"
          >
            {task.status === 'completed' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400" />
            )}
          </button>

          <div>
            <h3 className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-xs text-gray-600 mt-0.5">{task.description}</p>
            )}
            
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              
              {task.assignedTo && (
                <span className="text-xs text-gray-600 flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {task.assignedTo}
                </span>
              )}
              
              {task.dueDate && (
                <span className="text-xs text-gray-600 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {task.dueDate} {task.dueTime && `• ${task.dueTime}`}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => onDelete(task.id)}
          className="p-1.5 hover:bg-red-50 text-red-600 rounded"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;