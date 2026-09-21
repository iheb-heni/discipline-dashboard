import { uid } from "../utils/id.js";

export function createTask({ title, habitId = null, order = 0 } = {}) {
  return {
    id: uid(),
    title: title || "Nouvelle tâche",
    habitId,
    order,
    done: false,
    createdAt: new Date().toISOString(),
    subtasks: [],
  };
}

export function createSubtask({ title } = {}) {
  return {
    id: uid(),
    title: title || "Nouvelle sous-tâche",
    done: false,
  };
}