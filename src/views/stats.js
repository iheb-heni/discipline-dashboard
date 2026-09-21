import { state } from "../store/state.js";
import { CATEGORY_KEYS } from "../models/habit.js";
import { todayIndex, todayKey } from "../utils/dates.js";

export function computeTodayCount() {
  const dk = todayKey();
  let count = 0;
  for (const h of state.habits) {
    if (state.checks[h.id] && state.checks[h.id][dk]) count++;
  }
  return count;
}

export function computeWeekCounts() {
  const dk = todayKey();
  const counts = new Array(7).fill(0);
  for (const h of state.habits) {
    const map = state.checks[h.id] || {};
    for (let d = 0; d < 7; d++) {
      const key = d === todayIndex() ? dk : `${dk}#${d}`;
      if (map[key]) counts[d]++;
    }
  }
  return counts;
}

export function computeWeekTotal() {
  return computeWeekCounts().reduce((a, b) => a + b, 0);
}

export function computeCategoryTotals() {
  const week = computeWeekCounts();
  const total = week.reduce((a, b) => a + b, 0);
  const perCat = CATEGORY_KEYS.map(() => 0);
  const counts = CATEGORY_KEYS.map(() => 0);

  state.habits.forEach((h) => {
    const idx = CATEGORY_KEYS.indexOf(h.cat);
    if (idx >= 0) counts[idx]++;
  });

  const totalHabits = counts.reduce((a, b) => a + b, 0) || 1;
  CATEGORY_KEYS.forEach((k, i) => {
    perCat[i] = Math.round((counts[i] / totalHabits) * total);
  });
  return perCat;
}

export function computeStreak() {
  // current streak = consecutive days (backwards from today) where at least 1 habit done
  const dk = todayKey();
  // We only have per-day markers for the current week via keys `dk#d`
  // Approximate: count backward consecutive days with at least one check.
  const tIdx = todayIndex();
  let streak = 0;
  for (let d = tIdx; d >= 0; d--) {
    const key = d === tIdx ? dk : `${dk}#${d}`;
    let any = false;
    for (const h of state.habits) {
      if (state.checks[h.id] && state.checks[h.id][key]) {
        any = true;
        break;
      }
    }
    if (any) streak++;
    else break;
  }
  return streak;
}

export function computeTodayList() {
  const dk = todayKey();
  return [...state.habits]
    .sort((a, b) => a.order - b.order)
    .map((h) => ({
      id: h.id,
      name: h.name,
      done: !!(state.checks[h.id] && state.checks[h.id][dk]),
    }));
}

export function computeTodayTotal() {
  return state.habits.length;
}