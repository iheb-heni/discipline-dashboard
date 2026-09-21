import { initDashboard } from "./views/dashboard.js";
import { getTheme, applyTheme } from "./store/theme.js";

async function bootstrap() {
  // Apply theme BEFORE first paint
  try {
    const pref = await getTheme();
    applyTheme(pref);
  } catch (e) {
    applyTheme("light");
  }

  // React to system changes if pref === system
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      const pref = document.documentElement.getAttribute("data-theme-pref");
      if (pref === "system") {
        applyTheme("system");
        document.dispatchEvent(new CustomEvent("dd-theme-change"));
      }
    });

  if (typeof Chart === "undefined") {
    console.error("Chart.js failed to load from vendor/chart.umd.min.js");
  }

  initDashboard();
}

document.addEventListener("DOMContentLoaded", bootstrap);