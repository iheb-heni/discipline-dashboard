import { DAYS_FR } from "../utils/dates.js";

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function createWeekChart(canvas, todayIdx) {
  const chart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: DAYS_FR,
      datasets: [
        {
          label: "Complétées",
          data: new Array(7).fill(0),
          backgroundColor: DAYS_FR.map((_, i) =>
            i === todayIdx ? cssVar("--primary") : cssVar("--surface-2")
          ),
          hoverBackgroundColor: cssVar("--primary"),
          borderRadius: 6,
          borderSkipped: false,
          maxBarThickness: 36,
        },
      ],
    },
    options: {
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
          grid: { display: false },
          border: { display: false },
          ticks: {
            color: cssVar("--text-soft"),
            font: { size: 11, family: "Inter" },
          },
        },
        y: {
          beginAtZero: true,
          grid: { color: cssVar("--border-soft") },
          border: { display: false },
          ticks: {
            color: cssVar("--text-mute"),
            font: { size: 11, family: "Inter" },
            precision: 0,
          },
        },
      },
    },
  });
  return chart;
}

export function updateWeekChart(chart, counts, todayIdx) {
  chart.data.datasets[0].data = counts;
  chart.data.datasets[0].backgroundColor = counts.map((_, i) =>
    i === todayIdx ? cssVar("--primary") : cssVar("--surface-2")
  );
  chart.update("none");
}

export function refreshWeekChartTheme(chart, todayIdx) {
  chart.data.datasets[0].backgroundColor = chart.data.datasets[0].data.map(
    (_, i) => (i === todayIdx ? cssVar("--primary") : cssVar("--surface-2"))
  );
  chart.data.datasets[0].hoverBackgroundColor = cssVar("--primary");
  chart.options.scales.x.ticks.color = cssVar("--text-soft");
  chart.options.scales.y.grid.color = cssVar("--border-soft");
  chart.options.scales.y.ticks.color = cssVar("--text-mute");
  chart.update("none");
}