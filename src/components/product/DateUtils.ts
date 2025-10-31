// DateUtils.js - Separate component for date logic
export const isCurrentYear = (dateString: string): boolean => {
  const date = new Date(dateString);
  const currentYear = new Date().getFullYear();
  return date.getFullYear() === currentYear;
};

export const isLessThanAWeek = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays < 7;
};

export const isLessThanADay = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffHours = diffTime / (1000 * 60 * 60);
  return diffHours < 24;
};

export const isLessThanAnHour = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffMinutes = diffTime / (1000 * 60);
  return diffMinutes < 60;
};

export const isLessThanAMinute = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffSeconds = diffTime / 1000;
  return diffSeconds < 60;
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  
  // Less than a minute: "Just now"
  if (isLessThanAMinute(dateString)) {
    return 'Just now';
  }
  
  // Less than an hour: "Xm ago"
  if (isLessThanAnHour(dateString)) {
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    return `${diffMinutes}m ago`;
  }
  
  // Less than a day: "Xh ago" or "Today at X:XX AM/PM"
  if (isLessThanADay(dateString)) {
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    
    // If same calendar day, show "Today at time"
    if (date.getDate() === now.getDate() && 
        date.getMonth() === now.getMonth() && 
        date.getFullYear() === now.getFullYear()) {
      return `Today at ${formatTime(dateString)}`;
    }
    
    return `${diffHours}h ago`;
  }
  
  // Less than a week: "Xd ago" or "Yesterday at X:XX AM/PM"
  if (isLessThanAWeek(dateString)) {
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.getDate() === yesterday.getDate() && 
        date.getMonth() === yesterday.getMonth() && 
        date.getFullYear() === yesterday.getFullYear()) {
      return `Yesterday at ${formatTime(dateString)}`;
    }
    
    return `${diffDays}d ago`;
  }
  
  // Current year: "Month Day" (no year)
  if (isCurrentYear(dateString)) {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric'
    });
  }
  
  // Previous years: "Month Day, Year"
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Enhanced formatDateForReply function specifically for replies (more compact)
export const formatDateForReply = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  
  // Less than a minute: "Just now"
  if (isLessThanAMinute(dateString)) {
    return 'Now';
  }
  
  // Less than an hour: "Xm"
  if (isLessThanAnHour(dateString)) {
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    return `${diffMinutes}m`;
  }
  
  // Less than a day: "Xh"
  if (isLessThanADay(dateString)) {
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    return `${diffHours}h`;
  }
  
  // Less than a week: "Xd"
  if (isLessThanAWeek(dateString)) {
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays}d`;
  }
  
  // Current year: "MM/DD"
  if (isCurrentYear(dateString)) {
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric'
    });
  }
  
  // Previous years: "MM/DD/YY"
  return date.toLocaleDateString('en-US', {
    year: '2-digit',
    month: 'numeric',
    day: 'numeric'
  });
};