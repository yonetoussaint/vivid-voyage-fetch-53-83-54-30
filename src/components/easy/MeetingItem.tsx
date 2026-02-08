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
  CheckCircle,
  Circle,
  Trash2,
  Edit2,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  Paperclip,
  Plus,
  AlertCircle,
  Headphones,
  Play,
  Pause,
  Mic,
  CalendarClock,
  CheckCheck
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

  return (
    <div className={`p-4 bg-white border rounded-lg shadow-sm ${meeting.status === 'completed' ? 'border-green-300 bg-green-50' : 'border-blue-100'}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <button 
            onClick={() => onUpdateMeeting(meeting.id, { 
              status: meeting.status === 'completed' ? 'pending' : 'completed',
              completedAt: meeting.status === 'completed' ? null : new Date().toISOString()
            })}
            className="mt-0.5 flex-shrink-0"
            aria-label={meeting.status === 'completed' ? 'Mark as pending' : 'Mark as completed'}
          >
            {meeting.status === 'completed' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className={`text-base font-semibold truncate ${meeting.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {meeting.title}
              </h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(meeting.priority)} whitespace-nowrap`}>
                <Flag className="w-3 h-3 inline mr-1" />
                {meeting.priority}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${getMeetingTypeColor(meeting.meetingType)}`}>
                {meeting.meetingType}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(meeting.status)}`}>
                {meeting.status}
              </span>
            </div>

            {meeting.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{meeting.description}</p>
            )}

            <div className="flex items-center gap-3 mt-2 text-sm text-gray-700">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {meeting.dueDate}
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatTime(meeting.dueTime)} ({getDurationText(meeting.duration, meeting.durationUnit)})
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {meeting.location}
                {isVirtualMeeting(meeting.location) && (
                  <Video className="w-3 h-3 text-purple-500 ml-1" />
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
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

      {/* Action Buttons */}
      {meeting.status !== 'completed' && (
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={handleCompleteMeeting}
            className="flex-1 min-w-[140px] px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
          >
            <CheckCheck className="w-4 h-4" />
            Complete Meeting
          </button>
          <button
            onClick={handlePostponeMeeting}
            className="flex-1 min-w-[140px] px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 flex items-center justify-center gap-2"
          >
            <CalendarClock className="w-4 h-4" />
            Postpone Meeting
          </button>
        </div>
      )}

      {/* Files Section - Always Visible */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Attachments ({meeting.files?.length || 0})
            </span>
          </div>
          <button
            onClick={() => setShowFileInput(!showFileInput)}
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Add File Link
          </button>
        </div>

        {showFileInput && (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
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
                Add Link
              </button>
            </div>
          </div>
        )}

        {meeting.files?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {meeting.files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg border">
                    {getFileIconComponent(getFileType(file.name))}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-800 truncate max-w-[150px]">
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
            <p className="text-xs text-gray-400 mt-1">Add links to relevant files</p>
          </div>
        )}
      </div>

      {/* Audio Recording Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Meeting Recording</span>
          </div>
          {!meeting.audioUrl && (
            <button
              onClick={() => setShowAudioInput(!showAudioInput)}
              className="text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1"
            >
              <Mic className="w-3 h-3" />
              Add Audio Link
            </button>
          )}
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
            <div className="flex justify-end gap-2">
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
                Save Audio Link
              </button>
            </div>
          </div>
        ) : meeting.audioUrl ? (
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-3">
              <Headphones className="w-5 h-5 text-purple-600" />
              <div>
                <div className="text-sm font-medium text-gray-800">Meeting Recording</div>
                <div className="text-xs text-gray-500">Audio file linked</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleAudio}
                className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-1"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3 h-3" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3" />
                    Play
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setAudioUrl('');
                  onUpdateMeeting(meeting.id, { audioUrl: null });
                }}
                className="p-1.5 hover:bg-red-50 text-red-600 rounded"
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
            <p className="text-xs text-gray-400 mt-1">Record meeting and upload to Terabox</p>
          </div>
        )}
      </div>

      {/* Expandable Details */}
      {expanded && (
        <div className="border-t pt-4 space-y-4">
          {/* Attendees */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Attendees ({meeting.attendees?.length || 0} people)
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {meeting.attendees?.map((attendee, idx) => (
                <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700">{attendee}</span>
                  {attendee === meeting.assignedTo && (
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">Host</span>
                  )}
                </div>
              ))}
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
                <MessageSquare className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Pre-Meeting Notes</span>
              </div>
              <button
                onClick={() => setIsEditingPreNotes(!isEditingPreNotes)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                {isEditingPreNotes ? 'Cancel Edit' : 'Edit Notes'}
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
                    onClick={() => setIsEditingPreNotes(false)}
                    className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50 flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePreNotes}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                  >
                    <Save className="w-3 h-3" />
                    Save Notes
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-blue-50 rounded-lg">
                {preMeetingNotes ? (
                  <div className="text-sm text-gray-700 whitespace-pre-line">
                    {preMeetingNotes}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
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
                <MessageSquare className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Meeting Notes</span>
              </div>
              <button
                onClick={() => setIsEditingMeetingNotes(!isEditingMeetingNotes)}
                className="text-xs text-green-600 hover:text-green-800"
              >
                {isEditingMeetingNotes ? 'Cancel Edit' : 'Add/Edit Notes'}
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
                    onClick={() => setIsEditingMeetingNotes(false)}
                    className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50 flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveMeetingNotes}
                    className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"
                  >
                    <Save className="w-3 h-3" />
                    Save Notes
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-green-50 rounded-lg">
                {meetingNotes ? (
                  <div className="text-sm text-gray-700 whitespace-pre-line">
                    {meetingNotes}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    No meeting notes taken yet
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Metadata Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span>Created: {new Date(meeting.createdAt).toLocaleDateString()}</span>
          {meeting.status === 'completed' && meeting.completedAt && (
            <>
              <span className="text-gray-300">•</span>
              <span>Completed: {new Date(meeting.completedAt).toLocaleDateString()}</span>
            </>
          )}
          {meeting.audioUrl && (
            <>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1">
                <Headphones className="w-3 h-3" />
                Audio available
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          {isVirtualMeeting(meeting.location) ? (
            <span className="flex items-center gap-1">
              <Video className="w-3 h-3" />
              Virtual Meeting
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              In-Person
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingItem;