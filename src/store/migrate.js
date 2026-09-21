export const SCHEMA_VERSION = 1;

export function migrate(raw) {
  if (!raw || typeof raw !== "object") {
    return { version: SCHEMA_VERSION, habits: [], checks: {}, tasks: [] };
  }

  let data = { ...raw };

  if (!data.version || data.version < 1) {
    data = {
      version: 1,
      habits: Array.isArray(data.habits) ? data.habits : [],
      checks: data.checks && typeof data.checks === "object" ? data.checks : {},
      tasks: Array.isArray(data.tasks) ? data.tasks : [],
    };
  }

  data.version = SCHEMA_VERSION;
  return data;
}