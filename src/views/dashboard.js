import { subscribe, load, state, toggleCheck } from "../store/state.js";
import { renderHabitsList, renderCategoryLegend, editHabit } from "./habitsTable.js";
import {
  computeTodayCount,
  computeTodayTotal,
  computeTodayList,
  computeWeekCounts,
  computeWeekTotal,
  computeCategoryTotals,
  computeStreak,
} from "./stats.js";
import { renderSettings } from "./settings.js";
import { todayIndex, formatLongDate, DAYS_FR ,todayKey} from "../utils/dates.js";
import {
  createTodayChart,
  updateTodayChart,
  refreshTodayChartTheme,
} from "../charts/todayChart.js";
import {
  createWeekChart,
  updateWeekChart,
  refreshWeekChartTheme,
} from "../charts/weekChart.js";
import {
  createCategoryChart,
  updateCategoryChart,
  refreshCategoryChartTheme,
} from "../charts/categoryChart.js";

export function initDashboard() {
  // Refs
  const refs = {
    dateLine: document.getElementById("dateLine"),
    kpiToday: document.getElementById("kpiToday"),
    kpiTodayPct: document.getElementById("kpiTodayPct"),
    kpiStreak: document.getElementById("kpiStreak"),
    kpiWeek: document.getElementById("kpiWeek"),
    kpiWeekPct: document.getElementById("kpiWeekPct"),
    kpiHabits: document.getElementById("kpiHabits"),
    donutValue: document.getElementById("donutValue"),
    todayList: document.getElementById("todayList"),
    todayProgressFill: document.getElementById("todayProgressFill"),
    habitsList: document.getElementById("habitsList"),
    categoryLegend: document.getElementById("categoryLegend"),
    addHabitBtn: document.getElementById("addHabitBtn"),
    nav: document.getElementById("nav"),
    views: {
      dashboard: document.getElementById("view-dashboard"),
      habits: document.getElementById("view-habits"),
      stats: document.getElementById("view-stats"),
      settings: document.getElementById("view-settings"),
    },
    themeToggle: document.getElementById("themeToggle"),
    themeIcon: document.getElementById("themeIcon"),
    themeLabel: document.getElementById("themeLabel"),
    themeSegmented: document.getElementById("themeSegmented"),
    resetBtn: document.getElementById("resetBtn"),
  };

  refs.dateLine.textContent = formatLongDate();

  const tIdx = todayIndex();

  // Charts
  const todayChart = createTodayChart(document.getElementById("todayChart"));
  const weekChart = createWeekChart(
    document.getElementById("weekChart"),
    tIdx
  );
  const statsWeekChart = createWeekChart(
    document.getElementById("statsWeekChart"),
    tIdx
  );
  const catChart = createCategoryChart(
    document.getElementById("categoryChart")
  );

  // Navigation
  refs.nav.querySelectorAll(".nav-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      refs.nav.querySelectorAll(".nav-item").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const view = btn.dataset.view;
      Object.entries(refs.views).forEach(([k, el]) => {
        el.classList.toggle("is-active", k === view);
      });
    });
  });

  // Add habit
  refs.addHabitBtn.addEventListener("click", () => editHabit(null));

  // Settings
  renderSettings({
    segmented: refs.themeSegmented,
    resetBtn: refs.resetBtn,
    themeLabel: refs.themeLabel,
    themeIcon: refs.themeIcon,
    themeToggle: refs.themeToggle,
  });

  // Theme change → refresh charts
  document.addEventListener("dd-theme-change", () => {
    refreshTodayChartTheme(todayChart);
    refreshWeekChartTheme(weekChart, tIdx);
    refreshWeekChartTheme(statsWeekChart, tIdx);
    refreshCategoryChartTheme(catChart);
  });

  // Render
  function renderTodayList() {
    const list = computeTodayList();
    refs.todayList.innerHTML = "";
    list.forEach((item) => {
      const row = document.createElement("div");
      row.className = "today-item" + (item.done ? " is-done" : "");
      row.innerHTML = `<span class="today-check">✓</span><span>${item.name}</span>`;
row.addEventListener("click", () => toggleCheck(item.id, todayKey()));
      refs.todayList.appendChild(row);
    });
  }

  function renderAll() {
    const total = computeTodayTotal();
    const today = computeTodayCount();
    const pct = total ? Math.round((today / total) * 100) : 0;

    // KPIs
    refs.kpiToday.textContent = `${today} / ${total}`;
    refs.kpiTodayPct.textContent = `${pct}%`;
    refs.kpiHabits.textContent = total;

    const streak = computeStreak();
    refs.kpiStreak.textContent = `${streak} j`;

    const weekCounts = computeWeekCounts();
    const weekTotal = computeWeekTotal();
    const weekMax = total * 7;
    const weekPct = weekMax ? Math.round((weekTotal / weekMax) * 100) : 0;
    refs.kpiWeek.textContent = `${weekTotal} / ${weekMax}`;
    refs.kpiWeekPct.textContent = `${weekPct}%`;

    // Donut
    refs.donutValue.textContent = `${today} / ${total}`;
    updateTodayChart(todayChart, today, total);

    // Progress bar
    refs.todayProgressFill.style.width = `${pct}%`;

    // Today list
    renderTodayList();

    // Habits
    renderHabitsList(refs.habitsList);
    renderCategoryLegend(refs.categoryLegend);

    // Charts
    updateWeekChart(weekChart, weekCounts, tIdx);
    updateWeekChart(statsWeekChart, weekCounts, tIdx);
    updateCategoryChart(catChart, computeCategoryTotals());
  }

  subscribe(renderAll);
  load().then(renderAll);
}