import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { mapFn, sortFn } from "./functions.ts"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [Component.Backlinks()],
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
    Component.DesktopOnly(Component.Sidenote({ debug: true })),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.LinkList(),
    Component.DesktopOnly(
      Component.Explorer({
        title: "Notes",
        mapFn: mapFn,
        sortFn: sortFn,
      }),
    ),
  ],
  right: [
    Component.DesktopOnly(Component.Graph()),
    Component.DesktopOnly(Component.TableOfContents()),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.Frontmatter()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.LinkList(),
    Component.DesktopOnly(
      Component.Explorer({
        title: "Notes",
        mapFn: mapFn,
        sortFn: sortFn,
      }),
    ),
  ],
  right: [
    Component.DesktopOnly(Component.Graph()),
    Component.DesktopOnly(Component.TableOfContents()),
  ],
}
