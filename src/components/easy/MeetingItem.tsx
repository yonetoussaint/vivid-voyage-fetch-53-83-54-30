import React, { useState } from 'react';
import { 
  Trash2,
  CheckCheck,
  CalendarClock,
  MoreVertical,
  Edit2
} from 'lucide-react';
import {
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
    setShowMenu(false);
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
    setShowMenu(false);
  };

  const handleEditMeeting = () => {
    // This would open an edit modal/form in a real implementation
    alert('Edit functionality would open a form to edit meeting details');
    setShowMenu(false);
  };

  // Format the title from date and time in French style
  const formattedTitle = `${formatDateFrench(meeting.dueDate)} à ${formatTime(meeting.dueTime)}`;

  return (
    <div className={`p-4 bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow ${meeting.status === 'completed' ? 'border-green-200 bg-green-50/50' : 'border-gray-200'}`}>
      {/* Top row with title and menu */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className={`font-semibold text-gray-900 ${meeting.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
          {formattedTitle}
        </h3>

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
              <div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1">
                {/* Edit button */}
                <button
                  onClick={handleEditMeeting}
                  className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit meeting
                </button>

                {/* Complete button - only show if not completed */}
                {meeting.status !== 'completed' && (
                  <button
                    onClick={handleCompleteMeeting}
                    className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                  >
                    <CheckCheck className="w-4 h-4" />
                    Mark as completed
                  </button>
                )}

                {/* Postpone button - only show if not completed */}
                {meeting.status !== 'completed' && (
                  <button
                    onClick={handlePostponeMeeting}
                    className="w-full px-4 py-2 text-left text-sm text-amber-600 hover:bg-amber-50 flex items-center gap-2"
                  >
                    <CalendarClock className="w-4 h-4" />
                    Postpone meeting
                  </button>
                )}

                {/* Divider */}
                <div className="my-1 border-t border-gray-100" />

                {/* Delete button */}
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

      {/* Description - like tweet text */}
      {meeting.description && (
        <p className="text-gray-700 text-sm whitespace-pre-wrap break-words mb-3">
          {meeting.description}
        </p>
      )}

      {/* Completion date - shown when completed */}
      {meeting.status === 'completed' && meeting.completedAt && (
        <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
          <span>Completed {new Date(meeting.completedAt).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  );
};

export default MeetingItem;