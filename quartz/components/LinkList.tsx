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
