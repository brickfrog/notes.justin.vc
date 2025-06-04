import { pathToRoot, slugTag } from "../util/path"
import { formatDate, getDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import style from "./styles/contentMeta.scss"

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

export default ((opts?: Partial<ContentMetaOptions>) => {
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function getGithubLink(filePath: string): string {
    const githubBaseUrl = "https://raw.githubusercontent.com/brickfrog/notes.justin.vc/v4/"
    return `${githubBaseUrl}${filePath}`
  }

  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text
    const title = fileData.frontmatter?.title || "Untitled"

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
      //@ts-ignore
      const modifiedDate = parseDate(fileData.frontmatter?.lastmod)
      const nodeStatus = fileData.frontmatter?.status
      const authorName = fileData.frontmatter?.author
      const tags = fileData.frontmatter?.tags
      const baseDir = pathToRoot(fileData.slug!)

      const braveSearch = "https://search.brave.com/search?q=" + title
      const redditSearch = `https://old.reddit.com/search?q=${title}&restrict_sr=&sort=relevance&t=all`

      return (
        <details class="frontmatter" open>
          <summary>{title}</summary>
          <div class={classNames(displayClass, "content-meta-box")}>
            <div class="meta-column">
              <p>𝘼: {authorName}</p>
              {createdDate && (
                <p>
                  created:{" "}
                  <a href={fileData.filePath ? getGithubLink(fileData.filePath) : "#"}>
                    {formatDate(createdDate, cfg.locale)}
                  </a>
                </p>
              )}
              {modifiedDate && (
                <p>
                  modified:{" "}
                  <a href={fileData.filePath ? getGithubLink(fileData.filePath) : "#"}>
                    {formatDate(modifiedDate, cfg.locale)}
                  </a>
                  {options.showReadingTime && <p>reading_time: {readingTimeText}</p>}
                </p>
              )}
              {nodeStatus ? <p>status: {nodeStatus}</p> : null}{" "}
            </div>
            {tags && tags.length > 0 && (
              <div class="meta-column">
                <ul class={classNames(displayClass, "tags")}>
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
          </div>
        </details>
      )
    } else {
      return null
    }
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
