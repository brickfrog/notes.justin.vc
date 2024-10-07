import { pathToRoot, slugTag } from "../util/path"
import { formatDate, getDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import style from "./styles/frontmatter.scss"

interface ContentMetaOptions {
  showReadingTime: boolean
  showBacklinkLink: boolean
  showFootnoteLink: boolean
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: true,
  showBacklinkLink: true,
  showFootnoteLink: true,
}

// Extend the frontmatter type to include the lastmod property and categories
type ExtendedFrontmatter = NonNullable<QuartzComponentProps["fileData"]["frontmatter"]> & {
  lastmod?: string | number | Date
  categories?: string[]
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function getGithubLink(filePath: string): string {
    const githubBaseUrl = "https://raw.githubusercontent.com/brickfrog/notes.justin.vc/master/"
    return `${githubBaseUrl}${filePath}`
  }

  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text
    const title = fileData.frontmatter?.title || "Untitled"
    const frontmatter = fileData.frontmatter as ExtendedFrontmatter | undefined

    if (text) {
      const { minutes, words: _words } = readingTime(text)
      const readingTimeText = i18n(cfg.locale).components.contentMeta.readingTime({
        minutes: Math.ceil(minutes),
      })

      const parseDate = (dateString: string | number | Date | undefined): Date | null => {
        if (dateString === undefined) return null
        const parsed = new Date(dateString)
        return isNaN(parsed.getTime()) ? null : parsed
      }

      const createdDate = getDate(cfg, fileData)
      const modifiedDate = parseDate(frontmatter?.lastmod)
      const nodeStatus = frontmatter?.status
      const authorName = frontmatter?.author
      const tags = frontmatter?.tags
      const categories = frontmatter?.categories
      const baseDir = pathToRoot(fileData.slug!)

      const braveSearch = "https://search.brave.com/search?q=" + title
      const redditSearch = `https://old.reddit.com/search?q=${title}&restrict_sr=&sort=relevance&t=all`

      return (
        <details class="frontmatter" open>
          <summary class="fm-title">{title}</summary>
          <div class={classNames(displayClass, "content-meta-box")}>
            <div class="meta-column">
              <p class="fm-author"> {authorName}</p>
              {createdDate && (
                <p class="fm-created">
                  <a href={fileData.filePath ? getGithubLink(fileData.filePath) : "#"}>
                    {formatDate(createdDate, cfg.locale)}
                  </a>
                </p>
              )}
              {modifiedDate && (
                <p class="fm-modified">
                  <a href={fileData.filePath ? getGithubLink(fileData.filePath) : "#"}>
                    {formatDate(modifiedDate, cfg.locale)}
                  </a>
                </p>
              )}
              {options.showReadingTime && <p class="fm-reading">{readingTimeText}</p>}
              {nodeStatus ? <p class="fm-status">{nodeStatus}</p> : null}
            </div>
            {(tags && tags.length > 0) || (categories && categories.length > 0) ? (
              <>
                <div class="meta-column">
                  {categories && categories.length > 0 && (
                    <div>
                      <ul class={classNames(displayClass, "fm-categories")}>
                        {categories.map((category) => {
                          const linkDest = baseDir + `/categories/${slugTag(category)}`
                          return (
                            <li>
                              <a href={linkDest} class="internal category-link">
                                {category}
                              </a>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}
                  {tags && tags.length > 0 && (
                    <div>
                      <ul class={classNames(displayClass, "fm-tags")}>
                        {tags.map((tag) => {
                          const linkDest = baseDir + `/tags/${slugTag(tag)}`
                          return (
                            <li>
                              <a href={linkDest} class="internal tag-link">
                                {tag}
                              </a>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}
                </div>
                <div class="meta-column">
                  <h4>Links</h4>
                  {options.showFootnoteLink && (
                    <p>
                      <a href="#footnote-label">Footnotes</a>
                    </p>
                  )}
                  {options.showBacklinkLink && (
                    <p>
                      <a href="#backlinks">Backlinks</a>
                    </p>
                  )}
                  <p>
                    <a href={braveSearch}>Brave Search</a>
                  </p>
                  <p>
                    <a href={redditSearch}>reddit</a>
                  </p>
                </div>
              </>
            ) : null}
          </div>
        </details>
      )
    }

    return null
  }

  ContentMetadata.css = style

  ContentMetadata.beforeDOMLoaded = `
    const savedState = localStorage.getItem('contentMetaState');
    if (savedState === 'closed') {
      document.querySelector('.frontmatter')?.removeAttribute('open');
    }
  `

  ContentMetadata.afterDOMLoaded = `
    const detailsElement = document.querySelector('.frontmatter');
    if (detailsElement) {
      detailsElement.addEventListener('toggle', (event) => {
        if (event.target instanceof HTMLDetailsElement) {
          localStorage.setItem('contentMetaState', event.target.open ? 'open' : 'closed');
        }
      });
    }
  `

  return ContentMetadata
}) satisfies QuartzComponentConstructor
