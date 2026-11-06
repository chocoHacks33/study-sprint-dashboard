import test from "node:test";
import assert from "node:assert/strict";

import { DEFAULT_WEEKLY_GOAL, normalizeWeeklyGoal, weeklyGoalStatus } from "../src/goal.js";

test("normalizeWeeklyGoal applies defaults and safe bounds", () => {
  assert.equal(normalizeWeeklyGoal("not a number"), DEFAULT_WEEKLY_GOAL);
  assert.equal(normalizeWeeklyGoal(30), 60);
  assert.equal(normalizeWeeklyGoal(9000), 2400);
  assert.equal(normalizeWeeklyGoal("510"), 510);
});

test("weeklyGoalStatus reports progress and remaining time", () => {
  assert.deepEqual(weeklyGoalStatus(315, 420), {
    goal: 420,
    percentage: 75,
    remainingMinutes: 105,
    complete: false
  });
});

test("weeklyGoalStatus caps completed goals at 100 percent", () => {
  assert.deepEqual(weeklyGoalStatus(500, 420), {
    goal: 420,
    percentage: 100,
    remainingMinutes: 0,
    complete: true
  });
});
