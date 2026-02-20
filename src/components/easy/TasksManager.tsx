import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import MeetingList from './MeetingList';

const MeetingsManager = ({ shift, date, vendeurs = [] }) => {
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const savedMeetings = localStorage.getItem(`meetings_${date}`);
    if (savedMeetings) {
      setMeetings(JSON.parse(savedMeetings));
    } else {
      const sampleMeetings = getSampleMeetings(date, vendeurs);
      setMeetings(sampleMeetings);
      localStorage.setItem(`meetings_${date}`, JSON.stringify(sampleMeetings));
    }
  }, [date, vendeurs]);

  useEffect(() => {
    localStorage.setItem(`meetings_${date}`, JSON.stringify(meetings));
  }, [meetings, date]);

  const getSampleMeetings = (currentDate, vendeurs) => {
    return [
      {
        id: 1,
        description: 'Weekly staff meeting to discuss performance, safety protocols, and upcoming schedule',
        dueDate: currentDate,
        dueTime: '09:00',
        shift: 'AM',
        status: 'pending',
        meetingType: 'staff',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        description: 'Monthly safety training session - mandatory for all staff',
        dueDate: currentDate,
        dueTime: '14:00',
        shift: 'PM',
        status: 'pending',
        meetingType: 'training',
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        description: 'Quick team sync to discuss daily priorities and assignments',
        dueDate: currentDate,
        dueTime: '11:30',
        shift: 'AM',
        status: 'completed',
        meetingType: 'review',
        completedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }
    ];
  };

  const handleDeleteMeeting = (id) => {
    if (window.confirm('Delete this meeting?')) {
      setMeetings(meetings.filter(meeting => meeting.id !== id));
    }
  };

  const handleUpdateMeeting = (id, updates) => {
    setMeetings(meetings.map(meeting => {
      if (meeting.id === id) {
        return {
          ...meeting,
          ...updates
        };
      }
      return meeting;
    }));
  };

  return (
    <div className="p-2 space-y-2 max-w-6xl mx-auto">
      {/* Header */}
      <div className="p-3 bg-white border rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-lg font-bold">Meetings Manager</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <Calendar className="w-4 h-4" />
              <span>{date}</span>
              <span>•</span>
              <span>{shift} Shift</span>
            </div>
          </div>
          <div className="text-sm text-gray-700">
            <span className="font-semibold">{meetings.length}</span> meetings scheduled
          </div>
        </div>
      </div>

      {/* Meetings List - Full Width */}
      <div className="w-full">
        <MeetingList 
          meetings={meetings}
          onDelete={handleDeleteMeeting}
          onUpdateMeeting={handleUpdateMeeting}
        />
      </div>
    </div>
  );
};

export default MeetingsManager;