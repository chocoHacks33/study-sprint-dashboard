import test from "node:test";
import assert from "node:assert/strict";

import { escapeHtml, formatDuration, minutesByDay, sortSessions, summarizeSessions } from "../src/dashboard.js";

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

test("sortSessions supports date, duration, and course ordering without mutating input", () => {
  const sessions = [
    { id: 1, course: "Databases", date: "2026-11-01", minutes: 45 },
    { id: 2, course: "Algorithms", date: "2026-11-03", minutes: 70 },
    { id: 3, course: "Networks", date: "2026-11-02", minutes: 50 }
  ];

  assert.deepEqual(sortSessions(sessions, "date-asc").map(({ id }) => id), [1, 3, 2]);
  assert.deepEqual(sortSessions(sessions, "duration-desc").map(({ id }) => id), [2, 3, 1]);
  assert.deepEqual(sortSessions(sessions, "course-asc").map(({ id }) => id), [2, 1, 3]);
  assert.deepEqual(sessions.map(({ id }) => id), [1, 2, 3]);
});

test("sortSessions falls back to newest first for an unknown option", () => {
  assert.deepEqual(sortSessions(sampleSessions, "unknown").map(({ date }) => date), [
    "2026-11-02",
    "2026-11-01",
    "2026-11-01"
  ]);
});

