import { get, set } from "./storage.js";

const KEY = "dd_theme";

export function getTheme() {
  return get([KEY]).then((r) => r[KEY] || "system");
}

export function setTheme(value) {
  return set({ [KEY]: value });
}

export function resolveTheme(pref) {
  if (pref === "light" || pref === "dark") return pref;
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

export function applyTheme(pref) {
  const resolved = resolveTheme(pref);
  document.documentElement.setAttribute("data-theme", resolved);
  document.documentElement.setAttribute("data-theme-pref", pref);
  return resolved;
}