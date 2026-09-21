import { get, set } from "./storage.js";
import { migrate, SCHEMA_VERSION } from "./migrate.js";
import { defaultHabits } from "../models/habit.js";

const STORAGE_KEY = "dd_state_v1";

const listeners = new Set();

export const state = {
  version: SCHEMA_VERSION,
  habits: [],
  checks: {}, // { [habitId]: { [dateKey]: true } }
  tasks: [],
  ready: false,
};

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit() {
  for (const fn of listeners) fn(state);
}

export async function load() {
  const res = await get([STORAGE_KEY]);
  const raw = res[STORAGE_KEY];
  const data = migrate(raw);

  if (!data.habits.length) {
    data.habits = defaultHabits();
  }

  Object.assign(state, data);
  state.ready = true;
  await persist();
  emit();
}

export async function persist() {
  const payload = {
    version: state.version,
    habits: state.habits,
    checks: state.checks,
    tasks: state.tasks,
  };
  await set({ [STORAGE_KEY]: payload });
}

export function toggleCheck(habitId, dateKey) {
  if (!state.checks[habitId]) state.checks[habitId] = {};
  if (state.checks[habitId][dateKey]) {
    delete state.checks[habitId][dateKey];
  } else {
    state.checks[habitId][dateKey] = true;
  }
  persist();
  emit();
}

export function isChecked(habitId, dateKey) {
  return !!(state.checks[habitId] && state.checks[habitId][dateKey]);
}

export function addHabit(habit) {
  state.habits.push(habit);
  persist();
  emit();
}

export function updateHabit(id, patch) {
  const h = state.habits.find((x) => x.id === id);
  if (!h) return;
  Object.assign(h, patch);
  persist();
  emit();
}

export function removeHabit(id) {
  state.habits = state.habits.filter((x) => x.id !== id);
  delete state.checks[id];
  persist();
  emit();
}

export function reorderHabits(orderedIds) {
  orderedIds.forEach((id, index) => {
    const h = state.habits.find((x) => x.id === id);
    if (h) h.order = index;
  });
  state.habits.sort((a, b) => a.order - b.order);
  persist();
  emit();
}

export function addTask(task) {
  state.tasks.push(task);
  persist();
  emit();
}

export function updateTask(id, patch) {
  const t = state.tasks.find((x) => x.id === id);
  if (!t) return;
  Object.assign(t, patch);
  persist();
  emit();
}

export function removeTask(id) {
  state.tasks = state.tasks.filter((x) => x.id !== id);
  persist();
  emit();
}

export function resetAll() {
  state.habits = defaultHabits();
  state.checks = {};
  state.tasks = [];
  persist();
  emit();
}