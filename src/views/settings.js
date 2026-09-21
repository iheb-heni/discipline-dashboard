import { openModal } from "../components/modal.js";
import { resetAll } from "../store/state.js";

export function renderSettingsButton(container) {
  const toolbar = document.createElement("div");
  toolbar.className = "toolbar";

  const btn = document.createElement("button");
  btn.className = "btn btn-ghost";
  btn.textContent = "Paramètres";
  btn.addEventListener("click", openSettings);

  toolbar.appendChild(btn);
  container.appendChild(toolbar);
}

function openSettings() {
  const wrap = document.createElement("div");

  const info = document.createElement("p");
  info.style.margin = "0";
  info.style.fontSize = "0.85rem";
  info.style.color = "var(--ink-soft)";
  info.textContent =
    "Réinitialiser efface toutes vos habitudes cochées et restaure la liste par défaut.";
  wrap.appendChild(info);

  openModal({
    title: "Paramètres",
    body: wrap,
    confirmLabel: "Réinitialiser",
    onConfirm: () => {
      if (confirm("Confirmer la réinitialisation ?")) {
        resetAll();
      }
      return true;
    },
  });
}