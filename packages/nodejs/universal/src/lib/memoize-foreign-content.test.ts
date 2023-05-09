import { describe, expect, it } from "vitest";
import * as mod from "./memoize-foreign-content";

describe("custom foreignReadableHtmlMemoizer", () => {
  const memoizableReadable = mod.foreignReadableHtmlMemoizer({
    isForeignContentAvailable: () => true,
    isInDevelopment: false,
  });
  it("retrieves and memoizes readable content", async () => {
    const memoizableReadableContent = memoizableReadable(
      "https://jojozhuang.github.io/tutorial/mermaid-cheat-sheet/",
    );
    const mrc = await memoizableReadableContent();
    expect(mrc?.content).toBeDefined();
    expect(mrc?.textContent).toBeDefined();
  });
});

describe("typical memoizableForeignReadable", () => {
  it("retrieves and memoizes unsanitized HTML as DOM", async () => {
    const memoizableForeignHTMLWithOptions = await mod.memoizableForeignHTML({
      // TODO: Maybe "isInDevelopment" should be passed as an argument
      isInDevelopment: false,
    });

    const mfh = memoizableForeignHTMLWithOptions(
      "https://jojozhuang.github.io/tutorial/mermaid-cheat-sheet/",
      {
        extractHTML: (dom) =>
          dom.window.document.querySelectorAll("div.post")[0]?.outerHTML ??
          "NOT FOUND",
      },
    );
    const html = await mfh();
    expect(html == "NOT FOUND").toBeFalsy();
  });

  it("retrieves and memoizes sanitized HTML as DOM", async () => {
    const memoizableForeignHTMLWithOptions = await mod.memoizableForeignHTML({
      isInDevelopment: false,
    });

    const mfh = memoizableForeignHTMLWithOptions(
      "https://jojozhuang.github.io/tutorial/mermaid-cheat-sheet/",
      {
        sanitized: true,
        extractHTML: (dom) =>
          dom.window.document.querySelectorAll("div.post")[0]?.outerHTML ??
          "NOT FOUND",
      },
    );
    const html = await mfh();
    expect(html == "NOT FOUND").toBeFalsy();
  });

  it("retrieves and memoizes readable content", async () => {
    const memoizableForeignReadableWithOptions =
      await mod.memoizableForeignReadable({
        // TODO: Maybe "isInDevelopment" should be passed as an argument
        isInDevelopment: false,
      });

    const mrc = await memoizableForeignReadableWithOptions(
      "https://jojozhuang.github.io/tutorial/mermaid-cheat-sheet/",
    )();
    expect(mrc?.content).toBeDefined();
    expect(mrc?.textContent).toBeDefined();
  });
});

describe("flexible memoizableForeignContent", () => {
  const options = { isInDevelopment: true };
  it("retrieves and memoizes unsanitized HTML as DOM", async () => {
    const html = await mod.memoizableForeignContent(
      {
        url: "https://jojozhuang.github.io/tutorial/mermaid-cheat-sheet/",
      },
      // TODO: Maybe "isInDevelopment" should be passed as an argument
      options,
    );
    expect(html.startsWith("memoizableForeignContent:")).toBeFalsy();
  });

  it("retrieves and memoizes sanitized HTML as DOM", async () => {
    const html = await mod.memoizableForeignContent(
      {
        url: "https://jojozhuang.github.io/tutorial/mermaid-cheat-sheet/",
        content: { selectFirst: "div.post" },
      },
      options,
    );
    expect(html.startsWith("memoizableForeignContent:")).toBeFalsy();
  });

  it("retrieves and memoizes readable content", async () => {
    const html = await mod.memoizableForeignContent(
      {
        url: "https://jojozhuang.github.io/tutorial/mermaid-cheat-sheet/",
        content: { readable: true },
      },
      options,
    );
    expect(html.startsWith("memoizableForeignContent:")).toBeFalsy();
  });
});
