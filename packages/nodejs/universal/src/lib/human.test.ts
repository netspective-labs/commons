import { describe, expect, it } from "vitest";
import * as mod from "./human";

describe("humanFriendlyPhrase", () => {
  it("converts hyphenated file names to human-friendly format", () => {
    const inhumanText = "module-2_Component--_  1,=service_2";
    const result = mod.humanFriendlyPhrase(inhumanText);
    expect(result).toBe("Module 2 Component 1 Service 2");
  });
});
