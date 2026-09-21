export const SCHEMA_VERSION = 2;

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

  if (data.version < 2) {
    data.version = 2;
  }

  data.version = SCHEMA_VERSION;
  return data;
}