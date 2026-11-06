import { sessions } from "./data.js";
import { formatDuration, renderDashboard, summarizeSessions } from "./dashboard.js";
import { DEFAULT_WEEKLY_GOAL, normalizeWeeklyGoal, weeklyGoalStatus } from "./goal.js";

renderDashboard(sessions);

const storageKey = "study-sprint-weekly-goal";
const goalInput = document.querySelector("#weekly-goal");
const goalProgress = document.querySelector("#goal-progress");
const goalStatus = document.querySelector("#goal-status");
const studiedMinutes = summarizeSessions(sessions).totalMinutes;

function renderGoal(goalMinutes) {
  const status = weeklyGoalStatus(studiedMinutes, goalMinutes);
  goalInput.value = String(status.goal);
  goalProgress.value = status.percentage;
  goalProgress.textContent = `${status.percentage}%`;
  goalProgress.setAttribute("aria-label", `${status.percentage}% of weekly study goal completed`);
  goalStatus.textContent = status.complete
    ? `Goal reached with ${formatDuration(studiedMinutes)} studied.`
    : `${formatDuration(status.remainingMinutes)} remaining · ${status.percentage}% complete`;
}

const savedGoal = normalizeWeeklyGoal(localStorage.getItem(storageKey) ?? DEFAULT_WEEKLY_GOAL);
renderGoal(savedGoal);

goalInput.addEventListener("change", () => {
  const goal = normalizeWeeklyGoal(goalInput.value);
  localStorage.setItem(storageKey, String(goal));
  renderGoal(goal);
});

