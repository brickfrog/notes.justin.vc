;(function () {
  let tocContent: Element | null = null
  let lastActiveLink: Element | null = null

  function initializeToc() {
    tocContent = document.getElementById("toc-content")
    if (!tocContent) return

    const headings = document.querySelectorAll("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]")
    const tocLinks = tocContent.querySelectorAll("a")

    // Additional initialization if needed
  }

  function updateToc() {
    if (!tocContent) return

    const headers = Array.from(
      document.querySelectorAll("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]"),
    )
    const scrollPosition = window.scrollY

    let activeHeader: Element | null = null
    for (let i = headers.length - 1; i >= 0; i--) {
      const header = headers[i]
      const headerTop = header.getBoundingClientRect().top + window.scrollY
      if (headerTop <= scrollPosition + 100) {
        activeHeader = header
        break
      }
    }

    if (activeHeader) {
      const id = activeHeader.id
      const tocEntryElement = tocContent.querySelector(`a[href="#${id}"]`)

      if (tocEntryElement instanceof Element && tocEntryElement !== lastActiveLink) {
        if (lastActiveLink instanceof Element) {
          lastActiveLink.classList.remove("in-view")
        }
        tocEntryElement.classList.add("in-view")
        scrollTocToView(tocEntryElement)
        lastActiveLink = tocEntryElement
      }
    }
  }

  function scrollTocToView(element: Element) {
    if (!tocContent) return

    const tocRect = tocContent.getBoundingClientRect()
    const elementRect = element.getBoundingClientRect()

    const relativeTop = elementRect.top - tocRect.top
    const relativeBottom = elementRect.bottom - tocRect.top

    if (relativeTop < 0 || relativeBottom > tocRect.height) {
      const scrollTarget =
        tocContent.scrollTop + relativeTop - tocRect.height / 2 + elementRect.height / 2

      requestAnimationFrame(() => {
        tocContent?.scrollTo({
          top: scrollTarget,
          behavior: "smooth",
        })
      })
    }
  }
  function setupTocToggle() {
    const toc = document.getElementById("toc")
    if (toc) {
      const collapsed = toc.classList.contains("collapsed")
      const content = toc.nextElementSibling as HTMLElement | undefined
      if (!content) return
      toc.addEventListener("click", toggleTocHandler)
      window.addCleanup(() => toc.removeEventListener("click", toggleTocHandler))
    }
  }

  function toggleTocHandler(this: HTMLElement) {
    this.classList.toggle("collapsed")
    this.setAttribute(
      "aria-expanded",
      this.getAttribute("aria-expanded") === "true" ? "false" : "true",
    )
    const content = this.nextElementSibling as HTMLElement | undefined
    if (!content) return
    content.classList.toggle("collapsed")
  }

  function updateProgressBar() {
    const progressBar = document.querySelector(".toc-progress-bar") as HTMLElement
    if (!progressBar) return

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollHeight =
      document.documentElement.scrollHeight - document.documentElement.clientHeight
    const scrollPercentage = (scrollTop / scrollHeight) * 100
    progressBar.style.width = `${scrollPercentage}%`
  }

  function setupEventListeners() {
    window.removeEventListener("scroll", scrollHandler)
    window.addEventListener("scroll", scrollHandler)
    setupTocToggle()
  }

  function scrollHandler() {
    requestAnimationFrame(() => {
      updateToc()
      updateProgressBar()
    })
  }

  function observeDOM() {
    const observer = new MutationObserver((mutations) => {
      let shouldUpdate = false
      mutations.forEach((mutation) => {
        //@ts-ignore
        if (mutation.type === "childList" || mutation.type === "subtree") {
          shouldUpdate = true
        }
      })
      if (shouldUpdate) {
        initializeToc()
        updateToc()
        updateProgressBar()
        setupEventListeners()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }

  function init() {
    initializeToc()
    updateToc()
    updateProgressBar()
    setupEventListeners()
    observeDOM()
  }

  // Run the function when the DOM is fully loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
  } else {
    init()
  }
})()
