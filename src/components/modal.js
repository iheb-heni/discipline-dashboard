export function openModal({
  title,
  body,
  onConfirm,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  danger = false,
}) {
  const root = document.getElementById("modalRoot") || document.body;

  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";

  const modal = document.createElement("div");
  modal.className = "modal";

  const header = document.createElement("div");
  header.className = "modal-header";
  header.textContent = title;

  const content = document.createElement("div");
  content.className = "modal-body";
  content.appendChild(body);

  const footer = document.createElement("div");
  footer.className = "modal-footer";

  const cancel = document.createElement("button");
  cancel.className = "btn btn-ghost";
  cancel.textContent = cancelLabel;
  cancel.addEventListener("click", close);

  const confirm = document.createElement("button");
  confirm.className = "btn " + (danger ? "btn-danger" : "btn-primary");
  confirm.textContent = confirmLabel;
  confirm.addEventListener("click", () => {
    const result = onConfirm ? onConfirm() : true;
    if (result !== false) close();
  });

  footer.appendChild(cancel);
  footer.appendChild(confirm);

  modal.appendChild(header);
  modal.appendChild(content);
  modal.appendChild(footer);
  backdrop.appendChild(modal);
  root.appendChild(backdrop);

  const onKey = (e) => {
    if (e.key === "Escape") close();
    if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
      e.preventDefault();
      confirm.click();
    }
  };
  document.addEventListener("keydown", onKey);

  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) close();
  });

  const firstInput = content.querySelector("input, select, textarea");
  if (firstInput) setTimeout(() => firstInput.focus(), 30);

  function close() {
    document.removeEventListener("keydown", onKey);
    backdrop.remove();
  }

  return { close };
}
