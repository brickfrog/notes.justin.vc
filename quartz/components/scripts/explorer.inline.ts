import { FolderState } from "../ExplorerNode"

type MaybeHTMLElement = HTMLElement | undefined
let currentExplorerState: FolderState[]
let isSetupComplete = false

const observer = new IntersectionObserver((entries) => {
  // If last element is observed, remove gradient of "overflow" class so element is visible
  const explorerUl = document.getElementById("explorer-ul")
  if (!explorerUl) return
  for (const entry of entries) {
    if (entry.isIntersecting) {
      explorerUl.classList.add("no-background")
    } else {
      explorerUl.classList.remove("no-background")
    }
  }
})

function toggleExplorer(this: HTMLElement) {
  this.classList.toggle("collapsed")
  this.setAttribute(
    "aria-expanded",
    this.getAttribute("aria-expanded") === "true" ? "false" : "true",
  )
  const content = this.nextElementSibling as MaybeHTMLElement
  if (!content) return

  content.classList.toggle("collapsed")
}

function toggleFolder(evt: MouseEvent) {
  evt.stopPropagation()
  evt.preventDefault() // Prevent default link behavior

  const target = evt.target as MaybeHTMLElement
  if (!target) return

  const isSvg = target.nodeName === "svg"
  const isPath = target.nodeName === "path" || target.nodeName === "polyline"

  // Handle clicks on SVG elements (including paths/polylines inside SVG)
  let actualTarget = target
  if (isPath) {
    actualTarget = target.closest("svg") as HTMLElement | undefined
  }

  const childFolderContainer = (
    isSvg || isPath
      ? actualTarget?.parentElement?.nextSibling
      : actualTarget?.parentElement?.parentElement?.nextElementSibling
  ) as MaybeHTMLElement

  const currentFolderParent = (
    isSvg || isPath ? actualTarget?.nextElementSibling : actualTarget?.parentElement
  ) as MaybeHTMLElement

  if (!(childFolderContainer && currentFolderParent)) return

  childFolderContainer.classList.toggle("open")
  const isCollapsed = childFolderContainer.classList.contains("open")
  setFolderState(childFolderContainer, !isCollapsed)
  const fullFolderPath = currentFolderParent.dataset.folderpath as string
  if (fullFolderPath && currentExplorerState) {
    toggleCollapsedByPath(currentExplorerState, fullFolderPath)
    const stringifiedFileTree = JSON.stringify(currentExplorerState)
    localStorage.setItem("fileTree", stringifiedFileTree)
  }
}

function cleanupExplorerEvents() {
  // Remove all existing event listeners
  const explorer = document.getElementById("explorer")
  if (explorer) {
    explorer.removeEventListener("click", toggleExplorer)
  }

  // Remove folder button listeners
  const folderButtons = document.getElementsByClassName(
    "folder-button",
  ) as HTMLCollectionOf<HTMLElement>
  for (const item of folderButtons) {
    item.removeEventListener("click", toggleFolder)
  }

  // Remove folder icon listeners
  const folderIcons = document.getElementsByClassName(
    "folder-icon",
  ) as HTMLCollectionOf<HTMLElement>
  for (const item of folderIcons) {
    item.removeEventListener("click", toggleFolder)
  }
}

function setupExplorer() {
  // Prevent multiple setups
  if (isSetupComplete) {
    cleanupExplorerEvents()
  }

  const explorer = document.getElementById("explorer")
  if (!explorer) return

  // Set up main explorer toggle
  explorer.addEventListener("click", toggleExplorer)
  if (window.addCleanup) {
    window.addCleanup(() => explorer.removeEventListener("click", toggleExplorer))
  }

  if (explorer.dataset.behavior === "collapse") {
    // Set up click handlers for folder buttons
    for (const item of document.getElementsByClassName(
      "folder-button",
    ) as HTMLCollectionOf<HTMLElement>) {
      item.addEventListener("click", toggleFolder)
      if (window.addCleanup) {
        window.addCleanup(() => item.removeEventListener("click", toggleFolder))
      }
    }
  }

  // Set up click handlers for folder icons (SVG elements)
  for (const item of document.getElementsByClassName(
    "folder-icon",
  ) as HTMLCollectionOf<HTMLElement>) {
    item.addEventListener("click", toggleFolder)
    if (window.addCleanup) {
      window.addCleanup(() => item.removeEventListener("click", toggleFolder))
    }
  }

  // Get folder state from local storage
  const storageTree = localStorage.getItem("fileTree")
  const useSavedFolderState = explorer?.dataset.savestate === "true"
  const oldExplorerState: FolderState[] =
    storageTree && useSavedFolderState ? JSON.parse(storageTree) : []
  const oldIndex = new Map(oldExplorerState.map((entry) => [entry.path, entry.collapsed]))
  const newExplorerState: FolderState[] = explorer.dataset.tree
    ? JSON.parse(explorer.dataset.tree)
    : []
  currentExplorerState = []
  for (const { path, collapsed } of newExplorerState) {
    currentExplorerState.push({ path, collapsed: oldIndex.get(path) ?? collapsed })
  }

  // Apply folder states immediately to prevent flicker
  currentExplorerState.forEach((folderState) => {
    const folderLi = document.querySelector(
      `[data-folderpath='${folderState.path}']`,
    ) as MaybeHTMLElement
    const folderUl = folderLi?.parentElement?.nextElementSibling as MaybeHTMLElement
    if (folderUl) {
      // Apply state immediately without transition
      folderUl.style.transition = "none"
      setFolderState(folderUl, folderState.collapsed)
      // Force reflow then restore transition
      folderUl.offsetHeight
      folderUl.style.transition = ""
    }
  })

  isSetupComplete = true
}

// Debounce resize events to prevent excessive setup calls
let resizeTimeout: ReturnType<typeof setTimeout>
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(setupExplorer, 100)
})

document.addEventListener("nav", () => {
  isSetupComplete = false
  setupExplorer()
  observer.disconnect()

  // select pseudo element at end of list
  const lastItem = document.getElementById("explorer-end")
  if (lastItem) {
    observer.observe(lastItem)
  }
})

/**
 * Toggles the state of a given folder
 * @param folderElement <div class="folder-outer"> Element of folder (parent)
 * @param collapsed if folder should be set to collapsed or not
 */
function setFolderState(folderElement: HTMLElement, collapsed: boolean) {
  return collapsed ? folderElement.classList.remove("open") : folderElement.classList.add("open")
}

/**
 * Toggles visibility of a folder
 * @param array array of FolderState (`fileTree`, either get from local storage or data attribute)
 * @param path path to folder (e.g. 'advanced/more/more2')
 */
function toggleCollapsedByPath(array: FolderState[], path: string) {
  const entry = array.find((item) => item.path === path)
  if (entry) {
    entry.collapsed = !entry.collapsed
  }
}

// Initialize on page load
setupExplorer()
