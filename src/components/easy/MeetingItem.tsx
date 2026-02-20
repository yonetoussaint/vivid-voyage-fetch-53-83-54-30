import React, { useState } from 'react';
import { 
  Trash2,
  CheckCheck,
  CalendarClock,
  MoreVertical,
  Calendar,
  Clock
} from 'lucide-react';
import {
  getMeetingTypeColor,
  formatTime
} from './taskUtils';

const MeetingItem = ({ meeting, onDelete, onUpdateMeeting }) => {
  const [showMenu, setShowMenu] = useState(false);

  // Function to format date in French style
  const formatDateFrench = (dateStr) => {
    const date = new Date(dateStr);
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    
    return `${dayName} ${day} ${month}`;
  };

  const handleCompleteMeeting = () => {
    onUpdateMeeting(meeting.id, { 
      status: 'completed',
      completedAt: new Date().toISOString()
    });
  };

  const handlePostponeMeeting = () => {
    const newDate = prompt('Enter new date (YYYY-MM-DD):', meeting.dueDate);
    const newTime = prompt('Enter new time (HH:MM):', meeting.dueTime);

    if (newDate && newTime) {
      onUpdateMeeting(meeting.id, { 
        dueDate: newDate,
        dueTime: newTime,
        status: 'postponed'
      });
    }
  };

  // Format the title from date and time in French style
  const formattedTitle = `${formatDateFrench(meeting.dueDate)} à ${formatTime(meeting.dueTime)}`;

  return (
    <div className={`p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow ${meeting.status === 'completed' ? 'border-green-200 bg-green-50/50' : 'border-gray-200'}`}>
      {/* Header with avatar placeholder and menu - like tweet header */}
      <div className="flex gap-3">
        {/* Avatar placeholder - like tweet profile pic */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {meeting.meetingType?.charAt(0) || 'M'}
          </div>
        </div>

        {/* Main content - like tweet body */}
        <div className="flex-1 min-w-0">
          {/* Top row with name, badge, menu - like tweet header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center flex-wrap gap-2">
              <h3 className={`font-semibold text-gray-900 ${meeting.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                {formattedTitle}
              </h3>
              <span className={`px-2 py-0.5 text-xs rounded-full ${getMeetingTypeColor(meeting.meetingType)}`}>
                {meeting.meetingType}
              </span>
              {meeting.status === 'completed' && (
                <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                  Completed
                </span>
              )}
            </div>

            {/* Menu button */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Menu"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              
              {/* Dropdown menu */}
              {showMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1">
                    <button
                      onClick={() => {
                        onDelete(meeting.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete meeting
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Date and time metadata - like tweet timestamp */}
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {meeting.dueDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(meeting.dueTime)}
            </span>
          </div>

          {/* Description - like tweet text */}
          {meeting.description && (
            <p className="mt-2 text-gray-700 text-sm whitespace-pre-wrap break-words">
              {meeting.description}
            </p>
          )}

          {/* Action buttons - like tweet actions */}
          {meeting.status !== 'completed' && (
            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-100">
              <button
                onClick={handleCompleteMeeting}
                className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 active:bg-green-800 flex items-center justify-center gap-2 text-sm transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Complete</span>
              </button>
              <button
                onClick={handlePostponeMeeting}
                className="flex-1 px-3 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 active:bg-amber-700 flex items-center justify-center gap-2 text-sm transition-colors"
              >
                <CalendarClock className="w-4 h-4" />
                <span>Postpone</span>
              </button>
            </div>
          )}

          {/* Completion date - like tweet footer */}
          {meeting.status === 'completed' && meeting.completedAt && (
            <div className="mt-3 pt-2 border-t border-gray-100 text-xs text-gray-500">
              <span>Completed {new Date(meeting.completedAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingItem;