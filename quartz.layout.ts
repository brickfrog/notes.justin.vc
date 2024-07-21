import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { mapFn, sortFn } from "./functions.ts"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [Component.Backlinks()],
  footer: Component.Footer({
    links: {
      "justin.vc": "https://justin.vc",
      "org-roam": "https://orgroam.com",
      "ox-hugo": "https://ox-hugo.scripter.co/",
      "GNU Emacs": "https://www.gnu.org/software/emacs/",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs({
      rootName: "Index",
      showCurrentPage: false,
    }),
    Component.ArticleTitle(),
    Component.TagList(),
    Component.ContentMeta({
      showReadingTime: false,
      showFootnoteLink: true,
      showComma: true,
    }),
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
  right: [Component.Graph(), Component.DesktopOnly(Component.TableOfContents())],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
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
  right: [],
}
