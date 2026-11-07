import test from "node:test";
import assert from "node:assert/strict";

import { registerPrintAction } from "../src/print.js";

test("registerPrintAction prints on click and can remove its listener", () => {
  let handler;
  let printCount = 0;
  const button = {
    addEventListener(event, listener) {
      assert.equal(event, "click");
      handler = listener;
    },
    removeEventListener(event, listener) {
      assert.equal(event, "click");
      assert.equal(listener, handler);
      handler = undefined;
    }
  };

  const unregister = registerPrintAction(button, () => {
    printCount += 1;
  });
  handler();
  assert.equal(printCount, 1);
  unregister();
  assert.equal(handler, undefined);
});

test("registerPrintAction safely ignores missing controls", () => {
  assert.doesNotThrow(() => registerPrintAction(null, () => {})());
});
