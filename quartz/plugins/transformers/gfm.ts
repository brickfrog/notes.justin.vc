import remarkGfm from "remark-gfm"
import smartypants from "remark-smartypants"
import { QuartzTransformerPlugin } from "../types"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import GithubSlugger from "github-slugger"
import { visit } from "unist-util-visit"
import { Plugin } from "unified"
import { Root } from "hast"

export interface Options {
  enableSmartyPants: boolean
  linkHeadings: boolean
}

const defaultOptions: Options = {
  enableSmartyPants: true,
  linkHeadings: true,
}

// Custom slugger
const slugger = new GithubSlugger()

// Custom function to generate slugs
const customSlugify = (text: string): string => {
  // Remove TODO, DONE, priority tags, and other org-mode specific content
  const cleanedText = text
    .replace(/^(?:\[#[A-Z]\])?\s*(?:TODO|DONE)\s+/, "")
    .replace(/<span[^>]*>(?:\[#[A-Z]\]|TODO|DONE)<\/span>\s*/g, "")
  return slugger.slug(cleanedText)
}

// Custom rehype plugin to replace rehype-slug
const customRehypeSlug: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, "element", (node) => {
      if (node.tagName[0] === "h" && /^h[1-6]$/.test(node.tagName)) {
        let text = ""
        visit(node, "text", (textNode) => {
          text += textNode.value
        })
        const id = customSlugify(text)
        node.properties = node.properties || {}
        node.properties.id = id
      }
    })
  }
}

export const GitHubFlavoredMarkdown: QuartzTransformerPlugin<Partial<Options> | undefined> = (
  userOpts,
) => {
  const opts = { ...defaultOptions, ...userOpts }
  return {
    name: "GitHubFlavoredMarkdown",
    markdownPlugins() {
      return opts.enableSmartyPants ? [remarkGfm, smartypants] : [remarkGfm]
    },
    htmlPlugins() {
      if (opts.linkHeadings) {
        return [
          customRehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "append",
              properties: {
                role: "anchor",
                ariaHidden: true,
                tabIndex: -1,
                "data-no-popover": true,
              },
              content: {
                type: "element",
                tagName: "svg",
                properties: {
                  width: 18,
                  height: 18,
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                },
                children: [
                  {
                    type: "element",
                    tagName: "path",
                    properties: {
                      d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
                    },
                    children: [],
                  },
                  {
                    type: "element",
                    tagName: "path",
                    properties: {
                      d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
                    },
                    children: [],
                  },
                ],
              },
            },
          ],
        ]
      } else {
        return []
      }
    },
  }
}
