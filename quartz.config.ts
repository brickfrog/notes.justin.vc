import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4.0 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "𝕟𝕠𝕥𝕖𝕤 justin.vc",
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
        header: "Open Sans",
        body: "Open Sans",
        code: "Roboto Mono",
      },
      colors: {
        lightMode: {
          light: "#faf8f8",
          lightgray: "#e5e5e5",
          gray: "#b8b8b8",
          darkgray: "#4e4e4e",
          dark: "#2b2b2b",
          secondary: "#284b63",
          tertiary: "#84a59d",
          highlight: "rgba(143, 159, 169, 0.15)",
          orgh2: "#4CAF50" /* Soft Green */,
          orgh3: "#2196F3" /* Moderate Blue */,
          orgh4: "#9C27B0" /* Medium Purple */,
          orgh5: "#FF9800" /* Warm Orange */,
          orgh6: "#795548" /* Soft Brown */,
          textHighlight: "#fff23688",
        },
        darkMode: {
          light: "#1e1e2e", // background color (base)
          lightgray: "#313244", // current line (surface0)
          gray: "#6272a4", // comment (overlay0)
          darkgray: "#f8f8f2", // foreground text (text)
          dark: "#f8f8f2", // selection background (surface2)
          secondary: "#cba6f7", // purple (mauve)
          tertiary: "#f5c2e7", // pink (pink)
          highlight: "rgba(108, 112, 134, 0.15)", // subtle highlight (based on overlay0)
          orgh2: "#f38ba8" /* Light pink */,
          orgh3: "#f4af84" /* Peach */,
          orgh4: "#f9e2af" /* Pale yellow */,
          orgh5: "#a6e3a1" /* Light green */,
          orgh6: "#74c7ec" /* Sky blue */,
          textHighlight: "#b3aa0288",
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
        maxDepth: 6,
        minEntries: 2,
      }),
      Plugin.OxHugoFlavouredMarkdown({
        removePredefinedAnchor: true,
        anchorTransformation: false,
      }),
      Plugin.ObsidianFlavoredMarkdown(),
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
