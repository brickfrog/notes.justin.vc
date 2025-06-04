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
        lightMode: {  // Catppuccin Latte
          light: "#eff1f5",       // Base background (Base)
          lightgray: "#e6e9ef",   // Surface (Surface0)
          gray: "#ccd0da",        // Subtle foreground (Surface2)
          darkgray: "#6c6f85",    // Lavender for darker text
          dark: "#4c4f69",        // Dark foreground (Text)
          secondary: "#1e66f5",   // Blue for main links
          tertiary: "#179299",    // Teal for secondary links
          highlight: "rgba(148, 192, 248, 0.3)",  // Subtle highlight (Blue)
          orgh2: "#1e66f5",       // Blue for main headers
          orgh3: "#179299",       // Teal for subheaders
          orgh4: "#d20f39",       // Red for h4
          orgh5: "#e9b143",       // Yellow for h5
          orgh6: "#40a02b",       // Green for h6
          textHighlight: "#e9b14388",  // Yellow text highlight
          todo1: "#e9b143",       // Yellow for todo, idea
          todo2: "#40a02b",       // Green for hold, wait
          todo3: "#d20f39",       // Red for kill, cancel
        },
        darkMode: {  // Catppuccin Mocha
          light: "#1e1e2e",       // Base background (Base)
          lightgray: "#313244",   // Surface (Surface0)
          gray: "#45475a",        // Subtle foreground (Surface2)
          darkgray: "#b4befe",    // Lavender foreground (Text)
          dark: "#cdd6f4",        // Slightly brighter text
          secondary: "#89b4fa",   // Blue for main links
          tertiary: "#b4befe",    // Lavender for secondary links
          highlight: "rgba(49, 52, 68, 0.5)",  // Overlay0
          orgh2: "#89b4fa",       // Blue for main headers
          orgh3: "#a6e3a1",       // Green for subheaders
          orgh4: "#f38ba8",       // Red for h4
          orgh5: "#f9e2af",       // Yellow for h5
          orgh6: "#b4befe",       // Lavender for h6
          textHighlight: "#94e2d525",  // Subtle text highlight (Teal)
          todo1: "#f9e2af",       // Yellow for todo, idea
          todo2: "#a6e3a1",       // Green for hold, wait
          todo3: "#f38ba8",       // Red for kill, cancel
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
