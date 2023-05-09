export default class KrokiComponent extends HTMLElement {
  static hostAttrName = "host";
  static diagramAttrName = "type";
  static outputAttrName = "output";
  static diagnoseAttrName = "diagnose";
  static get observedAttributes() {
    return [
      KrokiComponent.hostAttrName,
      KrokiComponent.diagramAttrName,
      KrokiComponent.outputAttrName,
      KrokiComponent.diagnoseAttrName,
    ];
  }

  constructor() {
    // Always call super() first, this is required by the spec.
    super();
    this.style.display = "none"; // hide while rendering
    this.host =
      this.getAttribute(KrokiComponent.hostAttrName) || "http://kroki.io";
    this.diagramType =
      this.getAttribute(KrokiComponent.diagramAttrName) || "plantuml";
    this.output = this.getAttribute(KrokiComponent.outputAttrName) || "svg";
    this.diagnose = this.getAttribute(KrokiComponent.diagnoseAttrName) || false;
  }

  connectedCallbackRender() {
    const decodeHTML = (html) => {
      var txt = document.createElement("textarea");
      txt.innerHTML = html;
      return txt.value;
    };

    $script("https://unpkg.com/pako@1.0.10/dist/pako_deflate.min.js", () => {
      const encodedKrokiUrlPath = (srcText, srcTextType) => {
        if (
          !srcText ||
          !(typeof srcText === "string") ||
          srcText.trim().length == 0 ||
          !srcTextType ||
          srcTextType.trim().length == 0
        ) {
          srcText = "digraph G { Missing -> srcText }";
          srcTextType = "dot";
        }
        let base64Encoded;
        // deno-lint-ignore no-window-prefix
        if (window.TextEncoder) {
          base64Encoded = new TextEncoder("utf-8").encode(srcText);
        } else {
          const utf8 = unescape(encodeURIComponent(srcText));
          const base64Encoded = new Uint8Array(utf8.length);
          for (let i = 0; i < utf8.length; i++) {
            base64Encoded[i] = utf8.charCodeAt(i);
          }
        }
        const compressed = pako.deflate(base64Encoded, {
          level: 9,
          to: "string",
        });
        return btoa(compressed).replace(/\+/g, "-").replace(/\//g, "_");
      };

      // in case the innerHTML has HTML entities like <, >, etc. decode to text
      const diagram = decodeHTML(this.textContent);
      if (diagram) {
        const diagramType = this.diagramType;
        const host = this.host;
        const output = this.output;
        const krokiURL = [
          host,
          diagramType,
          output,
          encodedKrokiUrlPath(diagram, diagramType),
        ].join("/");
        if (this.diagnose) {
          console.dir({ host, diagramType, output, diagram, krokiURL });
        }
        this.innerHTML = `<div><a href='${krokiURL}'><img src='${krokiURL}'/></a></div>`;
        this.style.display = ""; // in case the block was hidden on load to remove flicker
      }
    });
  }

  connectedCallback() {
    if ("$script" in window) {
      this.connectedCallbackRender();
    } else {
      const scriptElem = document.createElement("script");
      scriptElem.onload = () => this.connectedCallbackRender();
      scriptElem.type = "text/javascript";
      scriptElem.src =
        "https://cdnjs.cloudflare.com/ajax/libs/script.js/2.5.9/script.min.js";
      document.head.appendChild(scriptElem);
    }
  }
}

customElements.define("kroki-diagram", KrokiComponent);
