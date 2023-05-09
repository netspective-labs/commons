function getWordCount(rootElement) {
  let docContent = rootElement.textContent;

  // Parse out unwanted whitespace so the split is accurate
  // ref: https://github.com/microsoft/vscode-wordcount/blob/main/extension.ts
  docContent = docContent.replace(/(< ([^>]+)<)/g, "").replace(/\s+/g, " ");
  docContent = docContent.replace(/^\s\s*/, "").replace(/\s\s*$/, "");
  let wordCount = 0;
  if (docContent != "") {
    wordCount = docContent.split(" ").length;
  }
  return wordCount;
}

export default class WordCountElement extends HTMLSpanElement {
  static get observedAttributes() {
    return ["element-id"];
  }
  connectedCallback() {
    window.addEventListener("load", () => {
      this.innerHTML = getWordCount(document.getElementById("content"));
    });
  }
}

/**
 * Create a custom element which will take any element ID and show how many words are in there.
 * Usage in HTML:
 *     <span is="word-count" element-id="ELEMENT_ID"/>
 * `element-id` is a DOM element identifier like <div id="ELEMENT_ID">
 */
customElements.define("word-count", WordCountElement, { extends: "span" });
