function setupCollapsibleHeaders(): void {
  const headers = document.querySelectorAll("h2, h3, h4, h5, h6")

  headers.forEach((header: Element) => {
    // Remove previously attached listeners to avoid duplicates
    if ((header as any).toggleCollapseListener) {
      header.removeEventListener("click", (header as any).toggleCollapseListener)
    }

    const newListener = (event: MouseEvent) => toggleCollapse(event, header)
    // @ts-ignore
    header.addEventListener("click", newListener)
    ;(header as any).toggleCollapseListener = newListener
  })
}

function toggleCollapse(event: MouseEvent, header: Element): void {
  const headerElement = header as HTMLElement
  const rect = headerElement.getBoundingClientRect()
  const relativeX = event.clientX - rect.left

  if (relativeX <= 20) {
    headerElement.classList.toggle("collapsed")

    let currentElement = headerElement.nextElementSibling as HTMLElement | null
    while (currentElement && !["H2", "H3", "H4", "H5", "H6"].includes(currentElement.tagName)) {
      currentElement.style.display = currentElement.style.display === "none" ? "" : "none"
      currentElement = currentElement.nextElementSibling as HTMLElement | null
    }
  }
}

function setupObserver(): void {
  // Only set up observer once to avoid multiple instances
  if (!(window as any).headersObserver) {
    const observer = new MutationObserver(() => {
      setupCollapsibleHeaders()
    })

    observer.observe(document.body, { childList: true, subtree: true })
    ;(window as any).headersObserver = observer
  }
}

// Initial setup
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setupCollapsibleHeaders()
    setupObserver()
  })
} else {
  setupCollapsibleHeaders()
  setupObserver()
}
