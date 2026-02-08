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
  FileText,
  Image,
  File,
  ExternalLink,
  CheckCheck,
  CalendarClock,
  ChevronDown,
  ChevronUp,
  Paperclip,
  Plus,
  AlertCircle,
  Headphones,
  Play,
  Pause,
  Mic,
  Trash2,
  Edit2,
  Save,
  X,
  UserCheck,
  UserX,
  Clock as ClockIcon
} from 'lucide-react';
import {
  getFileType,
  getFileIconComponent,
  getPriorityColor,
  getMeetingTypeColor,
  getStatusColor,
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
  const [editingAttendance, setEditingAttendance] = useState(false);

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

  const handleAttendanceUpdate = (attendeeName, status, arrivalTime = null) => {
    const updatedAttendees = meeting.attendees.map(attendee => {
      if (attendee.name === attendeeName) {
        return {
          ...attendee,
          status,
          arrivalTime: arrivalTime || attendee.arrivalTime
        };
      }
      return attendee;
    });
    
    onUpdateMeeting(meeting.id, { attendees: updatedAttendees });
  };

  const updateArrivalTime = (attendeeName) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    handleAttendanceUpdate(attendeeName, 'present', timeString);
  };

  return (
    <div className={`p-4 bg-white border rounded-lg shadow-sm ${meeting.status === 'completed' ? 'border-green-300 bg-green-50' : 'border-blue-100'}`}>
      {/* Header - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-800 truncate">
              {meeting.title}
            </h3>
            <div className="flex flex-wrap gap-1">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(meeting.priority)} whitespace-nowrap`}>
                <Flag className="w-3 h-3 inline mr-1" />
                {meeting.priority}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${getMeetingTypeColor(meeting.meetingType)}`}>
                {meeting.meetingType}
              </span>
            </div>
          </div>

          {meeting.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{meeting.description}</p>
          )}

          {/* Meeting Info Grid - Mobile Responsive */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{meeting.dueDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">
                {formatTime(meeting.dueTime)} ({getDurationText(meeting.duration, meeting.durationUnit)})
              </span>
            </div>
            <div className="flex items-center gap-2 xs:col-span-2">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{meeting.location}</span>
              {isVirtualMeeting(meeting.location) && (
                <Video className="w-3 h-3 text-purple-500 ml-1" />
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-start">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 hover:bg-gray-100 rounded-lg"
            aria-label={expanded ? 'Collapse details' : 'Expand details'}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onDelete(meeting.id)}
            className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
            aria-label="Delete meeting"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile-Friendly Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <button
          onClick={handleCompleteMeeting}
          className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <CheckCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="truncate">Complete Meeting</span>
        </button>
        <button
          onClick={handlePostponeMeeting}
          className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <CalendarClock className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="truncate">Postpone Meeting</span>
        </button>
      </div>

      {/* Attendance Section */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Attendance ({meeting.attendees?.length || 0})
            </span>
          </div>
          <button
            onClick={() => setEditingAttendance(!editingAttendance)}
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <Edit2 className="w-3 h-3" />
            {editingAttendance ? 'Done' : 'Edit'}
          </button>
        </div>

        <div className="space-y-2">
          {meeting.attendees?.map((attendee, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`p-2 rounded-full ${attendee.status === 'present' ? 'bg-green-100 text-green-600' : 
                  attendee.status === 'late' ? 'bg-yellow-100 text-yellow-600' : 
                  attendee.status === 'absent' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                  {attendee.status === 'present' ? <UserCheck className="w-4 h-4" /> : 
                   attendee.status === 'absent' ? <UserX className="w-4 h-4" /> : 
                   <User className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-800 truncate">
                    {attendee.name}
                    {attendee.isHost && (
                      <span className="ml-2 text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">Host</span>
                    )}
                  </div>
                  {attendee.arrivalTime && (
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <ClockIcon className="w-3 h-3" />
                      Arrived at {attendee.arrivalTime}
                    </div>
                  )}
                </div>
              </div>
              
              {editingAttendance && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateArrivalTime(attendee.name)}
                    className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                  >
                    Present
                  </button>
                  <button
                    onClick={() => handleAttendanceUpdate(attendee.name, 'absent')}
                    className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Absent
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Attendance Summary */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="text-green-600 font-medium">Present</div>
              <div className="text-lg font-bold">
                {meeting.attendees?.filter(a => a.status === 'present').length || 0}
              </div>
            </div>
            <div className="text-center">
              <div className="text-yellow-600 font-medium">Late</div>
              <div className="text-lg font-bold">
                {meeting.attendees?.filter(a => a.status === 'late').length || 0}
              </div>
            </div>
            <div className="text-center">
              <div className="text-red-600 font-medium">Absent</div>
              <div className="text-lg font-bold">
                {meeting.attendees?.filter(a => a.status === 'absent').length || 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setShowAudioInput(true)}
          className="flex-1 min-w-[120px] px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 flex items-center justify-center gap-2 text-sm"
        >
          <Mic className="w-4 h-4" />
          <span className="truncate">Add Recording</span>
        </button>
        <button
          onClick={() => setIsEditingPreNotes(true)}
          className="flex-1 min-w-[120px] px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center justify-center gap-2 text-sm"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="truncate">Pre-Meeting</span>
        </button>
        <button
          onClick={() => setIsEditingMeetingNotes(true)}
          className="flex-1 min-w-[120px] px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center justify-center gap-2 text-sm"
        >
          <ClipboardList className="w-4 h-4" />
          <span className="truncate">Take Notes</span>
        </button>
      </div>

      {/* Expandable Details */}
      {expanded && (
        <div className="border-t pt-4 space-y-4">
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

          {/* Audio Recording Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Headphones className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Meeting Recording</span>
            </div>

            {showAudioInput ? (
              <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                <div className="mb-2">
                  <p className="text-sm text-gray-700 mb-1">Upload audio to Terabox and paste link:</p>
                  <input
                    type="url"
                    placeholder="https://terabox.com/..."
                    value={audioUrl}
                    onChange={(e) => setAudioUrl(e.target.value)}
                    className="w-full p-2 border rounded text-sm"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowAudioInput(false)}
                    className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAudio}
                    disabled={!audioUrl}
                    className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Audio
                  </button>
                </div>
              </div>
            ) : meeting.audioUrl ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200 gap-3">
                <div className="flex items-center gap-3">
                  <Headphones className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-800">Meeting Recording</div>
                    <div className="text-xs text-gray-500">Audio file available</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleAudio}
                    className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span className="text-sm">Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span className="text-sm">Play</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setAudioUrl('');
                      onUpdateMeeting(meeting.id, { audioUrl: null });
                    }}
                    className="p-2 hover:bg-red-50 text-red-600 rounded"
                    title="Remove audio"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center border-2 border-dashed border-gray-300 rounded-lg">
                <Mic className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No recording attached</p>
                <button
                  onClick={() => setShowAudioInput(true)}
                  className="mt-2 text-xs text-purple-600 hover:text-purple-800"
                >
                  + Add recording link
                </button>
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
                <div className="space-y-2 mb-2">
                  <input
                    type="text"
                    placeholder="File name (e.g., report.pdf)"
                    value={newFile.name}
                    onChange={(e) => setNewFile(prev => ({...prev, name: e.target.value}))}
                    className="w-full p-2 border rounded text-sm"
                  />
                  <input
                    type="url"
                    placeholder="File URL (https://...)"
                    value={newFile.url}
                    onChange={(e) => setNewFile(prev => ({...prev, url: e.target.value}))}
                    className="w-full p-2 border rounded text-sm"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
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
                    Add Link
                  </button>
                </div>
              </div>
            )}

            {meeting.files?.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {meeting.files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 bg-white rounded-lg border">
                        {getFileIconComponent(getFileType(file.name))}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-800 truncate">
                          {file.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatFileSize(file.size)} • {getFileType(file.name).toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
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

          {/* Notes Sections */}
          <div className="space-y-4">
            {/* Pre-Meeting Notes */}
            <div className="bg-blue-50 rounded-lg p-4">
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
                      className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-700 whitespace-pre-line">
                  {preMeetingNotes || (
                    <div className="text-gray-500 italic">
                      No pre-meeting notes added
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Meeting Notes */}
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Meeting Notes</span>
                </div>
                <button
                  onClick={() => setIsEditingMeetingNotes(!isEditingMeetingNotes)}
                  className="text-xs text-green-600 hover:text-green-800"
                >
                  {isEditingMeetingNotes ? 'Cancel' : 'Edit'}
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
                      className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-700 whitespace-pre-line">
                  {meetingNotes || (
                    <div className="text-gray-500 italic">
                      No meeting notes taken yet
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Status Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 pt-3 border-t text-xs text-gray-500 gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span>Created: {new Date(meeting.createdAt).toLocaleDateString()}</span>
          {meeting.status === 'completed' && meeting.completedAt && (
            <>
              <span className="text-gray-300">•</span>
              <span>Completed: {new Date(meeting.completedAt).toLocaleDateString()}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full ${getStatusColor(meeting.status)}`}>
            {meeting.status}
          </span>
          {meeting.audioUrl && (
            <span className="flex items-center gap-1 text-purple-600">
              <Headphones className="w-3 h-3" />
              Recorded
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingItem;