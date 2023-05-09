export default class ReadabilityComponent extends HTMLElement {
  static originUrlAttrName = "origin-url";
  static get observedAttributes() {
    return [ReadabilityComponent.originUrlAttrName];
  }

  constructor() {
    // Always call super() first, this is required by the spec.
    super();
  }

  connectedCallbackRender() {
    $script(
      "https://raw.githack.com/mozilla/readability/0.4.1/Readability.js",
      () => {
        const originURL = this.getAttribute(
          ReadabilityComponent.originUrlAttrName,
        );
        if (originURL) {
          fetch(originURL, { redirect: "follow" })
            .then((response) => {
              console.dir(response);
              if (response.status == 200) {
                response.text().then((html) => {
                  const parser = new DOMParser();
                  const doc = parser.parseFromString(html, "text/html");
                  const result = new Readability(doc).parse(); // Readability script will mutate the DOM set above
                  this.innerHTML = result.content;
                });
              } else {
                this.innerHTML = `Error fetching <a href="${originURL}">${originURL}</a>: response.status = ${response.status} in ReadabilityComponent`;
              }
            })
            .catch((error) => {
              this.innerHTML = `Error fetching ${originURL}: ${error} in ReadabilityComponent`;
            });
        } else {
          this.innerHTML = `originURL (attribute "${ReadabilityComponent.originUrlAttrName}") not supplied for ReadabilityComponent`;
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

customElements.define("mozilla-readable", ReadabilityComponent);
