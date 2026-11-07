import test from "node:test";
import assert from "node:assert/strict";

import { durationBreakdown, escapeHtml, formatDuration, minutesByDay, summarizeSessions } from "../src/dashboard.js";

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

test("durationBreakdown groups quick, focused, and deep study sessions", () => {
  assert.deepEqual(
    durationBreakdown([
      { minutes: 20 },
      { minutes: 44 },
      { minutes: 45 },
      { minutes: 69 },
      { minutes: 70 }
    ]),
    { quick: 2, focused: 2, deep: 1, total: 5 }
  );
  assert.deepEqual(durationBreakdown([]), { quick: 0, focused: 0, deep: 0, total: 0 });
});

