import { state, isChecked, toggleCheck } from "../store/state.js";
import { CATEGORIES } from "../models/habit.js";
import { DAYS_FR, todayIndex, todayKey } from "../utils/dates.js";
import { openModal } from "../components/modal.js";
import { createHabit } from "../models/habit.js";
import { addHabit, updateHabit, removeHabit } from "../store/state.js";

export function renderHabitsTable(headEl, bodyEl) {
  const tIdx = todayIndex();
  const dateKey = todayKey();

  headEl.innerHTML = "";
  const habitTh = document.createElement("th");
  habitTh.style.minWidth = "210px";
  habitTh.textContent = "Habitude";
  headEl.appendChild(habitTh);

  DAYS_FR.forEach((d, i) => {
    const th = document.createElement("th");
    th.className = "day-col" + (i === tIdx ? " is-today" : "");
    th.textContent = d;
    headEl.appendChild(th);
  });

  bodyEl.innerHTML = "";

  const sorted = [...state.habits].sort((a, b) => a.order - b.order);
  let currentCat = null;

  sorted.forEach((h) => {
    if (h.cat !== currentCat) {
      currentCat = h.cat;
      const catRow = document.createElement("tr");
      catRow.className = "cat-row";
      const cell = document.createElement("td");
      cell.colSpan = 8;
      const info = CATEGORIES[h.cat] || { label: h.cat, color: "#999" };
      cell.innerHTML = `<span class="cat-dot" style="background:${info.color}"></span>${info.label}`;
      catRow.appendChild(cell);
      bodyEl.appendChild(catRow);
    }

    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    const nameWrap = document.createElement("div");
    nameWrap.style.display = "flex";
    nameWrap.style.justifyContent = "space-between";
    nameWrap.style.alignItems = "center";
    nameWrap.style.gap = "8px";

    const left = document.createElement("div");
    const nameSpan = document.createElement("span");
    nameSpan.className = "habit-name";
    nameSpan.textContent = h.name;
    left.appendChild(nameSpan);
    if (h.target) {
      const targetSpan = document.createElement("span");
      targetSpan.className = "habit-target";
      targetSpan.textContent = h.target;
      left.appendChild(targetSpan);
    }

    const actions = document.createElement("span");
    actions.className = "row-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "icon-btn";
    editBtn.title = "Modifier";
    editBtn.textContent = "✎";
    editBtn.addEventListener("click", () => editHabit(h));

    const delBtn = document.createElement("button");
    delBtn.className = "icon-btn";
    delBtn.title = "Supprimer";
    delBtn.textContent = "×";
    delBtn.addEventListener("click", () => {
      if (confirm(`Supprimer « ${h.name} » ?`)) removeHabit(h.id);
    });

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    nameWrap.appendChild(left);
    nameWrap.appendChild(actions);
    nameCell.appendChild(nameWrap);
    row.appendChild(nameCell);

    // NOTE: checks are stored per-date. For the current week we approximate by
    // using todayKey only when d === todayIndex, otherwise no stored check.
    for (let d = 0; d < 7; d++) {
      const td = document.createElement("td");
      td.className = "day-col" + (d === tIdx ? " is-today" : "");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.className = "habit-check";
      const cellDateKey = d === tIdx ? dateKey : `${dateKey}#${d}`;
      input.checked = isChecked(h.id, cellDateKey);
      input.dataset.habit = h.id;
      input.dataset.date = cellDateKey;
      input.addEventListener("change", (e) => {
        toggleCheck(h.id, e.target.dataset.date);
      });
      td.appendChild(input);
      row.appendChild(td);
    }

    bodyEl.appendChild(row);
  });
}

export function renderAddHabitButton(container) {
  const toolbar = document.createElement("div");
  toolbar.className = "toolbar";

  const addBtn = document.createElement("button");
  addBtn.className = "btn btn-primary";
  addBtn.textContent = "+ Ajouter une habitude";
  addBtn.addEventListener("click", () => editHabit(null));

  toolbar.appendChild(addBtn);
  container.insertBefore(toolbar, container.firstChild);
}

function editHabit(habit) {
  const form = document.createElement("div");

  const nameField = document.createElement("div");
  nameField.className = "field";
  nameField.innerHTML = `<label>Nom</label>`;
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.value = habit ? habit.name : "";
  nameField.appendChild(nameInput);

  const targetField = document.createElement("div");
  targetField.className = "field";
  targetField.innerHTML = `<label>Objectif (optionnel)</label>`;
  const targetInput = document.createElement("input");
  targetInput.type = "text";
  targetInput.value = habit ? habit.target || "" : "";
  targetField.appendChild(targetInput);

  const catField = document.createElement("div");
  catField.className = "field";
  catField.innerHTML = `<label>Catégorie</label>`;
  const catSelect = document.createElement("select");
  Object.entries(CATEGORIES).forEach(([key, info]) => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = info.label;
    if (habit && habit.cat === key) opt.selected = true;
    catSelect.appendChild(opt);
  });
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