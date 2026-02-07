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
  ChevronUp,
  MoreVertical,
  PhoneCall,
  Calendar as CalendarIcon,
  Target,
  AlertCircle
} from 'lucide-react';

const TaskItem = ({ task, onDelete, onToggleComplete, vendeurs }) => {
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [meetingNotes, setMeetingNotes] = useState(task.notes || '');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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
        {/* Mobile-Friendly Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <button 
              onClick={() => onToggleComplete(task.id)}
              className="mt-0.5 flex-shrink-0"
              aria-label={task.status === 'completed' ? 'Mark as pending' : 'Mark as completed'}
            >
              {task.status === 'completed' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className={`text-sm font-semibold truncate ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                  {task.title}
                </h3>
                <div className="flex items-center gap-1">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(task.priority)} whitespace-nowrap`}>
                    {task.priority}
                  </span>
                </div>
              </div>
              
              {/* Quick Info Row - Mobile Optimized */}
              <div className="flex items-center gap-2 text-xs text-gray-600 mt-1 flex-wrap">
                <span className="flex items-center gap-1 whitespace-nowrap">
                  <CalendarIcon className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{task.dueDate}</span>
                </span>
                <span className="text-gray-300">•</span>
                <span className="flex items-center gap-1 whitespace-nowrap">
                  <Clock className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{task.dueTime || 'All day'}</span>
                </span>
                <span className="text-gray-300">•</span>
                <span className="flex items-center gap-1 whitespace-nowrap">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate max-w-[100px]">{task.location || 'TBD'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-1.5 hover:bg-gray-100 rounded-lg"
              aria-label="More options"
            >
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>

            {showMobileMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border rounded-lg shadow-lg z-10 py-1">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowMobileMenu(false);
                  }}
                  className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Meeting
                </button>
                <button
                  onClick={() => {
                    onDelete(task.id);
                    setShowMobileMenu(false);
                  }}
                  className="w-full px-4 py-2 text-sm text-left hover:bg-red-50 text-red-600 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
                <button
                  onClick={() => {
                    setExpanded(!expanded);
                    setShowMobileMenu(false);
                  }}
                  className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  {expanded ? 'Hide Notes' : 'Show Notes'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile-Optimized Meeting Details */}
        <div className="space-y-3 mb-4">
          {/* Attendees - Mobile Scrollable */}
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-gray-700">Attendees ({task.attendees?.length || 0})</span>
              </div>
              {task.assignedTo && (
                <span className="text-xs text-blue-600 font-medium">Host: {task.assignedTo}</span>
              )}
            </div>
            
            <div className="overflow-x-auto -mx-3 px-3">
              <div className="flex gap-2 pb-2 min-w-max">
                {task.attendees?.map((attendee, idx) => (
                  <div key={idx} className="flex flex-col items-center min-w-[60px]">
                    <div className="w-8 h-8 rounded-full bg-white border flex items-center justify-center mb-1">
                      <User className="w-4 h-4 text-gray-400" />
                    </div>
                    <span className="text-xs text-gray-700 truncate max-w-[60px] text-center">
                      {attendee}
                    </span>
                    {attendee === task.assignedTo && (
                      <span className="text-[10px] px-1 py-0.5 bg-blue-100 text-blue-700 rounded mt-1">Host</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Agenda - Mobile Collapsible */}
          {task.agenda && (
            <div className="p-3 bg-gray-50 rounded-lg border">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center justify-between w-full mb-2"
              >
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-gray-600" />
                  <span className="text-xs font-medium text-gray-700">Agenda ({task.agenda.split('\n').filter(l => l.trim()).length} items)</span>
                </div>
                {expanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>

              {expanded && (
                <div className="space-y-2 mt-2 pt-2 border-t">
                  {task.agenda.split('\n').map((item, idx) => (
                    item.trim() && (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center bg-white border rounded-full text-xs font-medium">
                          {idx + 1}
                        </div>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quick Actions Bar */}
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-1">
              <span className={`px-2 py-1 text-xs rounded-full ${getMeetingTypeColor()} border flex items-center gap-1`}>
                {task.location?.includes('Virtual') ? (
                  <>
                    <Video className="w-3 h-3" />
                    <span className="hidden xs:inline">Virtual</span>
                  </>
                ) : (
                  <>
                    <Users className="w-3 h-3" />
                    <span className="hidden xs:inline">In-Person</span>
                  </>
                )}
              </span>
              
              <span className={`px-2 py-1 text-xs rounded-full ${
                task.status === 'completed' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              } border`}>
                {task.status === 'completed' ? 'Done' : 'Upcoming'}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {task.location?.includes('Virtual') && (
                <button className="p-1.5 hover:bg-purple-50 text-purple-600 rounded-lg">
                  <Video className="w-4 h-4" />
                </button>
              )}
              <button className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg">
                <PhoneCall className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Notes Section - Mobile Optimized */}
        <div className="border-t pt-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-between w-full p-2 hover:bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Notes</span>
              {meetingNotes && (
                <span className="text-xs text-gray-500 hidden xs:inline">• Has notes</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isEditing && (
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Editing</span>
              )}
              {expanded ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </div>
          </button>

          {expanded && (
            <div className="mt-2">
              {isEditing ? (
                <div className="space-y-2">
                  <textarea
                    value={meetingNotes}
                    onChange={(e) => setMeetingNotes(e.target.value)}
                    placeholder="Add meeting notes, action items, or follow-ups..."
                    className="w-full p-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 min-w-[120px] px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 flex items-center justify-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveNotes}
                      className="flex-1 min-w-[120px] px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1"
                    >
                      <Save className="w-3 h-3" />
                      Save
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
                    <div className="text-sm text-gray-500 italic flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      No notes yet. Add notes to track discussion points.
                    </div>
                  )}
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Add/Edit Notes
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Status Bar - Mobile Optimized */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline">Created: {new Date(task.createdAt).toLocaleDateString()}</span>
            <span className="sm:hidden">Created: {new Date(task.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
            {task.status === 'completed' && task.completedAt && (
              <>
                <span className="text-gray-300">•</span>
                <span className="hidden sm:inline">Completed: {new Date(task.completedAt).toLocaleDateString()}</span>
                <span className="sm:hidden">Done: {new Date(task.completedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">{task.shift} Shift</span>
            {task.duration && (
              <>
                <span className="text-gray-300">•</span>
                <span className="text-xs text-gray-500">{task.duration} min</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Regular Task Card - Mobile Optimized
  return (
    <div className="p-3 mb-2 bg-white border rounded-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <button 
            onClick={() => onToggleComplete(task.id)}
            className="mt-0.5 flex-shrink-0"
            aria-label={task.status === 'completed' ? 'Mark as pending' : 'Mark as completed'}
          >
            {task.status === 'completed' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className={`text-sm font-medium truncate ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {task.title}
              </h3>
              <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityColor(task.priority)} whitespace-nowrap flex-shrink-0`}>
                {task.priority}
              </span>
            </div>
            
            {task.description && (
              <p className="text-xs text-gray-600 line-clamp-2">{task.description}</p>
            )}
            
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {task.assignedTo && (
                <span className="text-xs text-gray-600 flex items-center gap-1 whitespace-nowrap">
                  <User className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate max-w-[80px]">{task.assignedTo}</span>
                </span>
              )}
              
              {task.dueDate && (
                <span className="text-xs text-gray-600 flex items-center gap-1 whitespace-nowrap">
                  <Calendar className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">
                    {window.innerWidth < 640 
                      ? new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })
                      : task.dueDate
                    }
                    {task.dueTime && ` • ${task.dueTime}`}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu for Regular Tasks */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-1.5 hover:bg-gray-100 rounded-lg"
            aria-label="More options"
          >
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>

          {showMobileMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border rounded-lg shadow-lg z-10 py-1">
              <button
                onClick={() => {
                  onToggleComplete(task.id);
                  setShowMobileMenu(false);
                }}
                className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2"
              >
                {task.status === 'completed' ? (
                  <>
                    <Circle className="w-4 h-4" />
                    Mark Pending
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Mark Complete
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  onDelete(task.id);
                  setShowMobileMenu(false);
                }}
                className="w-full px-4 py-2 text-sm text-left hover:bg-red-50 text-red-600 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Task
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Utility component for touch-friendly interactions
const TouchButton = ({ onClick, children, className = '' }) => (
  <button
    onClick={onClick}
    className={`touch-manipulation active:scale-95 transition-transform ${className}`}
  >
    {children}
  </button>
);

export default TaskItem;