const editSVG = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.42852 8.1826L3.83008 6.04181C3.84249 5.9758 3.87452 5.91507 3.92201 5.86756L9.55515 0.234417C9.97431 -0.184732 10.7881 -0.0275712 11.408 0.592253C12.0277 1.21199 12.1848 2.02581 11.7657 2.44496L6.13255 8.0781C6.08504 8.12559 6.02431 8.15763 5.9583 8.17004L3.81761 8.5717C3.76434 8.58168 3.70943 8.57853 3.65765 8.56251C3.60587 8.54649 3.55878 8.51809 3.52045 8.47976C3.48212 8.44143 3.45372 8.39434 3.4377 8.34256C3.42168 8.29078 3.41853 8.23588 3.42852 8.1826ZM10.0266 0.705828L4.46633 6.26605L4.17359 7.82661L5.73407 7.53378L11.2943 1.97355C11.4042 1.86366 11.3175 1.44465 10.9365 1.06366C10.5555 0.682577 10.1364 0.59594 10.0266 0.705828ZM10.2326 12H0.333333C0.289558 12 0.246212 11.9914 0.205768 11.9746C0.165325 11.9579 0.128577 11.9333 0.0976236 11.9024C0.0666701 11.8714 0.0421171 11.8347 0.0253667 11.7942C0.00861633 11.7538 -3.32535e-06 11.7104 9.62344e-10 11.6667V1.76752C-3.32535e-06 1.72374 0.00861633 1.68039 0.0253667 1.63995C0.0421171 1.59951 0.0666701 1.56276 0.0976236 1.53181C0.128577 1.50085 0.165325 1.4763 0.205768 1.45955C0.246212 1.4428 0.289558 1.43418 0.333333 1.43418H5.7154L5.04872 2.10085H0.666667V11.3333H9.89922V6.95119L10.5659 6.28453V11.6667C10.5659 11.7104 10.5573 11.7538 10.5405 11.7942C10.5238 11.8347 10.4992 11.8714 10.4683 11.9024C10.4373 11.9333 10.4006 11.9579 10.3601 11.9746C10.3197 11.9914 10.2763 12 10.2326 12Z" fill="#9DB8BF"/></svg>`

const quoteStyle = `
/* Light mode - Catppuccin Latte */
.quoteback-container {
  --background-color: #eff1f5;  /* Latte Base */
  --border-color-normal: #e6e9ef;  /* Latte Surface0 */
  --border-color-hover: #1e66f5;  /* Latte Blue */
  --author-color: #4c4f69;  /* Latte Text */
  --title-color: #1e66f5;  /* Latte Blue */
  --gototext-color: #179299;  /* Latte Teal */
  --content-color: #4c4f69;  /* Latte Dark Text */
  --internal-blockquote-color: #6c6f85;  /* Latte Subtle Text */
}

/* Dark mode - Catppuccin Mocha */
.quoteback-container.dark-theme {
  --background-color: #1e1e2e;  /* Mocha Base */
  --border-color-normal: #313244;  /* Mocha Surface0 */
  --border-color-hover: #89b4fa;  /* Mocha Blue */
  --author-color: #cdd6f4;  /* Mocha Text */
  --title-color: #89b4fa;  /* Mocha Blue */
  --gototext-color: #a6e3a1;  /* Mocha Green */
  --content-color: #cdd6f4;  /* Mocha Lighter Text */
  --internal-blockquote-color: #45475a;  /* Mocha Subtle Foreground */
}

.quoteback-container {
  font-family: -apple-system, system-ui, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
  text-rendering: optimizeLegibility;
  border: 1px solid var(--border-color-normal);
  border-radius: 8px;
  margin-bottom: 25px;
  max-width: 800px;
  background-color: var(--background-color);
  text-align: left;
  transition: all 0.2s ease;
}

.quoteback-container,
.quoteback-container.dark-theme {
  color: var(--content-color);
  background-color: var(--background-color);
  border: 1px solid var(--border-color-normal);
  transition: all 0.3s ease;
}

.quoteback-container:hover,
.quoteback-container.dark-theme:hover {
  border-color: var(--border-color-hover);
}

.quoteback-author {
  color: var(--author-color);
}

.quoteback-title {
  color: var(--title-color);
}

.quoteback-arrow {
  color: var(--gototext-color);
}

.quoteback-content blockquote {
  border-left-color: var(--internal-blockquote-color);
}

.quoteback-container:hover {
  transform: translateY(-3px);
  box-shadow: 0px 6px 20px 0px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--border-color-hover);
}

/* Rest of the CSS remains the same */
.quoteback-container .quoteback-parent {
  overflow: hidden;
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.quoteback-container .quoteback-parent .quoteback-content {
  font-family: -apple-system, system-ui, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 16px;
  font-weight: 400;
  padding: 15px;
  color: var(--content-color);
  line-height: 150%;
}

.quoteback-container .quoteback-head {
  border-top: 1px solid var(--border-color-normal);
  display: flex;
  flex-flow: row nowrap;
  justify-content: start;
  align-items: stretch;
  padding-left: 15px;
  transition: all 0.2s ease;
}

.quoteback-container .quoteback-head .quoteback-avatar {
  border-radius: 100%;
  border: 1px solid var(--border-color-normal);
  width: 42px;
  height: 42px;
  min-width: 42px !important;
  margin: 12px 0px;
  position: relative;
}

.quoteback-container .quoteback-head .quoteback-avatar .mini-favicon {
  width: 22px;
  height: 22px;
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.quoteback-container .quoteback-head .quoteback-metadata {
  min-width: 0px;
  display: flex;
  flex-shrink: 1;
  align-items: center;
  margin-left: 10px;
}

.quoteback-container .quoteback-head .metadata-inner {
  font-size: 14px;
  line-height: 1.2;
  width: 100%;
  max-width: 525px;
}

@media (max-width: 414px) {
  .quoteback-container .quoteback-head .metadata-inner {
    max-width: 200px;
  }
}

.quoteback-container .quoteback-head .metadata-inner .quoteback-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
  padding-right: 20px;
  color: var(--title-color);
}

.quoteback-container .quoteback-head .metadata-inner .quoteback-author {
  font-size: 14px;
  line-height: 1.2;
  color: var(--author-color);
  font-weight: 600;
  margin-bottom: 2px;
}

.quoteback-container .quoteback-head .quoteback-backlink {
  margin-left: auto;
  display: flex;
  flex-shrink: 1;
  align-items: center;
  width: 81px;
  min-width: 81px !important;
  padding: 0px 15px !important;
  border-left: 1px solid var(--border-color-normal);
}

.quoteback-container .quoteback-head .quoteback-backlink {
  border: none !important;
  font-family: inherit !important;
  font-size: 14px !important;
  color: var(--gototext-color) !important;
  text-decoration: none !important;
  transition: opacity 0.1s ease;
}

.quoteback-arrow {
  color: var(--gototext-color) !important;
  font-size: 24px !important;
  text-decoration: none !important;
}

.quoteback-container .quoteback-head .quoteback-backlink .quoteback-arrow:hover {
  opacity: .5 !important;
}

.quoteback-container .quoteback-head .quoteback-backlink .quoteback-arrow:visited {
  text-decoration: none !important;
}

.editable:focus {
  outline: none;
}

.editable:before {
  margin-right: 8px;
  content: url(data:image/svg+xml,<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.42852 8.1826L3.83008 6.04181C3.84249 5.9758 3.87452 5.91507 3.92201 5.86756L9.55515 0.234417C9.97431 -0.184732 10.7881 -0.0275712 11.408 0.592253C12.0277 1.21199 12.1848 2.02581 11.7657 2.44496L6.13255 8.0781C6.08504 8.12559 6.02431 8.15763 5.9583 8.17004L3.81761 8.5717C3.76434 8.58168 3.70943 8.57853 3.65765 8.56251C3.60587 8.54649 3.55878 8.51809 3.52045 8.47976C3.48212 8.44143 3.45372 8.39434 3.4377 8.34256C3.42168 8.29078 3.41853 8.23588 3.42852 8.1826ZM10.0266 0.705828L4.46633 6.26605L4.17359 7.82661L5.73407 7.53378L11.2943 1.97355C11.4042 1.86366 11.3175 1.44465 10.9365 1.06366C10.5555 0.682577 10.1364 0.59594 10.0266 0.705828ZM10.2326 12H0.333333C0.289558 12 0.246212 11.9914 0.205768 11.9746C0.165325 11.9579 0.128577 11.9333 0.0976236 11.9024C0.0666701 11.8714 0.0421171 11.8347 0.0253667 11.7942C0.00861633 11.7538 -3.32535e-06 11.7104 9.62344e-10 11.6667V1.76752C-3.32535e-06 1.72374 0.00861633 1.68039 0.0253667 1.63995C0.0421171 1.59951 0.0666701 1.56276 0.0976236 1.53181C0.128577 1.50085 0.165325 1.4763 0.205768 1.45955C0.246212 1.4428 0.289558 1.43418 0.333333 1.43418H5.7154L5.04872 2.10085H0.666667V11.3333H9.89922V6.95119L10.5659 6.28453V11.6667C10.5659 11.7104 10.5573 11.7538 10.5405 11.7942C10.5238 11.8347 10.4992 11.8714 10.4683 11.9024C10.4373 11.9333 10.4006 11.9579 10.3601 11.9746C10.3197 11.9914 10.2763 12 10.2326 12Z" fill="#9DB8BF"/></svg>);
}

.quoteback-content a {
  color: var(--content-color);
  transition: opacity 0.2s ease;
}

.quoteback-content a:hover {
  opacity: .5;
}

.quoteback-content p {
  margin-block-start: 0px;
  margin-block-end: .5em;
}

.quoteback-content p:last-of-type {
  margin-block-end: 0px;
}

.quoteback-content img {
  height: auto;
  margin: .5em 0em;
}

.quoteback-content blockquote {
  border-left: 2px solid var(--border-color-normal);
  padding-left: .75em;
  margin-inline-start: 1em;
  color: var(--internal-blockquote-color);
}

.quoteback-content ol, .quoteback-content ul {
  margin-block-start: .5em;
  margin-block-end: .5em;
}

.quoteback-content h1, .quoteback-content h2, .quoteback-content h3 {
  margin-block-start: .5em;
  margin-block-end: .5em;
}
`

// Main function to apply quoteback styles
function applyQuotebackStyles(): void {
  const quotebacks = document.querySelectorAll<HTMLQuoteElement>(
    ".quoteback:not(.quoteback-processed)",
  )

  quotebacks.forEach((quote) => {
    const footerElement = quote.querySelector("footer")
    if (footerElement) {
      quote.removeChild(footerElement)
    }

    const text = quote.innerHTML
    const url = quote.cite
    const author = quote.getAttribute("data-author") || ""
    const title = quote.getAttribute("data-title") || ""
    const favicon = `https://s2.googleusercontent.com/s2/favicons?domain_url=${url}&sz=64`

    const component = document.createElement("quoteback-component")
    component.setAttribute("url", url)
    component.setAttribute("text", encodeURIComponent(text))
    component.setAttribute("author", author)
    component.setAttribute("title", encodeURIComponent(title))
    component.setAttribute("favicon", favicon)

    quote.parentNode?.replaceChild(component, quote)
    quote.classList.add("quoteback-processed")
  })
}

// Function to handle page visibility changes
function handleVisibilityChange(): void {
  if (!document.hidden) {
    applyQuotebackStyles()
  }
}

// Initial application of styles
document.addEventListener("DOMContentLoaded", applyQuotebackStyles)

// Handle browser back/forward navigation
window.addEventListener("popstate", applyQuotebackStyles)

// Handle page show events (which occur after navigating back to a page)
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    applyQuotebackStyles()
  }
})

// Handle visibility changes (e.g., switching tabs)
document.addEventListener("visibilitychange", handleVisibilityChange)

// MutationObserver to watch for dynamically added content
const qobserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      applyQuotebackStyles()
    }
  })
})

qobserver.observe(document.body, {
  childList: true,
  subtree: true,
})

const quotebackTemplate = document.createElement("template")
quotebackTemplate.innerHTML = `
    <style>${quoteStyle}</style>
    <div class="quoteback-container" role="quotation" aria-labelledby="quoteback-author" tabindex="0">
        <div id="quoteback-parent" class="quoteback-parent">
            <div class="quoteback-content"></div>       
        </div>
  
        <div class="quoteback-head">       
            <div class="quoteback-avatar"><img class="mini-favicon" src="" alt="Favicon"/></div>     
            <div class="quoteback-metadata">
                <div class="metadata-inner">
                    <div aria-label="" id="quoteback-author" class="quoteback-author"></div>
                    <div aria-label="" class="quoteback-title"></div>
                </div>  
            </div>
  
        <div class="quoteback-backlink"><a target="_blank" aria-label="go to the full text of this quotation" rel="noopener" href="" class="quoteback-arrow">⮕</a></div>
        </div>  
    </div>`

//@ts-ignore
class QuoteBack extends HTMLElement {
  private shadowRoot: ShadowRoot

  constructor() {
    super()
    this.shadowRoot = this.attachShadow({ mode: "open" })
    this.shadowRoot.appendChild(quotebackTemplate.content.cloneNode(true))
  }

  connectedCallback() {
    this.updateContent()
    this.updateTheme()
    this.setupThemeObserver()
  }

  disconnectedCallback() {
    this.themeObserver?.disconnect()
  }

  private updateContent() {
    const content = this.shadowRoot.querySelector<HTMLDivElement>(".quoteback-content")
    const miniFavicon = this.shadowRoot.querySelector<HTMLImageElement>(".mini-favicon")
    const authorElement = this.shadowRoot.querySelector<HTMLDivElement>(".quoteback-author")
    const titleElement = this.shadowRoot.querySelector<HTMLDivElement>(".quoteback-title")
    const arrowElement = this.shadowRoot.querySelector<HTMLAnchorElement>(".quoteback-arrow")

    if (content) content.innerHTML = decodeURIComponent(this.getAttribute("text") || "")
    if (miniFavicon) miniFavicon.src = this.getAttribute("favicon") || ""
    if (authorElement) {
      authorElement.textContent = this.getAttribute("author") || ""
      authorElement.setAttribute("aria-label", "quote by " + (this.getAttribute("author") || ""))
    }
    if (titleElement) {
      titleElement.textContent = decodeURIComponent(this.getAttribute("title") || "")
      titleElement.setAttribute(
        "aria-label",
        "title: " + decodeURIComponent(this.getAttribute("title") || ""),
      )
    }
    if (arrowElement) arrowElement.href = this.getAttribute("url") || ""
  }

  private themeObserver: MutationObserver | null = null

  private updateTheme() {
    const container = this.shadowRoot.querySelector<HTMLDivElement>(".quoteback-container")
    if (container) {
      const isDarkMode = document.documentElement.getAttribute("saved-theme") === "dark"
      container.classList.toggle("dark-theme", isDarkMode)
    }
  }

  private setupThemeObserver() {
    this.themeObserver = new MutationObserver(() => this.updateTheme())
    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["saved-theme"],
    })
  }
}

if (!customElements.get("quoteback-component")) {
  //@ts-ignore
  customElements.define("quoteback-component", QuoteBack)
}
