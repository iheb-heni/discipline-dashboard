import { CATEGORIES, CATEGORY_KEYS } from "../models/habit.js";

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function createCategoryChart(canvas) {
  return new Chart(canvas, {
    type: "bar",
    data: {
      labels: CATEGORY_KEYS.map((k) => CATEGORIES[k].label),
      datasets: [
        {
          label: "Complétées",
          data: CATEGORY_KEYS.map(() => 0),
          backgroundColor: CATEGORY_KEYS.map((k) => CATEGORIES[k].color),
          borderRadius: 6,
          borderSkipped: false,
          maxBarThickness: 24,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 400 },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: cssVar("--text"),
          titleColor: cssVar("--surface"),
          bodyColor: cssVar("--surface"),
          padding: 10,
          cornerRadius: 8,
          displayColors: false,
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: cssVar("--border-soft") },
          border: { display: false },
          ticks: {
            color: cssVar("--text-mute"),
            font: { size: 11, family: "Inter" },
            precision: 0,
          },
        },
        y: {
          grid: { display: false },
          border: { display: false },
          ticks: {
            color: cssVar("--text-soft"),
            font: { size: 11.5, family: "Inter" },
          },
        },
      },
    },
  });
}

export function updateCategoryChart(chart, totals) {
  chart.data.datasets[0].data = totals;
  chart.update("none");
}

export function refreshCategoryChartTheme(chart) {
  chart.options.scales.x.grid.color = cssVar("--border-soft");
  chart.options.scales.x.ticks.color = cssVar("--text-mute");
  chart.options.scales.y.ticks.color = cssVar("--text-soft");
  chart.update("none");
}