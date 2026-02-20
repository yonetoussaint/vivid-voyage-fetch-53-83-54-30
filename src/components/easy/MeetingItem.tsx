import React, { useState } from 'react';
import { 
  Trash2,
  CheckCheck,
  CalendarClock,
  MoreVertical
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
    <div className={`p-4 bg-white border rounded-lg shadow-sm ${meeting.status === 'completed' ? 'border-green-200 bg-green-50' : 'border-blue-100'}`}>
      {/* Header with date as title and menu */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className={`text-lg font-semibold truncate ${meeting.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
              {formattedTitle}
            </h3>
            <span className={`px-2 py-1 text-xs rounded-full ${getMeetingTypeColor(meeting.meetingType)}`}>
              {meeting.meetingType}
            </span>
            {meeting.status === 'completed' && (
              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                Completed
              </span>
            )}
          </div>
        </div>

        {/* Menu button with nested delete */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Menu"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
          
          {/* Dropdown menu */}
          {showMenu && (
            <>
              {/* Backdrop to close menu when clicking outside */}
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

      {/* Complete/Postpone Buttons */}
      {meeting.status !== 'completed' && (
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleCompleteMeeting}
            className="px-3 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 active:bg-green-800 flex items-center justify-center gap-2 text-sm"
          >
            <CheckCheck className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Complete</span>
          </button>
          <button
            onClick={handlePostponeMeeting}
            className="px-3 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 active:bg-amber-700 flex items-center justify-center gap-2 text-sm"
          >
            <CalendarClock className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Postpone</span>
          </button>
        </div>
      )}

      {/* Simple Footer with only completion date if completed */}
      {meeting.status === 'completed' && meeting.completedAt && (
        <div className="mt-4 pt-3 border-t text-xs text-gray-500">
          <span>Completed: {new Date(meeting.completedAt).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  );
};

export default MeetingItem;