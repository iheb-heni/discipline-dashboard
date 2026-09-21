export function createButton({
  label,
  variant = "primary",
  onClick,
  type = "button",
} = {}) {
  const btn = document.createElement("button");
  btn.type = type;
  btn.className = `btn btn-${variant}`;
  btn.textContent = label;
  if (onClick) btn.addEventListener("click", onClick);
  return btn;
}