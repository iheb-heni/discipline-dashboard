import { get, set } from "./storage.js";

const KEY = "dd_categories";

export const DEFAULT_CATEGORIES = {};
let cache = { ...DEFAULT_CATEGORIES };
let loaded = false;
const listeners = new Set();

export function getCategories() {
  return cache;
}

export function subscribeCategories(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit() {
  for (const fn of listeners) fn(cache);
}

export async function loadCategories() {
  const res = await get([KEY]);
  const stored = res[KEY];
  if (stored && typeof stored === "object") {
  cache = { ...stored };
} else {
  cache = { ...DEFAULT_CATEGORIES }; 
}
  loaded = true;
  emit();
  return cache;
}

async function persist() {
  await set({ [KEY]: cache });
  emit();
}

export function isLoaded() {
  return loaded;
}

function slugify(str) {
  return (
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "cat"
  );
}

export async function addCategory({ label, color }) {
  let key = slugify(label);
  let i = 1;
  while (cache[key]) {
    key = `${slugify(label)}-${i++}`;
  }
  cache[key] = { label: label.trim(), color };
  await persist();
  return key;
}

export async function updateCategory(key, patch) {
  if (!cache[key]) return;
  cache[key] = { ...cache[key], ...patch };
  await persist();
}

export async function deleteCategory(key, reassignTo = null) {
  if (!cache[key]) return;
  // Reassign habits before removing
  const { state, updateHabit } = await import("./state.js");
  if (reassignTo && cache[reassignTo]) {
    for (const h of state.habits) {
      if (h.cat === key) updateHabit(h.id, { cat: reassignTo });
    }
  }
  delete cache[key];
  await persist();
}

export function categoryLabel(key) {
  return cache[key] ? cache[key].label : key;
}

export function categoryColor(key) {
  return cache[key] ? cache[key].color : "#999999";
}

export function categoryKeys() {
  return Object.keys(cache);
}