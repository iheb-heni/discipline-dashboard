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

export function computeCategoryTotals() {
  const week = computeWeekCounts();
  const total = week.reduce((a, b) => a + b, 0);
  // distribute proportionally per category based on habit count
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