import { sessions } from "./data.js";
import { renderDashboard } from "./dashboard.js";

const sortSelect = document.querySelector("#session-sort");

function updateDashboard() {
  renderDashboard(sessions, document, sortSelect.value);
}

sortSelect.addEventListener("change", updateDashboard);
updateDashboard();

