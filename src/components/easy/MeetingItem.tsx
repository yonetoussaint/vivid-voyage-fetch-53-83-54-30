import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Clock, 
  User, 
  Video,
  MessageSquare,
  ClipboardList,
  ExternalLink,
  Trash2,
  ChevronDown,
  ChevronUp,
  Paperclip,
  Plus,
  Save,
  X,
  Mic,
  Play,
  Pause,
  CheckCheck,
  CalendarClock,
  UserCheck,
  UserX,
  Clock as ClockIcon,
  Download,
  Upload,
  Headphones,
  CheckCircle,
  XCircle,
  Clock4,
  MoreVertical,
  Filter
} from 'lucide-react';
import {
  getFileType,
  getFileIconComponent,
  getMeetingTypeColor,
  formatTime,
  getDurationText,
  formatFileSize,
  isVirtualMeeting
} from './taskUtils';

const MeetingItem = ({ meeting, onDelete, onUpdateMeeting, onAddFile, onRemoveFile }) => {
  const [expanded, setExpanded] = useState(false);
  const [isEditingPreNotes, setIsEditingPreNotes] = useState(false);
  const [isEditingMeetingNotes, setIsEditingMeetingNotes] = useState(false);
  const [preMeetingNotes, setPreMeetingNotes] = useState(meeting.preMeetingNotes || '');
  const [meetingNotes, setMeetingNotes] = useState(meeting.meetingNotes || '');
  const [showFileInput, setShowFileInput] = useState(false);
  const [newFile, setNewFile] = useState({ name: '', url: '' });
  const [showAudioInput, setShowAudioInput] = useState(false);
  const [audioUrl, setAudioUrl] = useState(meeting.audioUrl || '');
  const [isPlaying, setIsPlaying] = useState(false);
  const [attendeeStatus, setAttendeeStatus] = useState(
    meeting.attendees?.reduce((acc, attendee) => ({
      ...acc,
      [attendee]: meeting.attendance?.[attendee] || {
        status: 'invited',
        joinTime: null,
        leaveTime: null,
        notes: ''
      }
    }), {}) || {}
  );
  const [attendeeFilter, setAttendeeFilter] = useState('all');

  const handleAddFile = () => {
    if (newFile.name && newFile.url) {
      const fileType = getFileType(newFile.name);
      onAddFile(meeting.id, {
        id: Date.now(),
        name: newFile.name,
        url: newFile.url,
        type: fileType,
        size: 'N/A'
      });
      setNewFile({ name: '', url: '' });
      setShowFileInput(false);
    }
  };

  const handleSavePreNotes = () => {
    onUpdateMeeting(meeting.id, { preMeetingNotes });
    setIsEditingPreNotes(false);
  };

  const handleSaveMeetingNotes = () => {
    onUpdateMeeting(meeting.id, { meetingNotes });
    setIsEditingMeetingNotes(false);
  };

  const handleCompleteMeeting = () => {
    onUpdateMeeting(meeting.id, { 
      status: 'completed',
      completedAt: new Date().toISOString(),
      attendance: attendeeStatus
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

  const handleSaveAudio = () => {
    if (audioUrl) {
      onUpdateMeeting(meeting.id, { audioUrl });
      setShowAudioInput(false);
    }
  };

  const toggleAudio = () => {
    if (meeting.audioUrl) {
      setIsPlaying(!isPlaying);
      // Audio playback logic would go here
    }
  };

  const updateAttendeeStatus = (attendeeName, status) => {
    const now = new Date();
    const updatedStatus = {
      ...attendeeStatus[attendeeName],
      status,
      joinTime: status === 'present' ? now.toISOString() : attendeeStatus[attendeeName]?.joinTime,
      leaveTime: status === 'absent' ? null : attendeeStatus[attendeeName]?.leaveTime
    };

    const newAttendeeStatus = {
      ...attendeeStatus,
      [attendeeName]: updatedStatus
    };
    
    setAttendeeStatus(newAttendeeStatus);
  };

  const markAttendeeLeave = (attendeeName) => {
    if (attendeeStatus[attendeeName]?.status === 'present') {
      const now = new Date();
      const updatedStatus = {
        ...attendeeStatus[attendeeName],
        status: 'left',
        leaveTime: now.toISOString()
      };

      const newAttendeeStatus = {
        ...attendeeStatus,
        [attendeeName]: updatedStatus
      };
      
      setAttendeeStatus(newAttendeeStatus);
    }
  };

  const getAttendeeCounts = () => {
    const counts = {
      present: 0,
      absent: 0,
      invited: 0,
      left: 0,
      total: meeting.attendees?.length || 0
    };
    
    Object.values(attendeeStatus).forEach(status => {
      if (status.status in counts) {
        counts[status.status]++;
      }
    });
    
    return counts;
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'present':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'absent':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'left':
        return <Clock4 className="w-4 h-4 text-amber-600" />;
      default:
        return <ClockIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'present':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'absent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'left':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'present': return 'Present';
      case 'absent': return 'Absent';
      case 'left': return 'Left Early';
      default: return 'Invited';
    }
  };

  const filteredAttendees = meeting.attendees?.filter(attendee => {
    if (attendeeFilter === 'all') return true;
    return attendeeStatus[attendee]?.status === attendeeFilter;
  }) || [];

  const counts = getAttendeeCounts();

  return (
    <div className={`p-4 bg-white border rounded-lg shadow-sm ${meeting.status === 'completed' ? 'border-green-200 bg-green-50' : 'border-blue-100'}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className={`text-lg font-semibold truncate ${meeting.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
              {meeting.title}
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

          {meeting.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{meeting.description}</p>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-700">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {meeting.dueDate}
            </span>
            <span className="hidden sm:inline text-gray-300">•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatTime(meeting.dueTime)} ({getDurationText(meeting.duration, meeting.durationUnit)})
            </span>
            <span className="hidden sm:inline text-gray-300">•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{meeting.location}</span>
              {isVirtualMeeting(meeting.location) && (
                <Video className="w-3 h-3 text-purple-500 ml-1" />
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
            aria-label={expanded ? 'Collapse details' : 'Expand details'}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onDelete(meeting.id)}
            className="p-2 hover:bg-red-50 text-red-600 rounded-lg flex-shrink-0"
            aria-label="Delete meeting"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      {meeting.status !== 'completed' && (
        <div className="grid grid-cols-2 gap-2 mb-4">
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

      {/* Attendance Summary Cards */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Attendance</span>
          </div>
          <div className="text-xs text-gray-500">
            {counts.present || 0} of {counts.total} present
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
          <div className={`p-3 rounded-lg border ${getStatusColor('present')}`}>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{counts.present || 0}</div>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-xs mt-1">Present</div>
          </div>
          
          <div className={`p-3 rounded-lg border ${getStatusColor('absent')}`}>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{counts.absent || 0}</div>
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-xs mt-1">Absent</div>
          </div>
          
          <div className={`p-3 rounded-lg border ${getStatusColor('left')}`}>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{counts.left || 0}</div>
              <Clock4 className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-xs mt-1">Left Early</div>
          </div>
          
          <div className={`p-3 rounded-lg border ${getStatusColor('invited')}`}>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{counts.invited || 0}</div>
              <ClockIcon className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-xs mt-1">Invited</div>
          </div>
        </div>
      </div>

      {/* Audio Recording */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Recording</span>
          </div>
          {!meeting.audioUrl && (
            <button
              onClick={() => setShowAudioInput(!showAudioInput)}
              className="text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1"
            >
              <Upload className="w-3 h-3" />
              <span className="hidden sm:inline">Add Audio</span>
            </button>
          )}
        </div>

        {showAudioInput ? (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
            <div className="mb-2">
              <p className="text-sm text-gray-700 mb-1">Upload to Terabox and paste link:</p>
              <input
                type="url"
                placeholder="https://terabox.com/..."
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                className="w-full p-2 border rounded text-sm"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
              <button
                onClick={() => setShowAudioInput(false)}
                className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50 order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAudio}
                disabled={!audioUrl}
                className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
              >
                Save Audio
              </button>
            </div>
          </div>
        ) : meeting.audioUrl ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200 gap-3">
            <div className="flex items-center gap-3">
              <Headphones className="w-5 h-5 text-purple-600 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-800 truncate">Meeting Recording</div>
                <div className="text-xs text-gray-500">Ready to play</div>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={toggleAudio}
                className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-1 text-sm"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3 h-3" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3" />
                    <span>Play</span>
                  </>
                )}
              </button>
              <a
                href={meeting.audioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 hover:bg-blue-50 text-blue-600 rounded"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center border-2 border-dashed border-gray-300 rounded-lg">
            <Mic className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No recording attached</p>
          </div>
        )}
      </div>

      {/* Expandable Details */}
      {expanded && (
        <div className="border-t pt-4 space-y-4">
          {/* Enhanced Attendee Management */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  Attendees ({counts.total} people)
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Filter className="w-3 h-3 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={attendeeFilter}
                    onChange={(e) => setAttendeeFilter(e.target.value)}
                    className="pl-9 pr-4 py-1.5 text-xs border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Attendees</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="left">Left Early</option>
                    <option value="invited">Invited</option>
                  </select>
                </div>
                
                {meeting.status !== 'completed' && (
                  <button
                    onClick={() => {
                      // Mark all as present
                      const newStatus = {};
                      meeting.attendees?.forEach(attendee => {
                        newStatus[attendee] = {
                          ...attendeeStatus[attendee],
                          status: 'present',
                          joinTime: attendeeStatus[attendee]?.status !== 'present' ? 
                                   new Date().toISOString() : attendeeStatus[attendee]?.joinTime
                        };
                      });
                      setAttendeeStatus(newStatus);
                    }}
                    className="px-3 py-1.5 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                  >
                    Mark All Present
                  </button>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              {filteredAttendees.length > 0 ? (
                filteredAttendees.map((attendee, idx) => {
                  const status = attendeeStatus[attendee]?.status || 'invited';
                  const joinTime = attendeeStatus[attendee]?.joinTime;
                  const leaveTime = attendeeStatus[attendee]?.leaveTime;
                  
                  return (
                    <div key={idx} className="p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-3">
                        {/* Status Icon */}
                        <div className="mt-1">
                          {getStatusIcon(status)}
                        </div>
                        
                        {/* Attendee Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-800">{attendee}</span>
                                {attendee === meeting.assignedTo && (
                                  <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">Host</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(status)}`}>
                                  {getStatusText(status)}
                                </span>
                                {(joinTime || leaveTime) && (
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <ClockIcon className="w-3 h-3" />
                                    {joinTime && new Date(joinTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    {leaveTime && ` - ${new Date(leaveTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {meeting.status !== 'completed' && (
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <div className="hidden sm:flex gap-1">
                                  <button
                                    onClick={() => updateAttendeeStatus(attendee, 'present')}
                                    className={`px-2 py-1 text-xs rounded ${
                                      status === 'present' 
                                        ? 'bg-green-600 text-white' 
                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                    }`}
                                  >
                                    Present
                                  </button>
                                  <button
                                    onClick={() => updateAttendeeStatus(attendee, 'absent')}
                                    className={`px-2 py-1 text-xs rounded ${
                                      status === 'absent' 
                                        ? 'bg-red-600 text-white' 
                                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                                    }`}
                                  >
                                    Absent
                                  </button>
                                  {status === 'present' && (
                                    <button
                                      onClick={() => markAttendeeLeave(attendee)}
                                      className="px-2 py-1 text-xs bg-amber-100 text-amber-700 rounded hover:bg-amber-200"
                                    >
                                      Mark Left
                                    </button>
                                  )}
                                </div>
                                <div className="sm:hidden relative">
                                  <button className="p-1 hover:bg-gray-200 rounded">
                                    <MoreVertical className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Quick Status Toggle - Mobile */}
                          {meeting.status !== 'completed' && (
                            <div className="sm:hidden flex flex-wrap gap-1 mt-2 pt-2 border-t">
                              <button
                                onClick={() => updateAttendeeStatus(attendee, 'present')}
                                className={`px-2 py-1 text-xs rounded flex-1 min-w-[80px] ${
                                  status === 'present' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                              >
                                Present
                              </button>
                              <button
                                onClick={() => updateAttendeeStatus(attendee, 'absent')}
                                className={`px-2 py-1 text-xs rounded flex-1 min-w-[80px] ${
                                  status === 'absent' 
                                    ? 'bg-red-600 text-white' 
                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                }`}
                              >
                                Absent
                              </button>
                              {status === 'present' && (
                                <button
                                  onClick={() => markAttendeeLeave(attendee)}
                                  className="px-2 py-1 text-xs bg-amber-100 text-amber-700 rounded hover:bg-amber-200 flex-1 min-w-[80px]"
                                >
                                  Left Early
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center border-2 border-dashed border-gray-300 rounded-lg">
                  <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No attendees match the filter</p>
                </div>
              )}
            </div>
          </div>

          {/* Agenda */}
          {meeting.agenda && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ClipboardList className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Agenda</span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  {meeting.agenda.split('\n').map((item, idx) => (
                    item.trim() && (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center bg-white border rounded-full text-xs font-medium">
                          {idx + 1}
                        </div>
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Pre-Meeting Notes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Pre-Meeting Notes</span>
              </div>
              <button
                onClick={() => setIsEditingPreNotes(!isEditingPreNotes)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                {isEditingPreNotes ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {isEditingPreNotes ? (
              <div className="space-y-2">
                <textarea
                  value={preMeetingNotes}
                  onChange={(e) => setPreMeetingNotes(e.target.value)}
                  placeholder="Add notes before meeting (objectives, questions to ask, preparation items)..."
                  className="w-full p-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleSavePreNotes}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                  >
                    <Save className="w-3 h-3" />
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-blue-50 rounded-lg min-h-[60px]">
                {preMeetingNotes ? (
                  <div className="text-sm text-gray-700 whitespace-pre-line">
                    {preMeetingNotes}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic">
                    No pre-meeting notes added
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Meeting Notes (During Meeting) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Meeting Notes</span>
              </div>
              <button
                onClick={() => setIsEditingMeetingNotes(!isEditingMeetingNotes)}
                className="text-xs text-green-600 hover:text-green-800"
              >
                {isEditingMeetingNotes ? 'Cancel' : 'Add/Edit'}
              </button>
            </div>

            {isEditingMeetingNotes ? (
              <div className="space-y-2">
                <textarea
                  value={meetingNotes}
                  onChange={(e) => setMeetingNotes(e.target.value)}
                  placeholder="Take notes during the meeting (discussions, decisions, action items)..."
                  className="w-full p-3 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  rows="4"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleSaveMeetingNotes}
                    className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"
                  >
                    <Save className="w-3 h-3" />
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-green-50 rounded-lg min-h-[60px]">
                {meetingNotes ? (
                  <div className="text-sm text-gray-700 whitespace-pre-line">
                    {meetingNotes}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic">
                    No meeting notes taken yet
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Files Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  Files ({meeting.files?.length || 0})
                </span>
              </div>
              <button
                onClick={() => setShowFileInput(!showFileInput)}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add File
              </button>
            </div>

            {showFileInput && (
              <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="File name (e.g., report.pdf)"
                    value={newFile.name}
                    onChange={(e) => setNewFile(prev => ({...prev, name: e.target.value}))}
                    className="p-2 border rounded text-sm"
                  />
                  <input
                    type="url"
                    placeholder="File URL (https://...)"
                    value={newFile.url}
                    onChange={(e) => setNewFile(prev => ({...prev, url: e.target.value}))}
                    className="p-2 border rounded text-sm"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowFileInput(false)}
                    className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddFile}
                    disabled={!newFile.name || !newFile.url}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add File
                  </button>
                </div>
              </div>
            )}

            {meeting.files?.length > 0 ? (
              <div className="space-y-2">
                {meeting.files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 bg-white rounded-lg border flex-shrink-0">
                        {getFileIconComponent(getFileType(file.name))}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-800 truncate">
                          {file.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {getFileType(file.name).toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 hover:bg-blue-50 text-blue-600 rounded"
                        title="Open file"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => onRemoveFile(meeting.id, file.id)}
                        className="p-1.5 hover:bg-red-50 text-red-600 rounded"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center border-2 border-dashed border-gray-300 rounded-lg">
                <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No files attached yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Metadata Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 pt-3 border-t text-xs text-gray-500 gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span>Created: {new Date(meeting.createdAt).toLocaleDateString()}</span>
          {meeting.status === 'completed' && meeting.completedAt && (
            <>
              <span className="hidden sm:inline text-gray-300">•</span>
              <span>Completed: {new Date(meeting.completedAt).toLocaleDateString()}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {meeting.audioUrl && (
            <span className="flex items-center gap-1 text-purple-600">
              <Headphones className="w-3 h-3" />
              <span className="hidden sm:inline">Recording</span>
            </span>
          )}
          <span className="flex items-center gap-1">
            {isVirtualMeeting(meeting.location) ? (
              <>
                <Video className="w-3 h-3" />
                <span className="hidden sm:inline">Virtual</span>
              </>
            ) : (
              <>
                <MapPin className="w-3 h-3" />
                <span className="hidden sm:inline">In-Person</span>
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MeetingItem;