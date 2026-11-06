import { sessions } from "./data.js";
import { escapeHtml, filterSessions, renderDashboard } from "./dashboard.js";

renderDashboard(sessions);

const courseFilter = document.querySelector("#course-filter");
const courses = [...new Set(sessions.map((session) => session.course))].sort();

courseFilter.insertAdjacentHTML(
  "beforeend",
  courses.map((course) => `<option value="${escapeHtml(course)}">${escapeHtml(course)}</option>`).join("")
);

courseFilter.addEventListener("change", () => {
  renderDashboard(filterSessions(sessions, courseFilter.value));
});

