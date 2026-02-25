import { HABITS } from '@/data/habitsData';
import { formatDateKey } from '@/hooks/dateHelpers';

// Dynamic events store
export const dynamicEvents = {};

export function addDynamicEvent(year, month, day, part, ev) {
  const key = formatDateKey(year, month, day);
  if (!dynamicEvents[key]) dynamicEvents[key] = { Dawn: [], Morning: [], Afternoon: [], Evening: [] };
  dynamicEvents[key][part].push(ev);
}

// Event overrides
const eventOverrides = {};

export function getOverrideKey(title, dateKey) { 
  return `${title}|${dateKey}`; 
}

export function getEventOverride(title, dateKey) { 
  return eventOverrides[getOverrideKey(title, dateKey)] || {}; 
}

export function setEventOverride(title, dateKey, patch) {
  const k = getOverrideKey(title, dateKey);
  eventOverrides[k] = { ...(eventOverrides[k] || {}), ...patch };
}

// Habit completions
const habitCompletions = {};

export function markHabit(title, dateKey, done) { 
  if (done) habitCompletions[`${title}|${dateKey}`] = true; 
  else delete habitCompletions[`${title}|${dateKey}`]; 
}

export function isHabitDone(title, dateKey) { 
  return !!habitCompletions[`${title}|${dateKey}`]; 
}

// Subtask completions
const subtaskCompletions = {};

export function getSubtaskKey(evTitle, dateKey, subtaskId) { 
  return `${evTitle}|${dateKey}|${subtaskId}`; 
}

export function markSubtask(evTitle, dateKey, subtaskId, done) {
  const k = getSubtaskKey(evTitle, dateKey, subtaskId);
  if (done) subtaskCompletions[k] = true; 
  else delete subtaskCompletions[k];
}

export function isSubtaskDone(evTitle, dateKey, subtaskId) {
  return !!subtaskCompletions[getSubtaskKey(evTitle, dateKey, subtaskId)];
}

export function allSubtasksDone(ev, dateKey) {
  if (!ev.subtasks || ev.subtasks.length === 0) return false;
  const allDone = ev.subtasks.every(st => isSubtaskDone(ev.title, dateKey, st.id));
  if (allDone) habitCompletions[`${ev.title}|${dateKey}`] = true;
  else delete habitCompletions[`${ev.title}|${dateKey}`];
  return allDone;
}