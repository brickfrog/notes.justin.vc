import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/toc.scss"
import { classNames } from "../util/lang"

// @ts-ignore
import script from "./scripts/toc.inline"
import { i18n } from "../i18n"

const TableOfContents: QuartzComponent = ({
  fileData,
  displayClass,
  cfg,
}: QuartzComponentProps) => {
  if (!fileData.toc) {
    return null
  }

  return (
    <div class={classNames(displayClass, "toc", "gwern-toc")}>
      <div class="toc-content">
        <ol class="toc-list">
          {fileData.toc
            .filter((entry) => entry.depth <= 3)
            .map((tocEntry, index) => (
            <li key={tocEntry.slug} class={`toc-item depth-${tocEntry.depth}`}>
              <a href={`#${tocEntry.slug}`} data-for={tocEntry.slug}>
                {index + 1}. {tocEntry.text}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
TableOfContents.css = style
TableOfContents.beforeDOMLoaded = script

export default (() => {
  return TableOfContents
}) satisfies QuartzComponentConstructor
