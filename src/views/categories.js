import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  categoryKeys,
} from "../store/categories.js";
import { openModal } from "../components/modal.js";
import { state } from "../store/state.js";

const PRESET_COLORS = [
  "#2563EB",
  "#16A34A",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#6366F1",
];

export function renderCategoriesList(container) {
  container.innerHTML = "";
  const cats = getCategories();
  const keys = categoryKeys();

  keys.forEach((key) => {
    const cat = cats[key];

    const row = document.createElement("div");
    row.className = "category-row";

    const swatch = document.createElement("span");
    swatch.className = "cat-swatch";
    swatch.style.background = cat.color;

    const label = document.createElement("span");
    label.className = "cat-label";
    label.textContent = cat.label;

    const count = document.createElement("span");
    count.className = "cat-count";
    const n = state.habits.filter((h) => h.cat === key).length;
    count.textContent = `${n} habitude${n > 1 ? "s" : ""}`;

    const actions = document.createElement("div");
    actions.className = "cat-actions";

    const edit = document.createElement("button");
    edit.className = "icon-btn";
    edit.title = "Modifier";
    edit.textContent = "✎";
    edit.addEventListener("click", () => editCategory(key));

    const del = document.createElement("button");
    del.className = "icon-btn danger";
    del.title = "Supprimer";
    del.textContent = "×";
    del.addEventListener("click", () => confirmDelete(key));

    actions.appendChild(edit);
    actions.appendChild(del);

    row.appendChild(swatch);
    row.appendChild(label);
    row.appendChild(count);
    row.appendChild(actions);

    container.appendChild(row);
  });

  if (!keys.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "Aucune catégorie.";
    container.appendChild(empty);
  }
}

export function openAddCategory() {
  openCategoryModal(null);
}

function editCategory(key) {
  openCategoryModal(key);
}

function openCategoryModal(key) {
  const isEdit = !!key;
  const existing = isEdit ? getCategories()[key] : null;

  const form = document.createElement("div");

  const labelField = document.createElement("div");
  labelField.className = "field";
  labelField.innerHTML = `<label>Nom</label>`;
  const labelInput = document.createElement("input");
  labelInput.type = "text";
  labelInput.placeholder = "Ex. Santé";
  labelInput.value = existing ? existing.label : "";
  labelField.appendChild(labelInput);

  const colorField = document.createElement("div");
  colorField.className = "field";
  colorField.innerHTML = `<label>Couleur</label>`;
  const swatchWrap = document.createElement("div");
  swatchWrap.className = "color-swatches";
  let selectedColor = existing ? existing.color : PRESET_COLORS[0];

  PRESET_COLORS.forEach((c) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "color-swatch";
    btn.style.background = c;
    if (c === selectedColor) btn.classList.add("is-selected");
    btn.addEventListener("click", () => {
      selectedColor = c;
      swatchWrap
        .querySelectorAll(".color-swatch")
        .forEach((s) => s.classList.remove("is-selected"));
      btn.classList.add("is-selected");
    });
    swatchWrap.appendChild(btn);
  });

  colorField.appendChild(swatchWrap);

  form.appendChild(labelField);
  form.appendChild(colorField);

  openModal({
    title: isEdit ? "Modifier la catégorie" : "Nouvelle catégorie",
    body: form,
    confirmLabel: isEdit ? "Enregistrer" : "Ajouter",
    onConfirm: async () => {
      const label = labelInput.value.trim();
      if (!label) return false;
      if (isEdit) {
        await updateCategory(key, { label, color: selectedColor });
      } else {
        await addCategory({ label, color: selectedColor });
      }
      document.dispatchEvent(new CustomEvent("dd-categories-change"));
    },
  });
}

function confirmDelete(key) {
  const cats = getCategories();
  if (!cats[key]) return; // already deleted
  const cat = cats[key];
  const habitCount = state.habits.filter((h) => h.cat === key).length;

  // If only 1 category left, refuse
  if (categoryKeys().length <= 1) {
    openModal({
      title: "Suppression impossible",
      body: (() => {
        const p = document.createElement("p");
        p.textContent = "Vous devez conserver au moins une catégorie.";
        p.style.color = "var(--text-soft)";
        p.style.fontSize = "13.5px";
        return p;
      })(),
      confirmLabel: "OK",
      onConfirm: () => {},
    });
    return;
  }

  const body = document.createElement("div");

  if (habitCount > 0) {
    const p = document.createElement("p");
    p.textContent = `${habitCount} habitude(s) utilisent cette catégorie. Choisissez où les déplacer.`;
    p.style.color = "var(--text-soft)";
    p.style.fontSize = "13.5px";
    p.style.marginBottom = "10px";
    body.appendChild(p);

    const select = document.createElement("select");
    select.className = "select-full";
    categoryKeys()
      .filter((k) => k !== key)
      .forEach((k) => {
        const opt = document.createElement("option");
        opt.value = k;
        opt.textContent = cats[k].label;
        select.appendChild(opt);
      });
    body.appendChild(select);

    openModal({
      title: `Supprimer « ${cat.label} »`,
      body,
      confirmLabel: "Supprimer",
      danger: true,
      onConfirm: async () => {
        await deleteCategory(key, select.value);
        document.dispatchEvent(new CustomEvent("dd-categories-change"));
      },
    });
  } else {
    const p = document.createElement("p");
    p.textContent = `Supprimer la catégorie « ${cat.label} » ?`;
    p.style.color = "var(--text-soft)";
    p.style.fontSize = "13.5px";
    body.appendChild(p);

    openModal({
      title: "Supprimer la catégorie",
      body,
      confirmLabel: "Supprimer",
      danger: true,
      onConfirm: async () => {
        await deleteCategory(key, null);
        document.dispatchEvent(new CustomEvent("dd-categories-change"));
      },
    });
  }
}