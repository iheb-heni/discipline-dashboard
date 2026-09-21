import { initDashboard } from "./views/dashboard.js";

document.addEventListener("DOMContentLoaded", () => {
  if (typeof Chart === "undefined") {
    console.error("Chart.js failed to load from vendor/chart.umd.min.js");
  }
  initDashboard();
});