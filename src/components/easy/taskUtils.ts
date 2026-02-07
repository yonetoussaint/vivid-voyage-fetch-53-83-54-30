
import { 
  FileText, 
  Image, 
  Video, 
  File, 
  Folder,
  Volume2,
  Presentation
} from 'lucide-react';


// File type detection and utilities
export const getFileType = (fileName) => {
  if (!fileName) return 'other';
  
  const ext = fileName.split('.').pop().toLowerCase();
  
  if (['pdf'].includes(ext)) return 'pdf';
  if (['xlsx', 'xls', 'csv'].includes(ext)) return 'excel';
  if (['docx', 'doc', 'txt', 'rtf'].includes(ext)) return 'document';
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(ext)) return 'image';
  if (['mp4', 'avi', 'mov', 'wmv', 'mkv', 'flv', 'webm'].includes(ext)) return 'video';
  if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext)) return 'audio';
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'archive';
  if (['ppt', 'pptx'].includes(ext)) return 'presentation';
  return 'other';
};

export const getFileIcon = (fileType) => {
  const iconClasses = {
    pdf: 'text-red-500',
    excel: 'text-green-500',
    document: 'text-blue-500',
    image: 'text-purple-500',
    video: 'text-orange-500',
    audio: 'text-pink-500',
    archive: 'text-yellow-500',
    presentation: 'text-red-400',
    other: 'text-gray-500'
  };
  return iconClasses[fileType] || 'text-gray-500';
};

export const getFileIconComponent = (fileType, size = 'w-4 h-4') => {
  switch(fileType) {
    case 'pdf':
      return <FileText className={`${size} text-red-500`} />;
    case 'excel':
      return <FileText className={`${size} text-green-500`} />;
    case 'document':
      return <FileText className={`${size} text-blue-500`} />;
    case 'image':
      return <Image className={`${size} text-purple-500`} />;
    case 'video':
      return <Video className={`${size} text-orange-500`} />;
    case 'audio':
      return <Volume2 className={`${size} text-pink-500`} />;
    case 'archive':
      return <Folder className={`${size} text-yellow-500`} />;
    case 'presentation':
      return <Presentation className={`${size} text-red-400`} />;
    default:
      return <File className={`${size} text-gray-500`} />;
  }
};

// Priority utilities
export const getPriorityColor = (priority) => {
  const colors = {
    critical: 'bg-red-100 text-red-800 border-red-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  };
  return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export const getPriorityBadgeColor = (priority) => {
  const colors = {
    critical: 'bg-red-500 text-white',
    high: 'bg-orange-500 text-white',
    medium: 'bg-yellow-500 text-white',
    low: 'bg-green-500 text-white'
  };
  return colors[priority] || 'bg-gray-500 text-white';
};

// Meeting type utilities
export const getMeetingTypeColor = (meetingType) => {
  const colors = {
    staff: 'bg-blue-100 text-blue-800',
    safety: 'bg-red-100 text-red-800',
    training: 'bg-green-100 text-green-800',
    review: 'bg-purple-100 text-purple-800',
    planning: 'bg-yellow-100 text-yellow-800'
  };
  return colors[meetingType] || 'bg-gray-100 text-gray-800';
};

export const getMeetingTypeIcon = (meetingType) => {
  const icons = {
    staff: 'Users',
    safety: 'Shield',
    training: 'GraduationCap',
    review: 'ClipboardCheck',
    planning: 'Calendar'
  };
  return icons[meetingType] || 'Users';
};

// Status utilities
export const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-gray-100 text-gray-800 border-gray-200'
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

// Date and time utilities
export const formatMeetingDate = (date, time) => {
  const meetingDate = new Date(date);
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  const formattedDate = meetingDate.toLocaleDateString('en-US', options);
  
  if (time) {
    return `${formattedDate} • ${formatTime(time)}`;
  }
  return formattedDate;
};

export const formatTime = (time) => {
  if (!time) return '';
  
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
};

export const getDurationText = (duration, unit) => {
  if (!duration) return '';
  
  const numDuration = parseInt(duration, 10);
  
  if (unit === 'hours') {
    return numDuration === 1 ? '1 hour' : `${numDuration} hours`;
  }
  
  if (numDuration >= 60) {
    const hours = Math.floor(numDuration / 60);
    const minutes = numDuration % 60;
    
    if (minutes === 0) {
      return hours === 1 ? '1 hour' : `${hours} hours`;
    }
    
    return `${hours}h ${minutes}m`;
  }
  
  return `${numDuration} minutes`;
};

// File size formatting
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 'N/A') return 'N/A';
  
  if (typeof bytes === 'string') {
    return bytes; // Already formatted
  }
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
};

// Attendee utilities
export const filterAttendees = (attendees, searchTerm = '') => {
  if (!searchTerm) return attendees;
  
  return attendees.filter(attendee =>
    attendee.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const getAttendeeGroups = (attendees) => {
  const groups = {
    managers: [],
    staff: [],
    external: [],
    other: []
  };
  
  attendees.forEach(attendee => {
    const lowerAttendee = attendee.toLowerCase();
    
    if (lowerAttendee.includes('manager') || lowerAttendee.includes('director') || lowerAttendee.includes('head')) {
      groups.managers.push(attendee);
    } else if (lowerAttendee.includes('staff') || lowerAttendee.includes('employee') || lowerAttendee.includes('team')) {
      groups.staff.push(attendee);
    } else if (lowerAttendee.includes('external') || lowerAttendee.includes('vendor') || lowerAttendee.includes('client')) {
      groups.external.push(attendee);
    } else {
      groups.other.push(attendee);
    }
  });
  
  return groups;
};

// Meeting statistics
export const calculateMeetingStats = (meetings) => {
  const now = new Date();
  
  const stats = {
    total: meetings.length,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
    withFiles: 0,
    virtual: 0,
    inPerson: 0,
    totalDuration: 0,
    attendeesCount: 0
  };
  
  meetings.forEach(meeting => {
    // Count by status
    if (meeting.status === 'completed') stats.completed++;
    else if (meeting.status === 'cancelled') stats.cancelled++;
    else stats.upcoming++;
    
    // Count meetings with files
    if (meeting.files && meeting.files.length > 0) {
      stats.withFiles += meeting.files.length;
    }
    
    // Count virtual vs in-person
    if (meeting.location?.toLowerCase().includes('virtual')) {
      stats.virtual++;
    } else {
      stats.inPerson++;
    }
    
    // Calculate total duration
    if (meeting.duration) {
      const duration = parseInt(meeting.duration, 10);
      const unit = meeting.durationUnit || 'minutes';
      
      if (unit === 'hours') {
        stats.totalDuration += duration * 60;
      } else {
        stats.totalDuration += duration;
      }
    }
    
    // Count attendees
    if (meeting.attendees) {
      stats.attendeesCount += meeting.attendees.length;
    }
  });
  
  return stats;
};

// Search and filter utilities
export const searchMeetings = (meetings, searchTerm) => {
  if (!searchTerm) return meetings;
  
  const term = searchTerm.toLowerCase();
  
  return meetings.filter(meeting => {
    return (
      meeting.title.toLowerCase().includes(term) ||
      meeting.description?.toLowerCase().includes(term) ||
      meeting.agenda?.toLowerCase().includes(term) ||
      meeting.location?.toLowerCase().includes(term) ||
      meeting.meetingType?.toLowerCase().includes(term) ||
      meeting.assignedTo?.toLowerCase().includes(term) ||
      meeting.attendees?.some(attendee => attendee.toLowerCase().includes(term)) ||
      meeting.files?.some(file => file.name.toLowerCase().includes(term))
    );
  });
};

export const filterMeetingsByDate = (meetings, date) => {
  if (!date) return meetings;
  
  return meetings.filter(meeting => meeting.dueDate === date);
};

export const filterMeetingsByType = (meetings, type) => {
  if (!type || type === 'all') return meetings;
  
  return meetings.filter(meeting => meeting.meetingType === type);
};

export const filterMeetingsByStatus = (meetings, status) => {
  if (!status || status === 'all') return meetings;
  
  return meetings.filter(meeting => meeting.status === status);
};

export const filterMeetingsByPriority = (meetings, priority) => {
  if (!priority || priority === 'all') return meetings;
  
  return meetings.filter(meeting => meeting.priority === priority);
};

// Sort utilities
export const sortMeetings = (meetings, sortBy, sortOrder = 'asc') => {
  const sorted = [...meetings];
  
  sorted.sort((a, b) => {
    let comparison = 0;
    
    switch(sortBy) {
      case 'date':
        comparison = new Date(a.dueDate) - new Date(b.dueDate);
        break;
      case 'time':
        comparison = (a.dueTime || '').localeCompare(b.dueTime || '');
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'priority':
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      case 'status':
        const statusOrder = { pending: 0, 'in-progress': 1, completed: 2, cancelled: 3 };
        comparison = statusOrder[a.status] - statusOrder[b.status];
        break;
      case 'duration':
        const durationA = parseInt(a.duration || 0, 10);
        const durationB = parseInt(b.duration || 0, 10);
        comparison = durationA - durationB;
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });
  
  return sorted;
};

// Export/Import utilities
export const exportMeetingsToJSON = (meetings, fileName = 'meetings_export') => {
  const dataStr = JSON.stringify(meetings, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', `${fileName}_${new Date().toISOString().split('T')[0]}.json`);
  linkElement.click();
};

export const importMeetingsFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const importedMeetings = JSON.parse(e.target.result);
        resolve(importedMeetings);
      } catch (error) {
        reject(new Error('Invalid JSON file format'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
};

// Sample data generation
export const generateSampleMeetings = (date, vendeurs = []) => {
  const sampleMeetings = [
    {
      id: 1,
      title: 'Weekly Staff Meeting',
      description: 'Discuss weekly performance, safety protocols, and schedule for next week',
      priority: 'high',
      assignedTo: vendeurs[0] || 'Manager',
      dueDate: date,
      dueTime: '09:00',
      shift: 'AM',
      status: 'pending',
      location: 'Main Office',
      attendees: vendeurs.length > 0 ? vendeurs : ['Manager', 'Supervisor', 'Team Lead'],
      agenda: '1. Weekly performance review\n2. Safety protocol updates\n3. Schedule planning for next week\n4. Team feedback session',
      meetingType: 'staff',
      duration: '60',
      durationUnit: 'minutes',
      files: [
        { id: 1, name: 'Performance_Report_Q1_2024.pdf', type: 'pdf', url: 'https://example.com/files/report.pdf', size: '2.4MB' },
        { id: 2, name: 'Attendance_Sheet_Week12.xlsx', type: 'excel', url: 'https://example.com/files/attendance.xlsx', size: '1.2MB' },
        { id: 3, name: 'Meeting_Slides.pptx', type: 'presentation', url: 'https://example.com/files/slides.pptx', size: '3.7MB' }
      ],
      notes: 'Please bring your weekly reports. New safety guidelines will be distributed.',
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Safety Training Session',
      description: 'Monthly safety training for all staff members',
      priority: 'critical',
      assignedTo: vendeurs[0] || 'Manager',
      dueDate: date,
      dueTime: '14:00',
      shift: 'PM',
      status: 'pending',
      location: 'Training Room',
      attendees: ['All Staff Members'],
      agenda: '1. Review of safety protocols\n2. Emergency evacuation procedures\n3. Equipment safety demonstration\n4. Q&A session',
      meetingType: 'training',
      duration: '120',
      durationUnit: 'minutes',
      files: [
        { id: 1, name: 'Safety_Manual_V3.pdf', type: 'pdf', url: 'https://example.com/files/safety_manual.pdf', size: '3.1MB' },
        { id: 2, name: 'Training_Video_Demo.mp4', type: 'video', url: 'https://example.com/files/training_video.mp4', size: '45MB' },
        { id: 3, name: 'Safety_Equipment_Photos.zip', type: 'archive', url: 'https://example.com/files/photos.zip', size: '12MB' }
      ],
      notes: 'Mandatory attendance for all employees. Certificates will be issued upon completion.',
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      title: 'Quarterly Financial Review',
      description: 'Review of Q1 financial performance and budget planning for Q2',
      priority: 'high',
      assignedTo: 'Finance Manager',
      dueDate: date,
      dueTime: '11:00',
      shift: 'AM',
      status: 'in-progress',
      location: 'Virtual - Zoom',
      attendees: ['Finance Manager', 'Operations Manager', 'CEO', 'CFO'],
      agenda: '1. Q1 financial results\n2. Budget variance analysis\n3. Q2 budget proposal\n4. Cost optimization strategies',
      meetingType: 'review',
      duration: '90',
      durationUnit: 'minutes',
      files: [
        { id: 1, name: 'Q1_Financial_Report.pdf', type: 'pdf', url: 'https://example.com/files/q1_report.pdf', size: '4.2MB' },
        { id: 2, name: 'Budget_Analysis.xlsx', type: 'excel', url: 'https://example.com/files/budget_analysis.xlsx', size: '2.8MB' }
      ],
      notes: 'Zoom link will be shared 30 minutes before the meeting.',
      createdAt: new Date().toISOString()
    },
    {
      id: 4,
      title: 'New Product Planning',
      description: 'Brainstorming session for new product development',
      priority: 'medium',
      assignedTo: 'Product Manager',
      dueDate: date,
      dueTime: '15:30',
      shift: 'PM',
      status: 'pending',
      location: 'Conference Room',
      attendees: ['Product Team', 'Marketing Team', 'Design Team'],
      agenda: '1. Market analysis presentation\n2. New product ideas brainstorming\n3. Timeline discussion\n4. Resource allocation',
      meetingType: 'planning',
      duration: '120',
      durationUnit: 'minutes',
      files: [
        { id: 1, name: 'Market_Research.pdf', type: 'pdf', url: 'https://example.com/files/market_research.pdf', size: '5.1MB' },
        { id: 2, name: 'Competitor_Analysis.pptx', type: 'presentation', url: 'https://example.com/files/competitor_analysis.pptx', size: '6.3MB' },
        { id: 3, name: 'Product_Sketches.jpg', type: 'image', url: 'https://example.com/files/sketches.jpg', size: '8.7MB' }
      ],
      notes: 'Please come prepared with at least 3 new product ideas.',
      createdAt: new Date().toISOString()
    }
  ];

  return sampleMeetings;
};

// Validation utilities
export const validateMeetingData = (meeting) => {
  const errors = [];
  
  if (!meeting.title?.trim()) {
    errors.push('Meeting title is required');
  }
  
  if (!meeting.dueDate) {
    errors.push('Meeting date is required');
  }
  
  if (meeting.dueDate && new Date(meeting.dueDate) < new Date()) {
    errors.push('Meeting date cannot be in the past');
  }
  
  if (!meeting.assignedTo) {
    errors.push('Meeting host is required');
  }
  
  if (!meeting.attendees || meeting.attendees.length === 0) {
    errors.push('At least one attendee is required');
  }
  
  return errors;
};

export const validateFileLink = (fileName, fileUrl) => {
  const errors = [];
  
  if (!fileName.trim()) {
    errors.push('File name is required');
  }
  
  if (!fileUrl.trim()) {
    errors.push('File URL is required');
  } else {
    try {
      new URL(fileUrl);
    } catch (e) {
      errors.push('Invalid URL format');
    }
  }
  
  return errors;
};

// Helper function to get meeting duration in minutes
export const getDurationInMinutes = (duration, unit) => {
  const numDuration = parseInt(duration, 10);
  
  if (unit === 'hours') {
    return numDuration * 60;
  }
  
  return numDuration;
};

// Helper function to check if meeting is virtual
export const isVirtualMeeting = (location) => {
  return location?.toLowerCase().includes('virtual') || 
         location?.toLowerCase().includes('zoom') || 
         location?.toLowerCase().includes('teams') ||
         location?.toLowerCase().includes('meet');
};

// Helper function to get meeting time in 12-hour format
export const getMeetingTime12Hour = (time) => {
  if (!time) return '';
  
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
};

// Helper function to format meeting date for display
export const formatMeetingDateForDisplay = (date) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};