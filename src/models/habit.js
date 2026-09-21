import { uid } from "../utils/id.js";

export const CATEGORIES = {
  spiritualite: { label: "Spirituel", color: "#8B5CF6" },
  travail: { label: "Travail", color: "#2563EB" },
  discipline: { label: "Discipline", color: "#F59E0B" },
  sante: { label: "Santé", color: "#16A34A" },
};

export const CATEGORY_KEYS = Object.keys(CATEGORIES);

export function createHabit({
  name,
  target = "",
  cat = "spiritualite",
  order = 0,
} = {}) {
  return {
    id: uid(),
    name: name || "Nouvelle habitude",
    target,
    cat,
    order,
    createdAt: new Date().toISOString(),
    archived: false,
  };
}

export function defaultHabits() {
  const seed = [
    ["Salat Fajr", "", "spiritualite"],
    ["Salat Dohr", "", "spiritualite"],
    ["Salat Asr", "", "spiritualite"],
    ["Salat Maghreb", "", "spiritualite"],
    ["Salat Isha", "", "spiritualite"],
    ["Lecture du Coran", "au moins 2 pages", "spiritualite"],
    ["Code — projet PFE", "5h min", "travail"],
    ["Rédaction du rapport", "2h min", "travail"],
    ["Café entre amis", "max 1h30", "discipline"],
    ["Ne pas fumer", "", "discipline"],
    ["Pas de drogue", "", "discipline"],
    ["Pas d'alcool", "", "discipline"],
    ["Entraînement", "1h min", "sante"],
    ["Boire assez d'eau", "", "sante"],
    ["Sommeil", "7h min / nuit", "sante"],
    ["Créatine", "", "sante"],
  ];
  return seed.map(([name, target, cat], i) =>
    createHabit({ name, target, cat, order: i })
  );
}