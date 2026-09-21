import { CATEGORIES, CATEGORY_KEYS } from "../models/habit.js";

export function createCategoryChart(canvas) {
  return new Chart(canvas, {
    type: "bar",
    data: {
      labels: CATEGORY_KEYS.map((k) => CATEGORIES[k].label),
      datasets: [
        {
          label: "Semaine",
          data: CATEGORY_KEYS.map(() => 0),
          backgroundColor: CATEGORY_KEYS.map((k) => CATEGORIES[k].color),
          borderRadius: 4,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { beginAtZero: true, ticks: { precision: 0 } },
      },
    },
  });
}

export function updateCategoryChart(chart, totals) {
  chart.data.datasets[0].data = totals;
  chart.update();
}