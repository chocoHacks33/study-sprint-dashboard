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

test("session search exposes a labeled input and live result status", () => {
  assert.match(html, /for="session-search"/);
  assert.match(html, /id="session-search" type="search"/);
  assert.match(html, /id="session-search-status" aria-live="polite"/);
});

