import { DAYS_FR } from "../utils/dates.js";

export function createWeekChart(canvas, todayIdx) {
  return new Chart(canvas, {
    type: "bar",
    data: {
      labels: DAYS_FR,
      datasets: [
        {
          label: "Habitudes cochées",
          data: new Array(7).fill(0),
          backgroundColor: DAYS_FR.map((_, i) =>
            i === todayIdx ? "#C9A227" : "#1F5D50"
          ),
          borderRadius: 4,
          maxBarThickness: 34,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { precision: 0 } },
      },
    },
  });
}

export function updateWeekChart(chart, counts) {
  chart.data.datasets[0].data = counts;
  chart.update();
}