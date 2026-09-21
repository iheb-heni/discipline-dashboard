function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function createTodayChart(canvas) {
  return new Chart(canvas, {
    type: "doughnut",
    data: {
      labels: ["Fait", "Restant"],
      datasets: [
        {
          data: [0, 1],
          backgroundColor: [cssVar("--primary"), cssVar("--surface-2")],
          borderWidth: 0,
          hoverOffset: 0,
        },
      ],
    },
    options: {
      cutout: "76%",
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 400 },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
    },
  });
}

export function updateTodayChart(chart, done, total) {
  chart.data.datasets[0].data = [done, Math.max(total - done, 0)];
  chart.data.datasets[0].backgroundColor = [
    cssVar("--primary"),
    cssVar("--surface-2"),
  ];
  chart.update("none");
}

export function refreshTodayChartTheme(chart) {
  chart.data.datasets[0].backgroundColor = [
    cssVar("--primary"),
    cssVar("--surface-2"),
  ];
  chart.update("none");
}