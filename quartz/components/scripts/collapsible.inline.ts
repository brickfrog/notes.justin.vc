document.addEventListener("nav", () => {
  const setupCollapsibleHeaders = () => {
    const headers = document.querySelectorAll("h2, h3, h4, h5, h6")

    headers.forEach((header) => {
      const toggleCollapse = function (this: HTMLElement) {
        this.classList.toggle("collapsed")
        let currentElement = this.nextElementSibling as HTMLElement | null

        while (currentElement && !["H2", "H3", "H4", "H5", "H6"].includes(currentElement.tagName)) {
          if (currentElement.style.display === "none") {
            currentElement.style.display = ""
          } else {
            currentElement.style.display = "none"
          }
          currentElement = currentElement.nextElementSibling as HTMLElement | null
        }
      }

      header.addEventListener("click", toggleCollapse)
      window.addCleanup(() => header.removeEventListener("click", toggleCollapse))
    })
  }

  setupCollapsibleHeaders()

  const observer = new MutationObserver(() => {
    setupCollapsibleHeaders()
  })

  observer.observe(document.body, { childList: true, subtree: true })
  window.addCleanup(() => observer.disconnect())

  window.addEventListener("popstate", setupCollapsibleHeaders)
  window.addCleanup(() => window.removeEventListener("popstate", setupCollapsibleHeaders))

  document.addEventListener("turbolinks:load", setupCollapsibleHeaders)
  window.addCleanup(() => document.removeEventListener("turbolinks:load", setupCollapsibleHeaders))
})
