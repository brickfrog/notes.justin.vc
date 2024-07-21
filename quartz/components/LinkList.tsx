import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import Darkmode from "./Darkmode"

import styles from "./styles/linklist.scss"
import darkstyles from "./styles/darkmode.scss"

//@ts-ignore
import darkmodeScript from "./scripts/darkmode.inline"

const DarkmodeComponent = Darkmode()

export default (() => {
  const LinkList: QuartzComponent = ({
    cfg,
    fileData,
    ctx,
    externalResources,
    children,
    tree,
    allFiles,
  }: QuartzComponentProps) => {
    // Serialize the allFiles array to make it available for the button's click handler
    const minimalFiles = allFiles.map((file) => ({
      slug: file.slug,
    }))

    // Serialize the minimalFiles array to make it available for the button's click handler
    const serializedFiles = encodeURIComponent(JSON.stringify(minimalFiles))

    return (
      <div class="wrapper">
        <DarkmodeComponent
          cfg={cfg}
          fileData={fileData}
          ctx={ctx}
          externalResources={externalResources}
          children={children}
          tree={tree}
          allFiles={allFiles}
        />
        <div>
          <button id="btn" title="Go to a (pseudo)random note." data-files={serializedFiles}>
            🎲
          </button>
        </div>
        <div>
          <a href="/index.xml">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              width="20px"
              height="20px"
              id="RSSicon"
              viewBox="0 0 256 256"
            >
              <defs>
                <linearGradient x1="0.085" y1="0.085" x2="0.915" y2="0.915" id="RSSg">
                  <stop offset="0.0" stop-color="#8a2be2" />
                  <stop offset="0.1071" stop-color="#7a1fbf" />
                  <stop offset="0.3503" stop-color="#6b19a8" />
                  <stop offset="0.5" stop-color="#5c1392" />
                  <stop offset="0.7016" stop-color="#4d0d7b" />
                  <stop offset="0.8866" stop-color="#3e0765" />
                  <stop offset="1.0" stop-color="#2f014f" />
                </linearGradient>
              </defs>
              <rect width="256" height="256" rx="55" ry="55" x="0" y="0" fill="#8a2be2" />
              <rect width="246" height="246" rx="50" ry="50" x="5" y="5" fill="#7a1fbf" />
              <rect width="236" height="236" rx="47" ry="47" x="10" y="10" fill="url(#RSSg)" />
              <circle cx="68" cy="189" r="24" fill="#FFF" />
              <path d="M160 213h-34a82 82 0 0 0 -82 -82v-34a116 116 0 0 1 116 116z" fill="#FFF" />
              <path d="M184 213A140 140 0 0 0 44 73 V 38a175 175 0 0 1 175 175z" fill="#FFF" />
            </svg>
          </a>
        </div>
      </div>
    )
  }

  LinkList.css = styles + darkstyles
  LinkList.beforeDOMLoaded =
    `
  document.addEventListener('DOMContentLoaded', function() {
    var btn = document.getElementById('btn');
    if (btn) {
      btn.onclick = function() {
        // Decode and parse the allFiles data from the button's data attribute
        var allFiles = JSON.parse(decodeURIComponent(btn.getAttribute('data-files')));
        var randomIndex = Math.floor(Math.random() * allFiles.length);
        var randomFile = allFiles[randomIndex];
        
        // Navigate to the article using the slug
        console.log(randomFile)
        window.location.href = "/" + randomFile.slug;
      };
    } else {
      console.error('Button not found!');
    }
  });
` + darkmodeScript

  return LinkList
}) satisfies QuartzComponentConstructor
