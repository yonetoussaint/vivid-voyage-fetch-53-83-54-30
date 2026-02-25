import { HABITS } from '@/data/habitsData';
import { events } from '@/data/eventsData'; // <-- Add this import
import { formatDateKey } from '@/utils/dateHelpers';

// Dynamic events store
export const dynamicEvents = {};

export function addDynamicEvent(year: number, month: number, day: number, part: string, ev: any) {
  const key = formatDateKey(year, month, day);
  if (!dynamicEvents[key]) dynamicEvents[key] = { Dawn: [], Morning: [], Afternoon: [], Evening: [] };
  dynamicEvents[key][part].push(ev);
}

// Event overrides
const eventOverrides: Record<string, any> = {};

export function getOverrideKey(title: string, dateKey: string) {
  return `${title}|${dateKey}`;
}

export function getEventOverride(title: string, dateKey: string) {
  return eventOverrides[getOverrideKey(title, dateKey)] || {};
}

export function setEventOverride(title: string, dateKey: string, patch: any) {
  const k = getOverrideKey(title, dateKey);
  eventOverrides[k] = { ...(eventOverrides[k] || {}), ...patch };
}

// Habit completions
const habitCompletions: Record<string, boolean> = {};

export function markHabit(title: string, dateKey: string, done: boolean) {
  if (done) habitCompletions[`${title}|${dateKey}`] = true;
  else delete habitCompletions[`${title}|${dateKey}`];
}

export function isHabitDone(title: string, dateKey: string) {
  return !!habitCompletions[`${title}|${dateKey}`];
}

// Subtask completions
const subtaskCompletions: Record<string, boolean> = {};

export function getSubtaskKey(evTitle: string, dateKey: string, subtaskId: string) {
  return `${evTitle}|${dateKey}|${subtaskId}`;
}

export function markSubtask(evTitle: string, dateKey: string, subtaskId: string, done: boolean) {
  const k = getSubtaskKey(evTitle, dateKey, subtaskId);
  if (done) subtaskCompletions[k] = true;
  else delete subtaskCompletions[k];
}

export function isSubtaskDone(evTitle: string, dateKey: string, subtaskId: string) {
  return !!subtaskCompletions[getSubtaskKey(evTitle, dateKey, subtaskId)];
}

export function allSubtasksDone(ev: any, dateKey: string) {
  if (!ev.subtasks || ev.subtasks.length === 0) return false;
  const allDone = ev.subtasks.every((st: any) => isSubtaskDone(ev.title, dateKey, st.id));
  if (allDone) habitCompletions[`${ev.title}|${dateKey}`] = true;
  else delete habitCompletions[`${ev.title}|${dateKey}`];
  return allDone;
}

// --- NEW: getEventsForDay ---
export function getEventsForDay(year: number, month: number, day: number) {
  const dow = new Date(year, month, day).getDay();
  const base = (events as any)[day] || { Dawn: [], Morning: [], Afternoon: [], Evening: [] };
  const dateKey = formatDateKey(year, month, day);
  const dynDay = dynamicEvents[dateKey] || { Dawn: [], Morning: [], Afternoon: [], Evening: [] };

  const result = {
    Dawn: [...(base.Dawn || []), ...(dynDay.Dawn || [])],
    Morning: [...(base.Morning || []), ...(dynDay.Morning || [])],
    Afternoon: [...(base.Afternoon || []), ...(dynDay.Afternoon || [])],
    Evening: [...(base.Evening || []), ...(dynDay.Evening || [])],
  };

  HABITS.forEach((habit: any) => {
    const applies =
      habit.recurrence === 'daily' ||
      (habit.recurrence === 'weekly' && habit.days?.includes(dow));
    if (applies && !result[habit.part].find((e: any) => e.title === habit.title)) {
      result[habit.part].push(habit);
    }
  });

  // (Optional) inject money transactions here if needed (as in original code)

  return Object.values(result).some((arr) => arr.length > 0) ? result : null;
}