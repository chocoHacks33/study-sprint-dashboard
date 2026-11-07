import { sessions } from "./data.js";
import { filterSessions, renderDashboard } from "./dashboard.js";

const searchInput = document.querySelector("#session-search");
const searchStatus = document.querySelector("#session-search-status");

function updateDashboard() {
  const matchingSessions = filterSessions(sessions, searchInput.value);
  renderDashboard(matchingSessions);

  const hasQuery = searchInput.value.trim() !== "";
  searchStatus.textContent = hasQuery
    ? `${matchingSessions.length} of ${sessions.length} sessions match your search.`
    : "";

  if (matchingSessions.length === 0) {
    document.querySelector("#week-label").textContent = "No matching sessions";
  }
}

searchInput.addEventListener("input", updateDashboard);
updateDashboard();

