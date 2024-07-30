;(function () {
  function toggleCollapse(event: MouseEvent, header: HTMLElement): void {
    const rect = header.getBoundingClientRect()
    const relativeX = event.clientX - rect.left

    if (relativeX <= 20) {
      header.classList.toggle("collapsed")

      let currentElement = header.nextElementSibling as HTMLElement | null
      while (currentElement && !["H2", "H3", "H4", "H5", "H6"].includes(currentElement.tagName)) {
        currentElement.style.display = currentElement.style.display === "none" ? "" : "none"
        currentElement = currentElement.nextElementSibling as HTMLElement | null
      }
    }
  }

  function setupCollapsibleHeader(header: Element): void {
    const headerElement = header as HTMLElement

    // Remove existing listener if present
    if (headerElement.dataset.collapsibleListener) {
      headerElement.removeEventListener(
        "click",
        (window as any)[headerElement.dataset.collapsibleListener],
      )
      delete (window as any)[headerElement.dataset.collapsibleListener]
    }

    // Create and attach new listener
    const listenerName = `collapsibleListener_${Math.random().toString(36).substr(2, 9)}`
    const newListener = (event: MouseEvent) => toggleCollapse(event, headerElement)
    ;(window as any)[listenerName] = newListener
    headerElement.addEventListener("click", newListener)
    headerElement.dataset.collapsibleListener = listenerName
  }

  function setupCollapsibleHeaders(): void {
    const headers = document.querySelectorAll("h2, h3, h4, h5, h6")
    headers.forEach(setupCollapsibleHeader)
  }

  function observeDOM(): void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof Element) {
              const headers = node.querySelectorAll("h2, h3, h4, h5, h6")
              headers.forEach(setupCollapsibleHeader)
            }
          })
        }
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }

  function init(): void {
    setupCollapsibleHeaders()
    observeDOM()
  }

  // Run the function when the DOM is fully loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
  } else {
    init()
  }
})()
