export default class ChartJsComponent extends HTMLElement {
  static configHrefAttrName = "config-href";
  static get observedAttributes() {
    return [ChartJsComponent.configHrefAttrName];
  }

  constructor() {
    // Always call super() first, this is required by the spec.
    super();
    this.configHref = this.getAttribute(ChartJsComponent.configHrefAttrName);
    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.innerHTML = `
          <canvas style="width:512px;"></canvas>
        `;
  }

  navigate(data, _options) {
    if ("navigation" in data && data.navigation) {
      window.location = data.navigation.url;
    }
    if ("url" in data && data.url) {
      window.location = data.url;
    }
  }

  connectedCallbackRender() {
    if (this.configHref) {
      $script("https://cdn.jsdelivr.net/npm/chart.js", () => {
        const configURL = this.configHref;
        fetch(configURL)
          .then((response) => {
            if (response.status == 200) {
              response.json().then((config) => {
                const canvas = this.shadow.querySelector("canvas");
                const chart = new Chart(canvas, config);
                this.onclick = (evt) => {
                  const points = chart.getElementsAtEventForMode(
                    evt,
                    "nearest",
                    {
                      intersect: true,
                    },
                    true,
                  );
                  if (points.length) {
                    const firstPoint = points[0];
                    const data =
                      chart.data.datasets[firstPoint.datasetIndex].data[
                        firstPoint.index
                      ];
                    this.navigate(data);
                  }
                };
              });
            } else {
              this.innerHTML = `Error loading ${configURL}: response.status = ${response.status} in ChartJsComponent`;
            }
          })
          .catch((error) => {
            this.innerHTML = `Error loading ${configURL}: ${error} in ChartJsComponent`;
          });
      });
    } else {
      this.innerHTML = `this.configHref (attribute "${ChartJsComponent.configHrefAttrName}") not supplied for ChartJsComponent`;
    }
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

customElements.define("chart-js", ChartJsComponent);
