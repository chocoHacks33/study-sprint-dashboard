import { sessions } from "./data.js";
import { downloadSessionsCsv } from "./csv.js";
import { renderDashboard } from "./dashboard.js";

renderDashboard(sessions);

document.querySelector("#export-sessions").addEventListener("click", () => {
  downloadSessionsCsv(sessions);
});

