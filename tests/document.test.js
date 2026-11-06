import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

test("document exposes the dashboard regions used by the renderer", () => {
  for (const id of ["metric-grid", "study-chart", "workload-chart", "session-rows", "session-count", "week-label"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
});

test("workload chart has a descriptive heading", () => {
  assert.match(html, /<section class="panel" aria-labelledby="workload-title">/);
  assert.match(html, /<h2 id="workload-title">Workload balance<\/h2>/);
});

test("recent sessions table uses scoped column headings", () => {
  assert.equal((html.match(/<th scope="col">/g) ?? []).length, 4);
});

