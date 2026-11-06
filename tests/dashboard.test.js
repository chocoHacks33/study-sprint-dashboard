import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateStudyStreak,
  escapeHtml,
  formatDuration,
  minutesByDay,
  summarizeSessions
} from "../src/dashboard.js";

const sampleSessions = [
  { course: "Algorithms", date: "2026-11-01", minutes: 40 },
  { course: "Databases", date: "2026-11-01", minutes: 20 },
  { course: "Algorithms", date: "2026-11-02", minutes: 60 }
];

test("summarizeSessions reports totals, unique courses, and an average", () => {
  assert.deepEqual(summarizeSessions(sampleSessions), {
    totalMinutes: 120,
    courseCount: 2,
    averageMinutes: 40
  });
});

test("summarizeSessions handles an empty collection", () => {
  assert.deepEqual(summarizeSessions([]), {
    totalMinutes: 0,
    courseCount: 0,
    averageMinutes: 0
  });
});

test("minutesByDay combines sessions on the same day and sorts dates", () => {
  assert.deepEqual(minutesByDay(sampleSessions), [
    { date: "2026-11-01", minutes: 60 },
    { date: "2026-11-02", minutes: 60 }
  ]);
});

test("formatDuration produces compact hour and minute labels", () => {
  assert.equal(formatDuration(45), "45m");
  assert.equal(formatDuration(60), "1h");
  assert.equal(formatDuration(135), "2h 15m");
});

test("escapeHtml protects values inserted into the session table", () => {
  assert.equal(escapeHtml('<script title="x">&'), "&lt;script title=&quot;x&quot;&gt;&amp;");
});

test("calculateStudyStreak counts consecutive unique study dates", () => {
  const sessions = [
    { date: "2026-11-01" },
    { date: "2026-11-03" },
    { date: "2026-11-04" },
    { date: "2026-11-04" },
    { date: "2026-11-05" }
  ];

  assert.equal(calculateStudyStreak(sessions), 3);
  assert.equal(calculateStudyStreak([]), 0);
});

test("calculateStudyStreak ignores malformed date values", () => {
  assert.equal(calculateStudyStreak([{ date: "not-a-date" }]), 0);
});

