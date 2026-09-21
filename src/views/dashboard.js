import {
  subscribe,
  load,
  state,
} from "../store/state.js";
import { renderHabitsTable, renderAddHabitButton } from "./habitsTable.js";
import {
  computeTodayCount,
  computeWeekCounts,
  computeCategoryTotals,
} from "./stats.js";
import { renderSettingsButton } from "./settings.js";
import { todayIndex, formatLongDate } from "../utils/dates.js";
import {
  createTodayChart,
  updateTodayChart,
} from "../charts/todayChart.js";
import {
  createWeekChart,
  updateWeekChart,
} from "../charts/weekChart.js";
import {
  createCategoryChart,
  updateCategoryChart,
} from "../charts/categoryChart.js";

export function initDashboard() {
  const dateLine = document.getElementById("dateLine");
  const todayScoreText = document.getElementById("todayScoreText");
  const habitsHead = document.getElementById("habitsHead");
  const habitsBody = document.getElementById("habitsBody");
  const panel = habitsBody.closest(".panel");

  dateLine.textContent = formatLongDate();

  const tIdx = todayIndex();
  const todayChart = createTodayChart(document.getElementById("todayChart"));
  const weekChart = createWeekChart(
    document.getElementById("weekChart"),
    tIdx
  );
  const catChart = createCategoryChart(
    document.getElementById("categoryChart")
  );

  renderAddHabitButton(panel);
  renderSettingsButton(panel);

  function renderAll() {
    renderHabitsTable(habitsHead, habitsBody);

    const todayCount = computeTodayCount();
    const totalHabits = state.habits.length;
    todayScoreText.textContent = `${todayCount} / ${totalHabits}`;
    updateTodayChart(todayChart, todayCount, totalHabits);

    const week = computeWeekCounts();
    updateWeekChart(weekChart, week);

    const catTotals = computeCategoryTotals();
    updateCategoryChart(catChart, catTotals);
  }

  subscribe(renderAll);

  load().then(renderAll);
}