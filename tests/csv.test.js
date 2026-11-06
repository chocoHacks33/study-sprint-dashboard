import test from "node:test";
import assert from "node:assert/strict";

import { csvCell, sessionsToCsv } from "../src/csv.js";

test("csvCell quotes commas and doubles embedded quotes", () => {
  assert.equal(csvCell('Graphs, "advanced"'), '"Graphs, ""advanced"""');
});

test("csvCell neutralizes spreadsheet formulas", () => {
  assert.equal(csvCell("=2+2"), '"\'=2+2"');
  assert.equal(csvCell("@SUM(A1:A2)"), '"\'@SUM(A1:A2)"');
});

test("sessionsToCsv exports a stable header and each session", () => {
  const csv = sessionsToCsv([
    { course: "Algorithms", topic: "Graph search", date: "2026-11-05", minutes: 40 },
    { course: "Databases", topic: "Joins", date: "2026-11-06", minutes: 55 }
  ]);

  assert.equal(
    csv,
    '"Course","Topic","Date","Minutes"\r\n' +
      '"Algorithms","Graph search","2026-11-05","40"\r\n' +
      '"Databases","Joins","2026-11-06","55"'
  );
});
