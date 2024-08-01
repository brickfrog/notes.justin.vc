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
          todo1: "#f2cc8f", // Warm yellow for todo, idea
          todo2: "#81b29a", // Sage green for hold, wait
          todo3: "#e07a5f", // Coral red for kill, cancel
        },
        darkMode: {
          light: "#1a1b26", // Tokyo Night background
          lightgray: "#24283b", // Tokyo Night darker background
          gray: "#565f89", // Tokyo Night foreground
          darkgray: "#ccd3f0", // Lightened version of Tokyo Night lighter foreground
          dark: "#e0e3ff", // Lightened version of Tokyo Night bright foreground
          secondary: "#7aa2f7", // Tokyo Night blue, for main links
          tertiary: "#bb9af7", // Tokyo Night purple, for secondary links
          highlight: "rgba(41, 46, 66, 0.5)", // Subtle highlight
          orgh2: "#7aa2f7", // Blue for main headers
          orgh3: "#9ece6a", // Green for subheaders
          orgh4: "#f7768e", // Red for h4
          orgh5: "#e0af68", // Orange for h5
          orgh6: "#7aa2f7", // repeat
          textHighlight: "#41a6b525", // Subtle text highlight
          todo1: "#e0af68", // Muted orange for todo, idea
          todo2: "#9ece6a", // Bright green for hold, wait
          todo3: "#f7768e", // Vibrant pink for kill, cancel
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
          dark: "tokyo-night",
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
        wikilinks: true,
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
