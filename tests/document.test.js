import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

test("document exposes the dashboard regions used by the renderer", () => {
  for (const id of ["metric-grid", "study-chart", "session-rows", "session-count", "week-label"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
});

test("recent sessions table uses scoped column headings", () => {
  assert.equal((html.match(/<th scope="col">/g) ?? []).length, 4);
});

test("document includes an explicit print report action", () => {
  assert.match(html, /<button[^>]+id="print-dashboard"[^>]+type="button"/);
});

