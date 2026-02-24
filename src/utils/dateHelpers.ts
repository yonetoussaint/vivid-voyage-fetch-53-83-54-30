export const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
export const DAY_LABELS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
export const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
export const DAY_SHORT = ["M","T","W","T","F","S","S"];

export function getDaysInMonth(year, month) { 
  return new Date(year, month + 1, 0).getDate(); 
}

export function getFirstDayOfWeek(year, month) { 
  const d = new Date(year, month, 1).getDay(); 
  return (d + 6) % 7; 
}

export function formatDateKey(year, month, day) {
  return `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}

export function getTodayKey() {
  const now = new Date();
  return formatDateKey(now.getFullYear(), now.getMonth(), now.getDate());
}