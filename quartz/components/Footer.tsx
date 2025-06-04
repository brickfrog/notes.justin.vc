import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"
import { version } from "../../package.json"
import { i18n } from "../i18n"

interface Options {
  links: Record<string, string>
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ displayClass, cfg, fileData }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    const links = opts?.links ?? []
    const creator = fileData.frontmatter?.creator

    return (
      <footer className={`${displayClass ?? ""}`}>
        <ul>
          {Object.entries(links).map(([text, link]) => (
            <li key={text}>
              <a href={link}>{text}</a>
            </li>
          ))}
        </ul>
        <span className="footer-small">
          {i18n(cfg.locale).components.footer.createdWith}{" "}
          <a href="https://quartz.jzhao.xyz/">
            quartz<sup>{version}</sup>
          </a>{" "}
          © {year}
          {creator && ` & ${creator}`} by Justin Malloy © 2023-{year}
          <p>
            All original content is licensed under a free/libre copyleft license (GPL or CC BY-SA).
            Read the <a href="/about#license">notice</a> about the license and resources.
          </p>
        </span>
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor
