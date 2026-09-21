import { state } from "../store/state.js";
import { todayIndex, todayKey } from "../utils/dates.js";
import { categoryKeys } from "../store/categories.js";

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
  const keys = categoryKeys();
  const perCat = {};
  const counts = {};

  keys.forEach((k) => {
    perCat[k] = 0;
    counts[k] = 0;
  });

  state.habits.forEach((h) => {
    if (counts[h.cat] !== undefined) counts[h.cat]++;
  });

  const totalHabits = Object.values(counts).reduce((a, b) => a + b, 0) || 1;

  keys.forEach((k) => {
    perCat[k] = Math.round((counts[k] / totalHabits) * total);
  });

  return perCat;
}

export function computeStreak() {
  const dk = todayKey();
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