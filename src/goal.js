export const DEFAULT_WEEKLY_GOAL = 420;

export function normalizeWeeklyGoal(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return DEFAULT_WEEKLY_GOAL;
  return Math.min(2400, Math.max(60, Math.round(parsed)));
}

export function weeklyGoalStatus(studiedMinutes, goalMinutes) {
  const goal = normalizeWeeklyGoal(goalMinutes);
  const studied = Math.max(0, Number(studiedMinutes) || 0);
  const remainingMinutes = Math.max(0, goal - studied);
  const percentage = Math.min(100, Math.round((studied / goal) * 100));

  return {
    goal,
    percentage,
    remainingMinutes,
    complete: studied >= goal
  };
}

