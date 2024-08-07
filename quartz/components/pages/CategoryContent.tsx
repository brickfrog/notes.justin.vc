import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import style from "../styles/listPage.scss"
import { PageList, SortFn } from "../PageList"
import { FullSlug, getAllSegmentPrefixes, simplifySlug } from "../../util/path"
import { QuartzPluginData } from "../../plugins/vfile"
import { Root } from "hast"
import { htmlToJsx } from "../../util/jsx"
import { i18n } from "../../i18n"

interface CategoryContentOptions {
  sort?: SortFn
  numPages: number
}

const defaultOptions: CategoryContentOptions = {
  numPages: 10,
}

export default ((opts?: Partial<CategoryContentOptions>) => {
  const options: CategoryContentOptions = { ...defaultOptions, ...opts }

  const CategoryContent: QuartzComponent = (props: QuartzComponentProps) => {
    const { tree, fileData, allFiles, cfg } = props
    const slug = fileData.slug

    if (!(slug?.startsWith("categories/") || slug === "categories")) {
      throw new Error(`Component "CategoryContent" tried to render a non-category page: ${slug}`)
    }

    const category = simplifySlug(slug.slice("categories/".length) as FullSlug)
    const allPagesWithCategory = (category: string) =>
      allFiles.filter((file) =>
        ((file.frontmatter?.categories ?? []) as string[])
          .flatMap(getAllSegmentPrefixes)
          .includes(category),
      )

    const content =
      (tree as Root).children.length === 0
        ? fileData.description
        : htmlToJsx(fileData.filePath!, tree)
    const cssClasses: string[] = fileData.frontmatter?.cssclasses ?? []
    const classes = ["popover-hint", ...cssClasses].join(" ")
    if (category === "/") {
      const categories = [
        ...new Set(
          allFiles
            .flatMap((data) => (data.frontmatter?.categories ?? []) as string[])
            .flatMap(getAllSegmentPrefixes),
        ),
      ].sort((a, b) => a.localeCompare(b))
      const categoryItemMap: Map<string, QuartzPluginData[]> = new Map()
      for (const category of categories) {
        categoryItemMap.set(category, allPagesWithCategory(category))
      }
      return (
        <div class={classes}>
          <article>
            <p>{content}</p>
          </article>
          <p>
            {i18n(cfg.locale).pages.categoryContent.totalCategories({ count: categories.length })}
          </p>
          <div>
            {categories.map((category) => {
              const pages = categoryItemMap.get(category)!
              const listProps = {
                ...props,
                allFiles: pages,
              }

              const contentPage = allFiles
                .filter((file) => file.slug === `categories/${category}`)
                .at(0)

              const root = contentPage?.htmlAst
              const content =
                !root || root?.children.length === 0
                  ? contentPage?.description
                  : htmlToJsx(contentPage.filePath!, root)

              return (
                <div>
                  <h2>
                    <a class="internal category-link" href={`../categories/${category}`}>
                      {category}
                    </a>
                  </h2>
                  {content && <p>{content}</p>}
                  <div class="page-listing">
                    <p>
                      {i18n(cfg.locale).pages.categoryContent.itemsUnderCategory({
                        count: pages.length,
                      })}
                      {pages.length > options.numPages && (
                        <>
                          {" "}
                          <span>
                            {i18n(cfg.locale).pages.categoryContent.showingFirst({
                              count: options.numPages,
                            })}
                          </span>
                        </>
                      )}
                    </p>
                    <PageList limit={options.numPages} {...listProps} sort={opts?.sort} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )
    } else {
      const pages = allPagesWithCategory(category)
      const listProps = {
        ...props,
        allFiles: pages,
      }

      return (
        <div class={classes}>
          <article>{content}</article>
          <div class="page-listing">
            <p>
              {i18n(cfg.locale).pages.categoryContent.itemsUnderCategory({ count: pages.length })}
            </p>
            <div>
              <PageList {...listProps} />
            </div>
          </div>
        </div>
      )
    }
  }

  CategoryContent.css = style + PageList.css
  return CategoryContent
}) satisfies QuartzComponentConstructor
