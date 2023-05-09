export default class DiagramsNetViewerComponent extends HTMLElement {
  static diagnoseAttrName = "diagnose";
  static drawIoSrcUrlAttrName = "drawio-url";
  static diagramTitleAttrName = "diagram-title";
  static widthAttrName = "width";
  static heightAttrName = "height";
  static get observedAttributes() {
    return [
      DiagramsNetViewerComponent.diagnoseAttrName,
      DiagramsNetViewerComponent.drawIoSrcUrlAttrName,
      DiagramsNetViewerComponent.diagramTitleAttrName,
      DiagramsNetViewerComponent.widthAttrName,
      DiagramsNetViewerComponent.heightAttrName,
    ];
  }

  constructor() {
    // Always call super() first, this is required by the spec.
    super();
    this.diagramsViewerBaseURL =
      "https://viewer.diagrams.net/?highlight=0000ff&edit=_blank&layers=1&nav=1";
    this.drawIoSrcUrl =
      this.getAttribute(DiagramsNetViewerComponent.drawIoSrcUrlAttrName) || "";
    this.diagramTitle =
      this.getAttribute(DiagramsNetViewerComponent.diagramTitleAttrName) || "";
    this.diagnose =
      this.getAttribute(DiagramsNetViewerComponent.diagnoseAttrName) || false;
    this.width =
      this.getAttribute(DiagramsNetViewerComponent.widthAttrName) || "100%";
    this.height =
      this.getAttribute(DiagramsNetViewerComponent.heightAttrName) || "400px";
    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.innerHTML = `
          <iframe frameborder="0" style="width:${this.width};height:${this.height};"></iframe>
        `;
  }

  connectedCallback() {
    if (this.diagnose) {
      console.log(`preparing diagrams.net viewer ${this.drawIoSrcUrl}`);
    }

    fetch(this.drawIoSrcUrl).then(async (response) => {
      const diagram = await response.text();
      const iFrame = this.shadow.querySelector("iframe");
      if (this.diagnose) {
        console.dir(response);
        console.dir(diagram);
        console.dir(iFrame);
      }
      iFrame.src = `${this.diagramsViewerBaseURL}&title=${encodeURIComponent(
        this.diagramTitle,
      )}\#R${encodeURIComponent(diagram)}`;

      if (this.diagnose) {
        console.log(`completed preparing ${this.drawIoSrcUrl}`);
      }
    });
  }
}

customElements.define("diagrams-net-viewer", DiagramsNetViewerComponent);
