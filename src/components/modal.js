export function openModal({ title, body, onConfirm, confirmLabel = "Valider" }) {
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
  cancel.textContent = "Annuler";
  cancel.addEventListener("click", close);

  const confirm = document.createElement("button");
  confirm.className = "btn btn-primary";
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
  document.body.appendChild(backdrop);

  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) close();
  });

  function close() {
    backdrop.remove();
  }

  return { close };
}