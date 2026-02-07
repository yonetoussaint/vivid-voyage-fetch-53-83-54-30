import React, { useState, useEffect } from 'react';
import { Calendar, Users, Upload, FileText, Image, Video, File } from 'lucide-react';
import MeetingList from './MeetingList';

const MeetingsManager = ({ shift, date, vendeurs = [] }) => {
  const [meetings, setMeetings] = useState([]);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assignedTo: '',
    dueDate: date,
    dueTime: '',
    shift: shift,
    status: 'pending',
    location: 'Main Office',
    attendees: vendeurs,
    agenda: '',
    duration: '60',
    durationUnit: 'minutes',
    meetingType: 'staff',
    files: []
  });

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
        title: 'Weekly Staff Meeting',
        description: 'Discuss weekly performance, safety protocols, and schedule',
        priority: 'high',
        assignedTo: vendeurs[0] || 'Manager',
        dueDate: currentDate,
        dueTime: '09:00',
        shift: 'AM',
        status: 'pending',
        location: 'Main Office',
        attendees: vendeurs.length > 0 ? vendeurs : ['Manager', 'Supervisor'],
        agenda: '1. Weekly review\n2. Safety updates\n3. Schedule planning',
        meetingType: 'staff',
        duration: '60',
        durationUnit: 'minutes',
        files: [
          { id: 1, name: 'Performance_Report_Q1.pdf', type: 'pdf', url: '#', size: '2.4MB' },
          { id: 2, name: 'Attendance_Sheet.xlsx', type: 'excel', url: '#', size: '1.2MB' }
        ],
        notes: '',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Safety Training Session',
        description: 'Monthly safety training for all staff',
        priority: 'critical',
        assignedTo: vendeurs[0] || 'Manager',
        dueDate: currentDate,
        dueTime: '14:00',
        shift: 'PM',
        status: 'pending',
        location: 'Training Room',
        attendees: ['All Staff'],
        agenda: '1. Safety protocols\n2. Emergency procedures\n3. Equipment demonstration',
        meetingType: 'training',
        duration: '120',
        durationUnit: 'minutes',
        files: [
          { id: 1, name: 'Safety_Manual.pdf', type: 'pdf', url: '#', size: '3.1MB' },
          { id: 2, name: 'Training_Video.mp4', type: 'video', url: '#', size: '45MB' },
          { id: 3, name: 'Equipment_Photos.zip', type: 'archive', url: '#', size: '12MB' }
        ],
        notes: 'Mandatory for all employees',
        createdAt: new Date().toISOString()
      }
    ];
  };

  const handleAddMeeting = (e) => {
    e.preventDefault();
    if (!newMeeting.title.trim()) return;

    const meetingToAdd = {
      ...newMeeting,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      attendees: newMeeting.attendees || [],
      files: newMeeting.files || []
    };

    setMeetings([...meetings, meetingToAdd]);
    setNewMeeting({
      title: '',
      description: '',
      priority: 'medium',
      assignedTo: '',
      dueDate: date,
      dueTime: '',
      shift: shift,
      status: 'pending',
      location: 'Main Office',
      attendees: vendeurs,
      agenda: '',
      duration: '60',
      durationUnit: 'minutes',
      meetingType: 'staff',
      files: []
    });
  };

  const handleDeleteMeeting = (id) => {
    if (window.confirm('Delete this meeting?')) {
      setMeetings(meetings.filter(meeting => meeting.id !== id));
    }
  };

  const handleToggleComplete = (id) => {
    setMeetings(meetings.map(meeting => {
      if (meeting.id === id) {
        const newStatus = meeting.status === 'completed' ? 'pending' : 'completed';
        return {
          ...meeting,
          status: newStatus,
          completedAt: newStatus === 'completed' ? new Date().toISOString() : null
        };
      }
      return meeting;
    }));
  };

  const handleAddFile = (meetingId, file) => {
    setMeetings(meetings.map(meeting => {
      if (meeting.id === meetingId) {
        return {
          ...meeting,
          files: [...meeting.files, file]
        };
      }
      return meeting;
    }));
  };

  const handleRemoveFile = (meetingId, fileId) => {
    setMeetings(meetings.map(meeting => {
      if (meeting.id === meetingId) {
        return {
          ...meeting,
          files: meeting.files.filter(f => f.id !== fileId)
        };
      }
      return meeting;
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMeeting(prev => ({
      ...prev,
      [name]: value
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Add Meeting Form */}
        <div className="lg:col-span-1">
          <div className="p-3 bg-white border rounded-lg">
            <h2 className="text-base font-semibold mb-3">Schedule New Meeting</h2>
            
            <form onSubmit={handleAddMeeting} className="space-y-3">
              <div>
                <input
                  type="text"
                  name="title"
                  value={newMeeting.title}
                  onChange={handleChange}
                  placeholder="Meeting title *"
                  className="w-full p-2 border rounded text-sm"
                  required
                />
              </div>

              <div>
                <textarea
                  name="description"
                  value={newMeeting.description}
                  onChange={handleChange}
                  placeholder="Meeting description"
                  rows="2"
                  className="w-full p-2 border rounded text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select
                  name="priority"
                  value={newMeeting.priority}
                  onChange={handleChange}
                  className="p-2 border rounded text-sm"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="critical">Critical</option>
                </select>

                <select
                  name="meetingType"
                  value={newMeeting.meetingType}
                  onChange={handleChange}
                  className="p-2 border rounded text-sm"
                >
                  <option value="staff">Staff Meeting</option>
                  <option value="safety">Safety Meeting</option>
                  <option value="training">Training</option>
                  <option value="review">Review</option>
                  <option value="planning">Planning</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select
                  name="location"
                  value={newMeeting.location}
                  onChange={handleChange}
                  className="p-2 border rounded text-sm"
                >
                  <option value="Main Office">Main Office</option>
                  <option value="Conference Room">Conference Room</option>
                  <option value="Training Room">Training Room</option>
                  <option value="Virtual - Zoom">Virtual (Zoom)</option>
                  <option value="Virtual - Teams">Virtual (Teams)</option>
                </select>

                <select
                  name="assignedTo"
                  value={newMeeting.assignedTo}
                  onChange={handleChange}
                  className="p-2 border rounded text-sm"
                >
                  <option value="">Select host</option>
                  <option value="Manager">Manager</option>
                  {vendeurs.map((v, i) => (
                    <option key={i} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  name="dueDate"
                  value={newMeeting.dueDate}
                  onChange={handleChange}
                  className="p-2 border rounded text-sm"
                />
                <input
                  type="time"
                  name="dueTime"
                  value={newMeeting.dueTime}
                  onChange={handleChange}
                  className="p-2 border rounded text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="duration"
                  value={newMeeting.duration}
                  onChange={handleChange}
                  placeholder="Duration"
                  className="p-2 border rounded text-sm"
                  min="15"
                  step="15"
                />
                <select
                  name="durationUnit"
                  value={newMeeting.durationUnit}
                  onChange={handleChange}
                  className="p-2 border rounded text-sm"
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Attendees</label>
                <div className="flex flex-wrap gap-1 mb-2">
                  {vendeurs.map((v, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        const currentAttendees = newMeeting.attendees || [];
                        if (currentAttendees.includes(v)) {
                          setNewMeeting(prev => ({
                            ...prev,
                            attendees: currentAttendees.filter(a => a !== v)
                          }));
                        } else {
                          setNewMeeting(prev => ({
                            ...prev,
                            attendees: [...currentAttendees, v]
                          }));
                        }
                      }}
                      className={`px-2 py-1 text-xs rounded-full border flex items-center gap-1 ${
                        (newMeeting.attendees || []).includes(v)
                          ? 'bg-blue-100 text-blue-700 border-blue-300'
                          : 'bg-gray-100 text-gray-700 border-gray-300'
                      }`}
                    >
                      <Users className="w-3 h-3" />
                      {v}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add other attendees (comma separated)..."
                  value={newMeeting.additionalAttendees || ''}
                  onChange={(e) => setNewMeeting(prev => ({
                    ...prev,
                    additionalAttendees: e.target.value
                  }))}
                  className="w-full p-2 border rounded text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Agenda</label>
                <textarea
                  name="agenda"
                  value={newMeeting.agenda}
                  onChange={handleChange}
                  placeholder="1. First item\n2. Second item\n3. Discussion points..."
                  rows="3"
                  className="w-full p-2 border rounded text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Attach Files (Links)</label>
                <div className="space-y-2">
                  {newMeeting.files?.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        {getFileIcon(file.type)}
                        <span className="text-xs truncate">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNewMeeting(prev => ({
                          ...prev,
                          files: prev.files.filter((_, i) => i !== index)
                        }))}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="File name"
                      value={newMeeting.newFileName || ''}
                      onChange={(e) => setNewMeeting(prev => ({...prev, newFileName: e.target.value}))}
                      className="flex-1 p-2 border rounded text-sm"
                    />
                    <input
                      type="text"
                      placeholder="File URL"
                      value={newMeeting.newFileUrl || ''}
                      onChange={(e) => setNewMeeting(prev => ({...prev, newFileUrl: e.target.value}))}
                      className="flex-1 p-2 border rounded text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (newMeeting.newFileName && newMeeting.newFileUrl) {
                        setNewMeeting(prev => ({
                          ...prev,
                          files: [...prev.files, {
                            id: Date.now(),
                            name: prev.newFileName,
                            url: prev.newFileUrl,
                            type: getFileType(prev.newFileName),
                            size: 'N/A'
                          }],
                          newFileName: '',
                          newFileUrl: ''
                        }));
                      }
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    + Add file link
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full p-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
              >
                Schedule Meeting
              </button>
            </form>
          </div>
        </div>

        {/* Meetings List */}
        <div className="lg:col-span-2">
          <MeetingList 
            meetings={meetings}
            onDelete={handleDeleteMeeting}
            onToggleComplete={handleToggleComplete}
            onAddFile={handleAddFile}
            onRemoveFile={handleRemoveFile}
          />
        </div>
      </div>
    </div>
  );
};

const getFileIcon = (type) => {
  switch(type) {
    case 'pdf': return <FileText className="w-4 h-4 text-red-500" />;
    case 'excel': return <FileText className="w-4 h-4 text-green-500" />;
    case 'word': return <FileText className="w-4 h-4 text-blue-500" />;
    case 'image': return <Image className="w-4 h-4 text-purple-500" />;
    case 'video': return <Video className="w-4 h-4 text-orange-500" />;
    default: return <File className="w-4 h-4 text-gray-500" />;
  }
};

const getFileType = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase();
  if (['pdf'].includes(ext)) return 'pdf';
  if (['xlsx', 'xls', 'csv'].includes(ext)) return 'excel';
  if (['docx', 'doc'].includes(ext)) return 'word';
  if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'image';
  if (['mp4', 'avi', 'mov', 'wmv'].includes(ext)) return 'video';
  if (['zip', 'rar', '7z'].includes(ext)) return 'archive';
  return 'other';
};

export default MeetingsManager;