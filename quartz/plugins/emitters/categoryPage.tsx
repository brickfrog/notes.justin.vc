import { QuartzEmitterPlugin } from "../types"
import { QuartzComponentProps } from "../../components/types"
import HeaderConstructor from "../../components/Header"
import BodyConstructor from "../../components/Body"
import { pageResources, renderPage } from "../../components/renderPage"
import { ProcessedContent, QuartzPluginData, defaultProcessedContent } from "../vfile"
import { FullPageLayout } from "../../cfg"
import {
  FilePath,
  FullSlug,
  getAllSegmentPrefixes,
  joinSegments,
  pathToRoot,
} from "../../util/path"
import { defaultListPageLayout, sharedPageComponents } from "../../../quartz.layout"
import { CategoryContent } from "../../components"
import { write } from "./helpers"
import { i18n } from "../../i18n"
import DepGraph from "../../depgraph"

interface CategoryPageOptions extends FullPageLayout {
  sort?: (f1: QuartzPluginData, f2: QuartzPluginData) => number
}

export const CategoryPage: QuartzEmitterPlugin<Partial<CategoryPageOptions>> = (userOpts) => {
  const opts: FullPageLayout = {
    ...sharedPageComponents,
    ...defaultListPageLayout,
    pageBody: CategoryContent({ sort: userOpts?.sort }),
    ...userOpts,
  }

  const { head: Head, header, beforeBody, pageBody, afterBody, left, right, footer: Footer } = opts
  const Header = HeaderConstructor()
  const Body = BodyConstructor()

  return {
    name: "CategoryPage",
    getQuartzComponents() {
      return [
        Head,
        Header,
        Body,
        ...header,
        ...beforeBody,
        pageBody,
        ...afterBody,
        ...left,
        ...right,
        Footer,
      ]
    },
    async getDependencyGraph(ctx, content, _resources) {
      const graph = new DepGraph<FilePath>()

      for (const [_tree, file] of content) {
        const sourcePath = file.data.filePath!
        const categories = ((file.data.frontmatter?.categories ?? []) as string[]).flatMap(
          getAllSegmentPrefixes,
        )
        if (categories.length > 0) {
          categories.push("index")
        }

        for (const category of categories) {
          graph.addEdge(
            sourcePath,
            joinSegments(ctx.argv.output, "categories", category + ".html") as FilePath,
          )
        }
      }

      return graph
    },

    async emit(ctx, content, resources): Promise<FilePath[]> {
      const fps: FilePath[] = []
      const allFiles = content.map((c) => c[1].data)
      const cfg = ctx.cfg.configuration

      const categories: Set<string> = new Set(
        allFiles
          .flatMap((data) => (data.frontmatter?.categories ?? []) as string[])
          .flatMap(getAllSegmentPrefixes),
      )

      // add base category
      categories.add("index")

      const categoryDescriptions: Record<string, ProcessedContent> = Object.fromEntries(
        [...categories].map((category) => {
          const title =
            category === "index"
              ? i18n(cfg.locale).pages.categoryContent.categoryIndex
              : `${i18n(cfg.locale).pages.categoryContent.category}: ${category}`
          return [
            category,
            defaultProcessedContent({
              slug: joinSegments("categories", category) as FullSlug,
              frontmatter: { title, categories: [] },
            }),
          ]
        }),
      )

      for (const [tree, file] of content) {
        const slug = file.data.slug!
        if (slug.startsWith("categories/")) {
          const category = slug.slice("categories/".length)
          if (categories.has(category)) {
            categoryDescriptions[category] = [tree, file]
          }
        }
      }

      for (const category of categories) {
        const slug = joinSegments("categories", category) as FullSlug
        const externalResources = pageResources(pathToRoot(slug), resources)
        const [tree, file] = categoryDescriptions[category]
        const componentData: QuartzComponentProps = {
          ctx,
          fileData: file.data,
          externalResources,
          cfg,
          children: [],
          tree,
          allFiles,
        }

        const content = renderPage(cfg, slug, componentData, opts, externalResources)
        const fp = await write({
          ctx,
          content,
          slug: file.data.slug!,
          ext: ".html",
        })

        fps.push(fp)
      }
      return fps
    },
  }
}
