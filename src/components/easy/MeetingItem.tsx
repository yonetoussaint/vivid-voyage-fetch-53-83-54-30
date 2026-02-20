import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Clock, 
  Video,
  MessageSquare,
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
  Clock as ClockIcon,
  Download,
  Upload,
  Headphones
} from 'lucide-react';
import {
  getFileType,
  getFileIconComponent,
  getMeetingTypeColor,
  formatTime,
  getDurationText,
  isVirtualMeeting
} from './taskUtils';

const MeetingItem = ({ meeting, onDelete, onUpdateMeeting, onAddFile, onRemoveFile }) => {
  const [expanded, setExpanded] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(meeting.notes || '');
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

  const handleSaveNotes = () => {
    onUpdateMeeting(meeting.id, { notes });
    setIsEditingNotes(false);
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

      {/* Attendees List - Simple display only */}
      {meeting.attendees && meeting.attendees.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Attendees ({meeting.attendees.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {meeting.attendees.map((attendee, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm border border-gray-200"
              >
                {attendee}
                {attendee === meeting.assignedTo && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">Host</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

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
          {/* Notes Section - Single unified notes field */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Notes</span>
              </div>
              <button
                onClick={() => setIsEditingNotes(!isEditingNotes)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                {isEditingNotes ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {isEditingNotes ? (
              <div className="space-y-2">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add meeting notes, discussion points, action items, etc..."
                  className="w-full p-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleSaveNotes}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                  >
                    <Save className="w-3 h-3" />
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg min-h-[60px]">
                {notes ? (
                  <div className="text-sm text-gray-700 whitespace-pre-line">
                    {notes}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic">
                    No notes added yet
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