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
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      // @ts-ignore
      provider: "none",
    },
    locale: "en-US",
    baseUrl: "notes.justin.vc",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "created",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Exo 2",
        body: "Exo 2",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#f7f7f2",
          lightgray: "#e8e8e3",
          gray: "#b8b8b0",
          darkgray: "#5a5a52",
          dark: "#2d2d28",
          secondary: "#3a7ca5", // Main link color (blue)
          tertiary: "#81b29a", // Secondary link color (sage green)
          highlight: "rgba(210, 215, 200, 0.3)",
          orgh2: "#3a7ca5",
          orgh3: "#81b29a",
          orgh4: "#e07a5f",
          orgh5: "#6d597a",
          orgh6: "#b56576",
          textHighlight: "#f2cc8f88",
        },
        darkMode: {
          light: "#1a1a1a",
          lightgray: "#252525",
          gray: "#505050",
          darkgray: "#f5f5f5",
          dark: "#f0f0f0",
          secondary: "#7fdd57",
          tertiary: "#7FFFFF",
          highlight: "rgba(108, 112, 134, 0.15)",
          orgh2: "#7FFFFF",
          orgh3: "#7FDD57",
          orgh4: "#66B2FF",
          orgh5: "#FF884D",
          orgh6: "#66FF66",
          textHighlight: "#00ffff44",
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
          light: "catppuccin-latte",
          dark: "aurora-x",
        },
        keepBackground: true,
      }),
      Plugin.TableOfContents({
        showByDefault: true,
        collapseByDefault: false,
        maxDepth: 4,
        minEntries: 2,
      }),
      Plugin.OxHugoFlavouredMarkdown({
        removePredefinedAnchor: true,
        // Github Flavored Markdown's Anchors work better
        anchorTransformation: false,
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
