// @ts-ignore
import clipboardScript from "./scripts/clipboard.inline"
import clipboardStyle from "./styles/clipboard.scss"
// @ts-ignore
import collapsibleScript from "./scripts/collapsible.inline"
import collapsibleStyle from "./styles/collapsible.scss"
// @ts-ignore
import quotebacksScript from "./scripts/quoteback.inline"

import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const Body: QuartzComponent = ({ children }: QuartzComponentProps) => {
  return <div id="quartz-body">{children}</div>
}

Body.afterDOMLoaded = `
  ${clipboardScript}
  ${collapsibleScript}
  ${quotebacksScript}
`

Body.css = `
  ${clipboardStyle}
  ${collapsibleStyle}
`

export default (() => Body) satisfies QuartzComponentConstructor
