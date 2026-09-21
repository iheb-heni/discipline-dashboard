export function createTodayChart(canvas) {
  return new Chart(canvas, {
    type: "doughnut",
    data: {
      labels: ["Fait", "Restant"],
      datasets: [
        {
          data: [0, 1],
          backgroundColor: ["#1F5D50", "#E1E5E0"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      cutout: "70%",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { boxWidth: 12, font: { family: "Work Sans" } },
        },
      },
    },
  });
}

export function updateTodayChart(chart, done, total) {
  chart.data.datasets[0].data = [done, Math.max(total - done, 0)];
  chart.update();
}