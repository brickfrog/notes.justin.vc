import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { mapFn, sortFn } from "./functions.ts"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [Component.HeaderNav()],
  afterBody: [Component.Backlinks(), Component.Search()],
  footer: Component.Footer(),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs({
      rootName: "Index",
      showCurrentPage: false,
    }),
    Component.Frontmatter({
      showReadingTime: true,
      showFootnoteLink: true,
    }),
    Component.TableOfContents(),
    Component.DesktopOnly(Component.Sidenote({ debug: true })),
  ],
  left: [
    Component.ProgressBar(),
    Component.DesktopOnly(
      Component.Explorer({
        title: "Notes",
        mapFn: mapFn,
        filterFn: (node) => {
          const omit = new Set(["categories", "tags", "hosting"])
          return !omit.has(node.name.toLowerCase())
        },
        sortFn: sortFn,
      }),
    ),
  ],
  right: [Component.DesktopOnly(Component.Graph())],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.Frontmatter()],
  left: [
    Component.MobileOnly(Component.Spacer()),
    Component.DesktopOnly(
      Component.Explorer({
        title: "Notes",
        mapFn: mapFn,
        filterFn: (node) => {
          const omit = new Set(["categories", "tags", "hosting"])
          return !omit.has(node.name.toLowerCase())
        },
        sortFn: sortFn,
      }),
    ),
  ],
  right: [Component.DesktopOnly(Component.Graph())],
}
