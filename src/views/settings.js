import { resetAll } from "../store/state.js";
import { openModal } from "../components/modal.js";
import { applyTheme, setTheme } from "../store/theme.js";
import { getProfile, setProfile } from "../store/profile.js";
import { renderCategoriesList, openAddCategory } from "./categories.js";
export function renderSettings(refs) {
  const {
    segmented,
    resetBtn,
    themeLabel,
    themeIcon,
    themeToggle,
    userNameInput,
    saveProfileBtn,
    profileSavedMsg,
  } = refs;

  // ---------- Theme ----------
  function syncSegmented() {
    const pref =
      document.documentElement.getAttribute("data-theme-pref") || "system";
    segmented.querySelectorAll("button").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.themeChoice === pref);
    });
    const resolved = document.documentElement.getAttribute("data-theme");
    const labels = { light: "Light", dark: "Dark", system: "System" };
    if (themeLabel) themeLabel.textContent = labels[resolved] || "Light";
    if (themeIcon) themeIcon.textContent = resolved === "dark" ? "🌙" : "☀";
  }

  segmented.querySelectorAll("button").forEach((b) => {
    b.addEventListener("click", async () => {
      const pref = b.dataset.themeChoice;
      await setTheme(pref);
      applyTheme(pref);
      syncSegmented();
      document.dispatchEvent(new CustomEvent("dd-theme-change"));
    });
  });

  if (themeToggle) {
    themeToggle.addEventListener("click", async () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      await setTheme(next);
      applyTheme(next);
      syncSegmented();
      document.dispatchEvent(new CustomEvent("dd-theme-change"));
    });
  }
if (addCategoryBtn) {
  addCategoryBtn.addEventListener("click", openAddCategory);
}
if (categoriesList) {
  renderCategoriesList(categoriesList);
  document.addEventListener("dd-categories-change", () => {
    renderCategoriesList(categoriesList);
  });
}
  // ---------- Profile ----------
  if (userNameInput) {
    getProfile().then((p) => {
      userNameInput.value = p.name || "";
    });
  }

  if (saveProfileBtn && userNameInput) {
    const save = async () => {
      const name = userNameInput.value.trim();
      await setProfile({ name });
      if (profileSavedMsg) {
        profileSavedMsg.style.opacity = "1";
        setTimeout(() => (profileSavedMsg.style.opacity = "0"), 1400);
      }
      document.dispatchEvent(new CustomEvent("dd-profile-change"));
    };

    saveProfileBtn.addEventListener("click", save);
    userNameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") save();
    });
  }

  // ---------- Reset ----------
  resetBtn.addEventListener("click", () => {
    openModal({
      title: "Réinitialiser les données",
      body: (() => {
        const p = document.createElement("p");
        p.textContent =
          "Toutes vos cases cochées seront effacées et la liste d'habitudes par défaut sera restaurée.";
        p.style.color = "var(--text-soft)";
        p.style.fontSize = "13.5px";
        return p;
      })(),
      confirmLabel: "Réinitialiser",
      danger: true,
      onConfirm: () => resetAll(),
    });
  });

  syncSegmented();
  return { syncSegmented };
}