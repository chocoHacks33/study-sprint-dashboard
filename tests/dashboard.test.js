import test from "node:test";
import assert from "node:assert/strict";

import { escapeHtml, formatDuration, minutesByDay, renderSessionRows, summarizeSessions } from "../src/dashboard.js";

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

test("renderSessionRows supplies mobile labels and escapes session text", () => {
  const rows = renderSessionRows([
    {
      course: "Security & Privacy",
      topic: "<Threat modeling>",
      date: "2026-11-07",
      minutes: 75
    }
  ]);

  for (const label of ["Course", "Topic", "Date", "Duration"]) {
    assert.match(rows, new RegExp(`data-label=["']${label}["']`));
  }
  assert.match(rows, /Security &amp; Privacy/);
  assert.match(rows, /&lt;Threat modeling&gt;/);
  assert.match(rows, /1h 15m/);
});

