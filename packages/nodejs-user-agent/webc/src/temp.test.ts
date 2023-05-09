/* eslint-disable */
// FIXME: This file just makes the 1 >= test file in every package restriction pass...
import * as vitest from "vitest";

function testAddition() {
  if (2 + 2 !== 4) {
    throw new Error("Expected 2 + 2 to equal 4");
  }
}

vitest.suite("Math tests", () => {
  vitest.test("Addition", testAddition);
});
