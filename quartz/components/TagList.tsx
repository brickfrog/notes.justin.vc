import { pathToRoot, slugTag } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const TagList: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const tags = fileData.frontmatter?.tags
  const baseDir = pathToRoot(fileData.slug!)
  if (tags && tags.length > 0) {
    return (
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
    )
  } else {
    return null
  }
}

TagList.css = `
.tags {
  list-style: none;
  display: flex;
  padding-left: 0;
  gap: 0.4rem;
  flex-wrap: wrap;
  justify-self: end;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  margin-bottom: 0.25rem;
  background-color: var(--light);
  color: var(--darkgray);
  font-family: var(--codeFont);
}

.tags::before {
  content: "tags:";
}

.section-li > .section > .tags {
  justify-content: flex-end;
}
  
.tags > li {
  display: inline-block;
  white-space: nowrap;
  margin: 0;
  overflow-wrap: normal;
}

a.internal.tag-link {
  font-family: var(--codeFont);
  border-radius: 8px;
  padding: 0.2rem 0.4rem;
  margin: 0 0.1rem;
}
`

export default (() => TagList) satisfies QuartzComponentConstructor
