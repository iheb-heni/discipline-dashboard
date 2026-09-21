import { uid } from "../utils/id.js";

export function createHabit({
  name,
  target = "",
  cat = "",
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
  return [
    createHabit({
      name: "Travail",
      target: "4 à 6 heures",
      cat: "",
      order: 0,
    }),
  ];
}