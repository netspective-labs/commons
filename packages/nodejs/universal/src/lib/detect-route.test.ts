import { describe, expect, it } from "vitest";
import * as mod from "./detect-route.js";

describe("detectFileSysStyleRoute", async () => {
  it("without modifiers", () => {
    const complexPath =
      "/some/long-ugly/file_sys_path/module-2_Component--_  1,=service_2.md";
    const result = mod.detectFileSysStyleRoute(complexPath);
    expect(result).toBeDefined();
    expect(result?.dir).toBe("/some/long-ugly/file_sys_path");
    expect(result?.base).toBe("module-2_Component--_  1,=service_2.md");
    expect(result?.name).toBe("module-2_Component--_  1,=service_2");
    expect(result?.modifiers.length).toBe(0);
    expect(result?.ext).toBe(".md");
  });

  it("with modifiers", () => {
    const complexPath =
      "/some/long-ugly/file_sys_path/module-2_Component--_  1,=service_2.mod1.mod2.md";
    const result = mod.detectFileSysStyleRoute(complexPath);
    expect(result);
    expect(result?.root).toBe("/");
    expect(result?.dir).toBe("/some/long-ugly/file_sys_path");
    expect(result?.base).toBe(
      "module-2_Component--_  1,=service_2.mod1.mod2.md",
    );
    expect(result?.name).toBe("module-2_Component--_  1,=service_2");
    expect(result?.modifiers.length).toBe(2);
    expect(result?.ext).toBe(".md");
  });
});
