import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative, pathToRoot } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

// @ts-ignore
import searchScript from "./scripts/search.inline"
import searchStyle from "./styles/search.scss"
// @ts-ignore
import darkmodeScript from "./scripts/darkmode.inline"
import darkmodeStyle from "./styles/darkmode.scss"

export interface HeaderNavOptions {
  links: Array<{
    text: string
    link: string
    external?: boolean
  }>
}

const defaultOptions: HeaderNavOptions = {
  links: [
    { text: "Notes", link: "/" },
    { text: "Tags", link: "/tags" },
    { text: "Recent", link: "/tags" },
    { text: "Archive", link: "/tags" },
  ],
}

export default ((userOpts?: Partial<HeaderNavOptions>) => {
  const opts = { ...defaultOptions, ...userOpts }

  const HeaderNav: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
    const baseDir = pathToRoot(fileData.slug!)

    return (
      <nav class={classNames(displayClass, "header-nav")}>
        <div class="nav-container">
          <div class="site-title">
            <a href={baseDir} class="title-link">
              𝕟𝕠𝕥𝕖𝕤<sup style="font-size:0.55em;">.justin.vc</sup>
            </a>
          </div>
          <div class="nav-links">
            {opts.links.map((link) => {
              const resolvedLink = link.external ? link.link : resolveRelative(baseDir, link.link)

              return (
                <a
                  href={resolvedLink}
                  class={`nav-link ${link.external ? "external" : "internal"}`}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {link.text.toUpperCase()}
                </a>
              )
            })}
          </div>
          <div class="header-utilities">
            <div id="header-search-trigger">
              <svg
                tabIndex={0}
                aria-labelledby="title desc"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 19.9 19.7"
                class="search-icon"
              >
                <title id="title">Search</title>
                <desc id="desc">Search</desc>
                <g class="search-path" fill="none">
                  <path stroke-linecap="square" d="M18.5 18.3l-5.4-5.4" stroke="currentColor" />
                  <circle cx="8" cy="8" r="7" stroke="currentColor" />
                </g>
              </svg>
            </div>

            <button type="button" id="darkmode" aria-label="Toggle dark mode">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="5"></circle>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
              </svg>
            </button>

            <button
              type="button"
              id="random-btn"
              title="Go to a random note"
              data-files={JSON.stringify([])}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" viewBox="0 0 100 100">
                <path
                  d="M80.644,87.982l16.592-41.483c0.054-0.128,0.088-0.26,0.108-0.394c0.006-0.039,0.007-0.077,0.011-0.116  c0.007-0.087,0.008-0.174,0.002-0.26c-0.003-0.046-0.007-0.091-0.014-0.137c-0.014-0.089-0.036-0.176-0.063-0.262  c-0.012-0.034-0.019-0.069-0.031-0.103c-0.047-0.118-0.106-0.229-0.178-0.335c-0.004-0.006-0.006-0.012-0.01-0.018L67.999,3.358  c-0.01-0.013-0.003-0.026-0.013-0.04L68,3.315V4c0,0-0.033,0-0.037,0c-0.403-1-1.094-1.124-1.752-0.976  c0,0.004-0.004-0.012-0.007-0.012C66.201,3.016,66.194,3,66.194,3H66.19h-0.003h-0.003h-0.004h-0.003c0,0-0.004,0-0.007,0  s-0.003-0.151-0.007-0.151L20.495,15.227c-0.025,0.007-0.046-0.019-0.071-0.011c-0.087,0.028-0.172,0.041-0.253,0.083  c-0.054,0.027-0.102,0.053-0.152,0.085c-0.051,0.033-0.101,0.061-0.147,0.099c-0.044,0.036-0.084,0.073-0.124,0.113  c-0.048,0.048-0.093,0.098-0.136,0.152c-0.03,0.039-0.059,0.076-0.085,0.117c-0.046,0.07-0.084,0.145-0.12,0.223  c-0.011,0.023-0.027,0.042-0.036,0.066L2.911,57.664C2.891,57.715,3,57.768,3,57.82v0.002c0,0.186,0,0.375,0,0.562  c0,0.004,0,0.004,0,0.008c0,0,0,0,0,0.002c0,0,0,0,0,0.004v0.004v0.002c0,0.074-0.002,0.15,0.012,0.223  C3.015,58.631,3,58.631,3,58.633c0,0.004,0,0.004,0,0.008c0,0,0,0,0,0.002c0,0,0,0,0,0.004v0.004c0,0,0,0,0,0.002v0.004  c0,0.191-0.046,0.377,0.06,0.545c0-0.002-0.03,0.004-0.03,0.004c0,0.004-0.03,0.004-0.03,0.004c0,0.002,0,0.002,0,0.002  l-0.045,0.004c0.03,0.047,0.036,0.09,0.068,0.133l29.049,37.359c0.002,0.004,0,0.006,0.002,0.01c0.002,0.002,0,0.004,0.002,0.008  c0.006,0.008,0.014,0.014,0.021,0.021c0.024,0.029,0.052,0.051,0.078,0.078c0.027,0.029,0.053,0.057,0.082,0.082  c0.03,0.027,0.055,0.062,0.086,0.088c0.026,0.02,0.057,0.033,0.084,0.053c0.04,0.027,0.081,0.053,0.123,0.076  c0.005,0.004,0.01,0.008,0.016,0.01c0.087,0.051,0.176,0.09,0.269,0.123c0.042,0.014,0.082,0.031,0.125,0.043  c0.021,0.006,0.041,0.018,0.062,0.021c0.123,0.027,0.249,0.043,0.375,0.043c0.099,0,0.202-0.012,0.304-0.027l45.669-8.303  c0.057-0.01,0.108-0.021,0.163-0.037C79.547,88.992,79.562,89,79.575,89c0.004,0,0.004,0,0.004,0c0.021,0,0.039-0.027,0.06-0.035  c0.041-0.014,0.08-0.034,0.12-0.052c0.021-0.01,0.044-0.019,0.064-0.03c0.017-0.01,0.026-0.015,0.033-0.017  c0.014-0.008,0.023-0.021,0.037-0.028c0.14-0.078,0.269-0.174,0.38-0.285c0.014-0.016,0.024-0.034,0.038-0.048  c0.109-0.119,0.201-0.252,0.271-0.398c0.006-0.01,0.016-0.018,0.021-0.029c0.004-0.008,0.008-0.017,0.011-0.026  c0.002-0.004,0.003-0.006,0.005-0.01C80.627,88.021,80.635,88.002,80.644,87.982z M77.611,84.461L48.805,66.453l32.407-25.202  L77.611,84.461z M46.817,63.709L35.863,23.542l43.818,14.608L46.817,63.709z M84.668,40.542l8.926,5.952l-11.902,29.75  L84.668,40.542z M89.128,39.446L84.53,36.38l-6.129-12.257L89.128,39.446z M79.876,34.645L37.807,20.622L65.854,6.599L79.876,34.645  z M33.268,19.107l-6.485-2.162l23.781-6.487L33.268,19.107z M21.92,18.895l8.67,2.891L10.357,47.798L21.92,18.895z M32.652,24.649  l10.845,39.757L7.351,57.178L32.652,24.649z M43.472,67.857L32.969,92.363L8.462,60.855L43.472,67.857z M46.631,69.09l27.826,17.393  l-38.263,6.959L46.631,69.09z"
                  fill="currentColor"
                />
              </svg>
            </button>

            <a href={resolveRelative(baseDir, "/index.xml")}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20px"
                height="20px"
                viewBox="0 0 16 16"
                version="1.1"
              >
                <rect width="16" height="16" id="icon-bound" fill="none" />
                <path d="M1,5v2c1.081,0,2.128,0.211,3.113,0.628c0.952,0.403,1.808,0.98,2.543,1.715s1.312,1.591,1.715,2.543 C8.789,12.872,9,13.919,9,15h2C11,9.477,6.523,5,1,5z M4,10c-1.105,0-2,0.895-2,2s0.895,2,2,2s2-0.895,2-2S5.105,10,4,10z M1,1v2 c1.621,0,3.192,0.317,4.67,0.942c1.429,0.604,2.712,1.47,3.815,2.573c1.103,1.103,1.968,2.386,2.573,3.815 C12.683,11.808,13,13.379,13,15h2C15,7.268,8.732,1,1,1z" />
              </svg>
            </a>
          </div>
        </div>
      </nav>
    )
  }

  HeaderNav.afterDOMLoaded = `
// Search functionality
${searchScript}

// Header search trigger
document.addEventListener('DOMContentLoaded', function() {
  const headerSearchTrigger = document.getElementById('header-search-trigger');
  if (headerSearchTrigger) {
    headerSearchTrigger.addEventListener('click', function() {
      const realSearchButton = document.getElementById('search-button');
      if (realSearchButton) {
        realSearchButton.click();
      }
    });
  }
});

// Dark mode functionality  
${darkmodeScript}

// Random page functionality
document.addEventListener('DOMContentLoaded', function() {
  var btn = document.getElementById('random-btn');
  if (btn) {
    btn.onclick = function() {
      // Get all internal links on the page
      const internalLinks = Array.from(document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]'))
        .map(link => link.href)
        .filter(href => !href.includes('#') && href !== window.location.href);
      
      if (internalLinks.length > 0) {
        const randomLink = internalLinks[Math.floor(Math.random() * internalLinks.length)];
        window.location.href = randomLink;
      }
    };
  }
});
`

  HeaderNav.css = `
${searchStyle}
${darkmodeStyle}

.header-nav {
  width: 100%;
  background-color: var(--light);
  border-bottom: 1px solid var(--lightgray);
  position: sticky;
  top: 0;
  z-index: 999;
  padding: 0;
  margin: 0 0 2rem 0;
}

.nav-container {
  max-width: calc(1200px + 300px);
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
  
  @media all and (max-width: 800px) {
    gap: 0.75rem;
  }
}

.site-title {
  flex: 0 0 auto;
}

.title-link {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--dark);
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: var(--secondary);
  }
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
  flex: 1;
}

.header-utilities {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-utilities > * {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  color: var(--darkgray);
  text-decoration: none;

  &:hover {
    background-color: var(--lightgray);
    color: var(--secondary);
  }

  svg {
    width: 18px;
    height: 18px;
  }
}

.nav-link {
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: var(--darkgray);
  text-decoration: none;
  transition: color 0.2s ease;
  white-space: nowrap;

  &:hover {
    color: var(--secondary);
  }

  &.external::after {
    content: "↗";
    margin-left: 0.25rem;
    font-size: 0.7rem;
    opacity: 0.7;
  }
}

/* Hide header when search is active */
#search-container.active ~ * .header-nav,
body:has(#search-container.active) .header-nav {
  display: none;
}

/* Mobile responsive */
@media all and (max-width: 800px) {
  .nav-container {
    padding: 0.75rem 1rem;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .site-title {
    order: 1;
  }
  
  .title-link {
    font-size: 1rem;
  }
  
  .nav-links {
    order: 2;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
    flex: none;
  }
  
  .nav-link {
    font-size: 0.75rem;
  }
  
  .header-utilities {
    order: 3;
  }
  
  .search-button {
    padding: 0.4rem;
  }
  
  .search-icon {
    width: 16px;
    height: 16px;
  }
}

/* Very small mobile */
@media all and (max-width: 500px) {
  .nav-links {
    gap: 0.5rem;
    width: 100%;
    justify-content: space-around;
  }
  
  .nav-link {
    font-size: 0.7rem;
    padding: 0.25rem 0;
  }
}
`

  return HeaderNav
}) satisfies QuartzComponentConstructor
