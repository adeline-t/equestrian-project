import { timeToMinutes } from '../helpers/formatters';

export const CALENDAR_CONFIG = {
  HOUR_HEIGHT: 60,
  START_HOUR: 10,
  END_HOUR: 22,
  MIN_SELECTION_DURATION: 30,
};

export function calculateSlotPosition(slot, HOUR_HEIGHT, START_HOUR) {
  if (!slot.start_time || !slot.end_time) return { top: 0, height: 0 };

  const startMinutes = timeToMinutes(slot.start_time);
  const endMinutes = timeToMinutes(slot.end_time);
  const startOffsetMinutes = startMinutes - START_HOUR * 60;
  const durationMinutes = endMinutes - startMinutes;

  const top = (startOffsetMinutes / 60) * HOUR_HEIGHT;
  const height = (durationMinutes / 60) * HOUR_HEIGHT;

  return { top, height };
}

export function calculateSelectionStyle(startTime, endTime, HOUR_HEIGHT, START_HOUR, END_HOUR) {
  if (!startTime || !endTime) return null;

  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const top = ((Math.min(startMinutes, endMinutes) - START_HOUR * 60) / 60) * HOUR_HEIGHT;
  const height = (Math.abs(endMinutes - startMinutes) / 60) * HOUR_HEIGHT;

  return { top, height };
}

export function getValidSlots(slots, START_HOUR, END_HOUR) {
  if (!slots) return [];
  return slots.filter((slot) => {
    const startH = Number(slot.start_time?.split(':')[0]);
    return startH >= START_HOUR && startH < END_HOUR;
  });
}
