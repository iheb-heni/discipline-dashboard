export function createCheckbox({ checked = false, onChange } = {}) {
  const input = document.createElement("input");
  input.type = "checkbox";
  input.className = "habit-check";
  input.checked = checked;
  if (onChange) input.addEventListener("change", onChange);
  return input;
}