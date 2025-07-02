import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4.0 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "【ｎｏｔｅｓ．ｊｕｓｔｉｎ．ｖｃ】",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      // @ts-ignore
      provider: "none",
    },
    locale: "en-US",
    baseUrl: "notes.justin.vc",
    ignorePatterns: ["private", "templates", ".obsidian", "config.md"],
    defaultDateType: "created",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Atkinson Hyperlegible",
        body: "Atkinson Hyperlegible",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          // Shenzhen Nights Light Variant
          light: "#f8f9fa", // Very light background
          lightgray: "#e5e9f0", // Light surface (color15)
          gray: "#b8c2cc", // Subtle foreground (color7)
          darkgray: "#6B7D8C", // Medium gray text (color8)
          dark: "#101820", // Dark text (color0)
          secondary: "#1A8CFF", // Dodger Blue for main links
          tertiary: "#00CC99", // Mint Green for secondary links
          highlight: "rgba(26, 140, 255, 0.2)", // Blue highlight
          orgh2: "#1A8CFF", // Dodger Blue for main headers
          orgh3: "#00CC99", // Mint Green for subheaders
          orgh4: "#FF3366", // Folly Red for h4
          orgh5: "#FFCC00", // Jonquil Yellow for h5
          orgh6: "#CC33FF", // Phlox Magenta for h6
          textHighlight: "rgba(255, 204, 0, 0.4)", // Yellow text highlight
          todo1: "#FFCC00", // Jonquil Yellow for todo, idea
          todo2: "#00CC99", // Mint Green for hold, wait
          todo3: "#FF3366", // Folly Red for kill, cancel
        },
        darkMode: {
          // Shenzhen Nights
          light: "#0a0f14", // Base background
          lightgray: "#101820", // Darker surface (color0)
          gray: "#6B7D8C", // Subtle foreground (color8)
          darkgray: "#d8dce0", // Main foreground text
          dark: "#e5e9f0", // Bright text (color15)
          secondary: "#1A8CFF", // Dodger Blue for main links (color4)
          tertiary: "#00CC99", // Mint Green for secondary links (color2)
          highlight: "rgba(42, 56, 76, 0.6)", // Selection background with transparency
          orgh2: "#1A8CFF", // Dodger Blue for main headers
          orgh3: "#00CC99", // Mint Green for subheaders
          orgh4: "#FF3366", // Folly Red for h4
          orgh5: "#FFCC00", // Jonquil Yellow for h5
          orgh6: "#CC33FF", // Phlox Magenta for h6
          textHighlight: "rgba(255, 204, 0, 0.3)", // Yellow text highlight
          todo1: "#FFCC00", // Jonquil Yellow for todo, idea
          todo2: "#00CC99", // Mint Green for hold, wait
          todo3: "#FF3366", // Folly Red for kill, cancel
        },
      },
    },
  },
  plugins: {
    transformers: [
      // Transformations
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: true,
      }),
      Plugin.TableOfContents({
        showByDefault: true,
        collapseByDefault: false,
        maxDepth: 4,
        minEntries: 5,
      }),
      Plugin.OxHugoFlavouredMarkdown({
        wikilinks: true,
        removePredefinedAnchor: true,
        anchorTransformation: true,
      }),
      Plugin.ObsidianFlavoredMarkdown({
        enableCheckbox: false,
      }),
      Plugin.GitHubFlavoredMarkdown({
        enableSmartyPants: true,
        linkHeadings: true,
      }),
      Plugin.CrawlLinks({
        openLinksInNewTab: true,
        lazyLoad: false,
      }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [
      // Filters
      Plugin.RemoveDrafts(),
    ],
    emitters: [
      // Emitters
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.CategoryPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
    ],
  },
}

export default config
