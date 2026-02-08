import React from 'react';
import { Users } from 'lucide-react'; // ← ADD THIS LINE
import MeetingItem from './MeetingItem';

const MeetingList = ({ meetings, onDelete, onToggleComplete, onAddFile, onRemoveFile }) => {
  if (meetings.length === 0) {
    return (
      <div className="p-6 bg-white border rounded-lg text-center">
        <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
          <Users className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-sm text-gray-600">No meetings scheduled</p>
        <p className="text-xs text-gray-400 mt-1">Schedule your first meeting to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {meetings.map((meeting) => (
        <MeetingItem
          key={meeting.id}
          meeting={meeting}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
          onAddFile={onAddFile}
          onRemoveFile={onRemoveFile}
        />
      ))}
    </div>
  );
};

export default MeetingList;