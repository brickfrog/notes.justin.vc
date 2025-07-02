const userPref = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
const currentTheme = localStorage.getItem("theme") ?? userPref

// Apply theme immediately to prevent flashing
document.documentElement.setAttribute("saved-theme", currentTheme)

const emitThemeChangeEvent = (theme: "light" | "dark") => {
  const event: CustomEventMap["themechange"] = new CustomEvent("themechange", {
    detail: { theme },
  })
  document.dispatchEvent(event)
}

let themeInitialized = false

document.addEventListener("nav", () => {
  // Prevent multiple initialization
  if (themeInitialized) return

  const switchTheme = (e: Event) => {
    e.preventDefault()
    e.stopPropagation()

    const newTheme =
      document.documentElement.getAttribute("saved-theme") === "dark" ? "light" : "dark"

    // Apply theme immediately
    document.documentElement.setAttribute("saved-theme", newTheme)
    localStorage.setItem("theme", newTheme)
    emitThemeChangeEvent(newTheme)
  }

  const themeChange = (e: MediaQueryListEvent) => {
    const newTheme = e.matches ? "dark" : "light"
    const currentSavedTheme = localStorage.getItem("theme")

    // Only change if user hasn't manually set a preference
    if (!currentSavedTheme) {
      document.documentElement.setAttribute("saved-theme", newTheme)
      localStorage.setItem("theme", newTheme)
      emitThemeChangeEvent(newTheme)
    }
  }

  // Darkmode toggle
  const themeButton = document.querySelector("#darkmode") as HTMLButtonElement
  if (themeButton) {
    themeButton.addEventListener("click", switchTheme)
    window.addCleanup(() => themeButton.removeEventListener("click", switchTheme))
  }

  // Listen for changes in prefers-color-scheme
  const colorSchemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
  colorSchemeMediaQuery.addEventListener("change", themeChange)
  window.addCleanup(() => colorSchemeMediaQuery.removeEventListener("change", themeChange))

  themeInitialized = true
})

// Ensure theme is applied on initial load
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme")
  if (savedTheme) {
    document.documentElement.setAttribute("saved-theme", savedTheme)
  }
})
