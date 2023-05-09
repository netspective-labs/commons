import { describe, expect, it } from "vitest";
import * as mod from "./foreign-content";

describe("real-time", () => {
  it("retrieves unsanitized HTML as DOM", async () => {
    const qc = await mod.queryableContent(
      "https://jojozhuang.github.io/tutorial/mermaid-cheat-sheet/",
    );
    expect(qc).toBeDefined();

    const divPost = qc.window.document.querySelector("div.post");
    expect(divPost).toBeTruthy();
  });

  it("retrieves sanitized HTML as DOM", async () => {
    const qsc = await mod.queryableSanitizedContent(
      "https://jojozhuang.github.io/tutorial/mermaid-cheat-sheet/",
    );
    expect(qsc).toBeDefined();

    const divPost = qsc.window.document.querySelectorAll("div.post");
    expect(divPost.length).toBe(1);
  });

  it("retrieves readable content", async () => {
    const rc = await mod.readableContent(
      "https://jojozhuang.github.io/tutorial/mermaid-cheat-sheet/",
    );
    expect(rc?.content).toBeDefined();
    expect(rc?.textContent).toBeDefined();
  });
});
