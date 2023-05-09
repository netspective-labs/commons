export default class ApacheEChartsComponent extends HTMLElement {
  static configHrefAttrName = "config-href";
  static get observedAttributes() {
    return [ApacheEChartsComponent.configHrefAttrName];
  }

  constructor() {
    // Always call super() first, this is required by the spec.
    super();
    this.configHref = this.getAttribute(
      ApacheEChartsComponent.configHrefAttrName,
    );
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
    const configURL = this.configHref;
    if (configURL) {
      $script(
        "https://cdn.jsdelivr.net/npm/echarts@5.1.2/dist/echarts.min.js",
        () => {
          const configure = (chartDefn) => {
            const chart = echarts.init(this);
            chart.setOption(chartDefn);
            chart.on("click", (params) => {
              this.navigate(params.data);
            });
            // deno-lint-ignore no-window-prefix
            window.addEventListener("resize", () => {
              chart.resize();
            });
          };

          fetch(configURL)
            .then((response) => {
              if (response.status == 200) {
                response.json().then((config) => {
                  configure(config);
                });
              } else {
                this.innerHTML = `Error loading ${configURL}: response.status = ${response.status} in ApacheEChartsComponent`;
              }
            })
            .catch((error) => {
              this.innerHTML = `Error loading ${configURL}: ${error} in ApacheEChartsComponent`;
            });
        },
      );
    } else {
      this.innerHTML = `this.configHref (attribute "${ApacheEChartsComponent.configHrefAttrName}") not supplied for ApacheEChartsComponent`;
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

customElements.define("apache-echarts", ApacheEChartsComponent);
