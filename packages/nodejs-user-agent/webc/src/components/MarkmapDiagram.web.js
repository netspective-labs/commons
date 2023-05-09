import { Transformer } from "markmap-lib";
import { Markmap } from "markmap-view";

export default class MarkmapComponent extends HTMLElement {
  static diagnoseAttrName = "diagnose";
  static get observedAttributes() {
    return [MarkmapComponent.diagnoseAttrName];
  }

  constructor() {
    // Always call super() first, this is required by the spec.
    super();
    this.diagnose =
      this.getAttribute(MarkmapComponent.diagnoseAttrName) || false;
    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.innerHTML = `
          <svg style="width: 100%; height: 400px;"></svg>
        `;
  }

  connectedCallback() {
    const decodeHTML = (html) => {
      var txt = document.createElement("textarea");
      txt.innerHTML = html;
      return txt.value;
    };

    // in case the Markmap content in innerHTML has HTML entities like <, >, etc. decode to text
    const markdownSrc = decodeHTML(this.innerHTML);
    if (this.diagnose) {
      console.log("Markdown acquired from this.innerHTML");
      console.dir(markdownSrc);
    }

    const transformer = new Transformer();
    const { root, features } = transformer.transform(markdownSrc);
    if (root) {
      const svg = this.shadow.querySelector("svg");
      if (this.diagnose) {
        console.dir({ transformer, Markmap, root, features, svg });
      }
      Markmap.create(svg, null, root);
      this.style.display = ""; // in case the block was hidden on load to remove flicker
    } else {
      if (this.diagnose) {
        console.log("Markmap transformer failed, root is undefined");
        console.dir({ transformer, Markmap, diagram, features });
      }
    }
  }
}

customElements.define("markmap-diagram", MarkmapComponent);
