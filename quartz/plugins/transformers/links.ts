import { QuartzTransformerPlugin } from "../types"
import {
  FullSlug,
  RelativeURL,
  SimpleSlug,
  TransformOptions,
  stripSlashes,
  simplifySlug,
  splitAnchor,
  transformLink,
  joinSegments,
} from "../../util/path"
import path from "path"
import { visit } from "unist-util-visit"
import isAbsoluteUrl from "is-absolute-url"
import { Root } from "hast"

interface Options {
  /** How to resolve Markdown paths */
  markdownLinkResolution: TransformOptions["strategy"]
  /** Strips folders from a link so that it looks nice */
  prettyLinks: boolean
  openLinksInNewTab: boolean
  lazyLoad: boolean
  externalLinkIcon: boolean
}

const defaultOptions: Options = {
  markdownLinkResolution: "absolute",
  prettyLinks: true,
  openLinksInNewTab: false,
  lazyLoad: false,
  externalLinkIcon: true,
}

export const CrawlLinks: QuartzTransformerPlugin<Partial<Options> | undefined> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }
  return {
    name: "LinkProcessing",
    htmlPlugins(ctx) {
      return [
        () => {
          return (tree: Root, file) => {
            const curSlug = simplifySlug(file.data.slug!)
            const outgoing: Set<SimpleSlug> = new Set()

            const transformOptions: TransformOptions = {
              strategy: opts.markdownLinkResolution,
              allSlugs: ctx.allSlugs,
            }

            visit(tree, "element", (node, _index, _parent) => {
              // rewrite all links
              if (
                node.tagName === "a" &&
                node.properties &&
                typeof node.properties.href === "string"
              ) {
                let dest = node.properties.href as RelativeURL
                const classes = (node.properties.className ?? []) as string[]
                const isExternal = isAbsoluteUrl(dest)
                classes.push(isExternal ? "external" : "internal")

                if (isExternal && opts.externalLinkIcon) {
                  let iconContent = []
                  let viewBox = "0 0 512 512"

                  if (node.properties.href.includes("wikipedia.org")) {
                    // Wikipedia icon (unchanged)
                    iconContent.push({
                      type: "element",
                      tagName: "path",
                      properties: {
                        d: "M256 48 L256 48 M86 87 v17.1c-22.6 4-39.7 11.1-51.3 21.3-16.6 15.1-36.2 38.2-49 69.4l-261.5 533.8h-17.4L-555.7 243.1c-12.2-27.8-28.9-44.7-33.8-50.9-7.8-9.5-17.4-17-28.9-22.4-11.4-5.4-26.9-8.9-46.3-10.4v-17.1h255.4v17.1c-29.4 2.8-43.5 7.7-52.3 14.8-8.8 7.1-13.2 16.2-13.2 27.3 0 15.4 7.2 39.4 21.7 72.2l193.8 367.7 189.5-363c14.7-35.8 27-60.6 27-74.5 0-9-4.6-17.5-13.6-25.7-9.1-8.2-19.4-13.9-41-17.4-1.6-.3-4.2-.8-8-1.4v-17.1H86z M424.9 87 v17.1c-22.6 4-39.7 11.1-51.3 21.3-16.6 15.1-36.2 38.2-49 69.4l-229.5 533.8h-17.4L-154.8 243.1c-12.2-27.8-28.9-44.7-33.8-50.9-7.8-9.5-17.4-17-28.9-22.4-11.4-5.4-21.8-8.9-41.3-10.4v-17.1h250.3v17.1c-29.4 2.8-43.5 7.7-52.3 14.8-8.8 7.1-13.2 16.2-13.2 27.3 0 15.4 7.2 39.4 21.7 72.2l173.8 367.7 157.5-363c14.7-35.8 27-60.6 27-74.5 0-9-4.6-17.5-13.6-25.7-9.1-8.2-24.5-13.9-46.1-17.4-1.6-.3-4.2-.8-8-1.4v-17.1H424.9z",
                      },
                      children: [],
                    })
                    viewBox = "-700 0 1400 1024"
                  } else if (node.properties.href.includes("youtube.com")) {
                    // YouTube icon
                    iconContent.push({
                      type: "element",
                      tagName: "path",
                      properties: {
                        d: "M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z",
                      },
                      children: [],
                    })
                    iconContent.push({
                      type: "element",
                      tagName: "path",
                      properties: {
                        d: "M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z",
                      },
                      children: [],
                    })
                    viewBox = "0 0 28.57 20"
                  } else {
                    // Default external link icon
                    iconContent.push({
                      type: "element",
                      tagName: "path",
                      properties: {
                        d: "M320 0H288V64h32 82.7L201.4 265.4 178.7 288 224 333.3l22.6-22.6L448 109.3V192v32h64V192 32 0H480 320zM32 32H0V64 480v32H32 456h32V480 352 320H424v32 96H64V96h96 32V32H160 32z",
                      },
                      children: [],
                    })
                  }

                  node.children.push({
                    type: "element",
                    tagName: "svg",
                    properties: {
                      class: "external-icon",
                      viewBox: viewBox,
                      width: "20",
                      height: "20",
                    },
                    // @ts-ignore
                    children: iconContent,
                  })
                }

                // Check if the link has alias text
                if (
                  node.children.length === 1 &&
                  node.children[0].type === "text" &&
                  node.children[0].value !== dest
                ) {
                  // Add the 'alias' class if the text content is not the same as the href
                  classes.push("alias")
                }
                node.properties.className = classes

                if (isExternal && opts.openLinksInNewTab) {
                  node.properties.target = "_blank"
                }

                // don't process external links or intra-document anchors
                const isInternal = !(isAbsoluteUrl(dest) || dest.startsWith("#"))
                if (isInternal) {
                  dest = node.properties.href = transformLink(
                    file.data.slug!,
                    dest,
                    transformOptions,
                  )

                  // url.resolve is considered legacy
                  // WHATWG equivalent https://nodejs.dev/en/api/v18/url/#urlresolvefrom-to
                  const url = new URL(dest, "https://base.com/" + stripSlashes(curSlug, true))
                  const canonicalDest = url.pathname
                  let [destCanonical, _destAnchor] = splitAnchor(canonicalDest)
                  if (destCanonical.endsWith("/")) {
                    destCanonical += "index"
                  }

                  // need to decodeURIComponent here as WHATWG URL percent-encodes everything
                  const full = decodeURIComponent(stripSlashes(destCanonical, true)) as FullSlug
                  const simple = simplifySlug(full)
                  outgoing.add(simple)
                  node.properties["data-slug"] = full
                }

                // rewrite link internals if prettylinks is on
                if (
                  opts.prettyLinks &&
                  isInternal &&
                  node.children.length === 1 &&
                  node.children[0].type === "text" &&
                  !node.children[0].value.startsWith("#")
                ) {
                  node.children[0].value = path.basename(node.children[0].value)
                }
              }

              // transform all other resources that may use links
              if (
                ["img", "video", "audio", "iframe"].includes(node.tagName) &&
                node.properties &&
                typeof node.properties.src === "string"
              ) {
                if (opts.lazyLoad) {
                  node.properties.loading = "lazy"
                }

                if (!isAbsoluteUrl(node.properties.src)) {
                  let dest = node.properties.src as RelativeURL
                  dest = node.properties.src = transformLink(
                    file.data.slug!,
                    dest,
                    transformOptions,
                  )
                  node.properties.src = dest
                }
              }
            })

            file.data.links = [...outgoing]
          }
        },
      ]
    },
  }
}

declare module "vfile" {
  interface DataMap {
    links: SimpleSlug[]
  }
}
