import {
  state,
  isChecked,
  toggleCheck,
  addHabit,
  updateHabit,
  removeHabit,
} from "../store/state.js";
import { createHabit } from "../models/habit.js";
import { DAYS_FR, todayIndex, todayKey } from "../utils/dates.js";
import { openModal } from "../components/modal.js";
import {
  getCategories,
  categoryKeys,
  categoryColor,
  categoryLabel,
} from "../store/categories.js";

export function renderHabitsList(container) {
  container.innerHTML = "";
  const tIdx = todayIndex();
  const dk = todayKey();

  const sorted = [...state.habits].sort((a, b) => a.order - b.order);

  if (!sorted.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent =
      "Aucune habitude. Cliquez sur « Nouvelle habitude » pour commencer.";
    container.appendChild(empty);
    return;
  }

  sorted.forEach((h) => {
    const cat = { label: categoryLabel(h.cat), color: categoryColor(h.cat) };

    const row = document.createElement("div");
    row.className = "habit-row";

    // Left check (today)
    const checkWrap = document.createElement("div");
    checkWrap.className = "habit-check-wrap";
    const checkBtn = document.createElement("button");
    checkBtn.className = "habit-check";
    checkBtn.type = "button";
    checkBtn.title = "Cocher aujourd'hui";
    const done = isChecked(h.id, dk);
    if (done) checkBtn.classList.add("is-done");
    checkBtn.textContent = "✓";
    checkBtn.addEventListener("click", () => toggleCheck(h.id, dk));
    checkWrap.appendChild(checkBtn);

    // Middle: name + meta
    const main = document.createElement("div");
    main.className = "habit-main";

    const nameEl = document.createElement("div");
    nameEl.className = "habit-name";
    nameEl.textContent = h.name;

    const meta = document.createElement("div");
    meta.className = "habit-meta";

    const catPill = document.createElement("span");
    catPill.className = "pill";
    catPill.innerHTML = `<span class="pill-dot" style="background:${cat.color}"></span>${cat.label}`;
    meta.appendChild(catPill);

    if (h.target) {
      const t = document.createElement("span");
      t.className = "habit-target";
      t.textContent = h.target;
      meta.appendChild(t);
    }

    main.appendChild(nameEl);
    main.appendChild(meta);

    // Right: days + actions
    const right = document.createElement("div");
    right.style.display = "flex";
    right.style.alignItems = "center";
    right.style.gap = "12px";

    const daysWrap = document.createElement("div");
    daysWrap.className = "habit-days";
    for (let d = 0; d < 7; d++) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "day-dot";
      if (d === tIdx) btn.classList.add("is-today");
      const key = d === tIdx ? dk : `${dk}#${d}`;
      if (isChecked(h.id, key)) btn.classList.add("is-done");
      btn.textContent = DAYS_FR[d].charAt(0);
      btn.title = DAYS_FR[d];
      btn.addEventListener("click", () => toggleCheck(h.id, key));
      daysWrap.appendChild(btn);
    }

    const actions = document.createElement("div");
    actions.className = "habit-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "icon-btn";
    editBtn.title = "Modifier";
    editBtn.textContent = "✎";
    editBtn.addEventListener("click", () => editHabit(h));

    const delBtn = document.createElement("button");
    delBtn.className = "icon-btn danger";
    delBtn.title = "Supprimer";
    delBtn.textContent = "×";
    delBtn.addEventListener("click", () => {
      openModal({
        title: "Supprimer l'habitude",
        body: (() => {
          const p = document.createElement("p");
          p.textContent = `Supprimer « ${h.name} » ? Cette action est irréversible.`;
          p.style.color = "var(--text-soft)";
          p.style.fontSize = "13.5px";
          return p;
        })(),
        confirmLabel: "Supprimer",
        danger: true,
        onConfirm: () => removeHabit(h.id),
      });
    });

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    right.appendChild(daysWrap);
    right.appendChild(actions);

    row.appendChild(checkWrap);
    row.appendChild(main);
    row.appendChild(right);

    container.appendChild(row);
  });
}

export function renderCategoryLegend(container) {
  container.innerHTML = "";
  const cats = getCategories();
  Object.entries(cats).forEach(([key, info]) => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = info.label;
    if (habit && habit.cat === key) opt.selected = true;
    catSelect.appendChild(opt);
  });
  // Fallback: if no category matches and it's a new habit, preselect the first
  if (!habit && catSelect.options.length) {
    catSelect.selectedIndex = 0;
  }
}

export function editHabit(habit) {
  const form = document.createElement("div");

  const nameField = document.createElement("div");
  nameField.className = "field";
  const nameLabel = document.createElement("label");
  nameLabel.textContent = "Nom";
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.placeholder = "Ex. Lire 20 pages";
  nameInput.value = habit ? habit.name : "";
  nameField.appendChild(nameLabel);
  nameField.appendChild(nameInput);

  const targetField = document.createElement("div");
  targetField.className = "field";
  const targetLabel = document.createElement("label");
  targetLabel.textContent = "Objectif (optionnel)";
  const targetInput = document.createElement("input");
  targetInput.type = "text";
  targetInput.placeholder = "Ex. 30 min";
  targetInput.value = habit ? habit.target || "" : "";
  targetField.appendChild(targetLabel);
  targetField.appendChild(targetInput);

  const catField = document.createElement("div");
  catField.className = "field";
  const catLabel = document.createElement("label");
  catLabel.textContent = "Catégorie";
  const catSelect = document.createElement("select");
  Object.entries(CATEGORIES).forEach(([key, info]) => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = info.label;
    if (habit && habit.cat === key) opt.selected = true;
    catSelect.appendChild(opt);
  });
  catField.appendChild(catLabel);
  catField.appendChild(catSelect);

  form.appendChild(nameField);
  form.appendChild(targetField);
  form.appendChild(catField);

  openModal({
    title: habit ? "Modifier l'habitude" : "Nouvelle habitude",
    body: form,
    confirmLabel: habit ? "Enregistrer" : "Ajouter",
    onConfirm: () => {
      const name = nameInput.value.trim();
      if (!name) return false;
      const target = targetInput.value.trim();
      const cat = catSelect.value;
      if (habit) {
        updateHabit(habit.id, { name, target, cat });
      } else {
        const order = state.habits.length;
        addHabit(createHabit({ name, target, cat, order }));
      }
    },
  });
}
