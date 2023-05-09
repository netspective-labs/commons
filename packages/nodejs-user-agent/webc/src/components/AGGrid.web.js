export default class AgGridComponent extends HTMLElement {
  static configHrefAttrName = "config-href";
  static domLayoutAttrName = "dom-layout";
  static displayAfterGridReady = "display-after-grid-ready";
  static get observedAttributes() {
    return [
      AgGridComponent.configHrefAttrName,
      AgGridComponent.domLayoutAttrName,
      AgGridComponent.displayAfterGridReady,
    ];
  }

  constructor() {
    // Always call super() first, this is required by the spec.
    super();
  }

  connectedCallbackRender() {
    function delay(time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    }

    $script(
      "https://unpkg.com/ag-grid-community/dist/ag-grid-community.min.js",
      () => {
        const domLayout =
          this.getAttribute(AgGridComponent.domLayoutAttrName) || "autoHeight";
        const configure = (inherit) => {
          const config = {
            domLayout,
            rowSelection: "single",
            ...inherit.gridDefn, // either from innerHTML or API, everything overrides the defaults
            onGridReady: (event) => {
              const displayAfterGridReadyMS =
                this.getAttribute(AgGridComponent.displayAfterGridReady) ?? 0;
              if (displayAfterGridReadyMS) {
                // in case it was hidden (because content is inline, in body of component), show it now
                this.style.display = "";
                delay(displayAfterGridReadyMS).then(() =>
                  event.columnApi.autoSizeAllColumns(),
                );
              } else {
                event.columnApi.autoSizeAllColumns();
              }
            },
            components: {
              // see https://www.ag-grid.com/javascript-grid/components/
              // if any cell has this as a renderer, it becomes a "navigation cell"
              navigationCellRenderer: (params) => {
                if ("navigation" in params.data) {
                  return `<a href="${params.data.navigation.url}">${params.value}</a>`;
                }
                return params.value;
              },
              hideZerosRenderer: (params) => {
                return typeof params.value === "number"
                  ? params.value == 0
                    ? ""
                    : params.value
                  : params.value;
              },
              ...inherit.components,
            },
          };
          new agGrid.Grid(this, config);
        };

        const configURL = this.getAttribute(AgGridComponent.configHrefAttrName);
        if (configURL) {
          fetch(configURL)
            .then((response) => {
              if (response.status == 200) {
                response.json().then((gridDefn) => {
                  configure({ gridDefn });
                });
              } else {
                this.innerHTML = `Error loading <a href="${configURL}">${configURL}</a>: response.status = ${response.status} in AgGridComponent`;
              }
            })
            .catch((error) => {
              this.innerHTML = `Error loading ${configURL}: ${error} in AgGridComponent`;
            });
        } else {
          try {
            const data = JSON.parse(this.innerText);
            this.innerText = ""; // if we get to here, the data is valid JSON so AgGrid will initialize
            configure(data);
          } catch (err) {
            this.innerHTML = `configURL (attribute "${AgGridComponent.configHrefAttrName}") not supplied for AgGridComponent, tried to use this.innerText as JSON but failed: ${err}`;
          }
        }
      },
    );
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

customElements.define("ag-grid", AgGridComponent);
