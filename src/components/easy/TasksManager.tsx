// MeetingsManager.jsx
import React, { useState, useEffect } from 'react';
import MeetingList from './MeetingList';

const MeetingsManager = ({ shift, date, vendeurs = [], meetingType = 'all', onMeetingTypeChange }) => {
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
      },
      {
        id: 4,
        description: 'Safety equipment inspection and maintenance planning',
        dueDate: currentDate,
        dueTime: '10:30',
        shift: 'AM',
        status: 'pending',
        meetingType: 'safety',
        createdAt: new Date().toISOString()
      },
      {
        id: 5,
        description: 'One-on-one performance review with team lead',
        dueDate: currentDate,
        dueTime: '15:00',
        shift: 'PM',
        status: 'pending',
        meetingType: 'one-on-one',
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

  // Filter meetings based on meetingType
  const filteredMeetings = meetingType === 'all' 
    ? meetings 
    : meetings.filter(meeting => meeting.meetingType === meetingType);

  return (
    <div className="p-2 sm:p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-700">
          {filteredMeetings.length} {filteredMeetings.length === 1 ? 'meeting' : 'meetings'}
        </h2>
      </div>
      <MeetingList 
        meetings={filteredMeetings}
        onDelete={handleDeleteMeeting}
        onUpdateMeeting={handleUpdateMeeting}
      />
    </div>
  );
};

export default MeetingsManager;