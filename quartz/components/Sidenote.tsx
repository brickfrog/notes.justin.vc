import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/sidenote.scss"

export interface SidenoteOptions {
  debug?: boolean
}

const defaultOptions: SidenoteOptions = {
  debug: true,
}

export default ((userOpts?: Partial<SidenoteOptions>) => {
  const Sidenote: QuartzComponent = ({ displayClass, fileData, cfg }: QuartzComponentProps) => {
    const opts = { ...defaultOptions, ...userOpts }

    const extractFootnotes = (ast: any): Array<{ id: string; content: string }> => {
      const footnotes: Array<{ id: string; content: string }> = []

      const traverse = (node: any) => {
        if (
          node.type === "element" &&
          node.tagName === "li" &&
          node.properties?.id?.startsWith("user-content-fn-")
        ) {
          const id = node.properties.id.replace("user-content-fn-", "")
          const content = extractContent(node)
          footnotes.push({ id, content })
        }
        if (node.children) {
          node.children.forEach(traverse)
        }
      }

      const extractContent = (node: any): string => {
        let content = ""
        const traverse = (n: any) => {
          if (n.type === "text") {
            content += n.value
          } else if (n.type === "element") {
            if (n.tagName === "a" && n.properties?.href?.startsWith("#citeproc_bib_item_")) {
              // Handle citation links
              content += n.children.map((child: any) => child.value || "").join("")
            } else if (n.children) {
              n.children.forEach(traverse)
            }
          }
        }
        traverse(node)
        return content.trim()
      }

      traverse(ast)
      return footnotes
    }

    const footnotes = extractFootnotes(fileData.htmlAst)

    return (
      <div className={`${displayClass} sidenote-container`}>
        <div className="sidenote-content">
          {footnotes.map((footnote, index) => (
            <div
              key={index}
              className="sidenote-item"
              id={`sidenote-${footnote.id}`}
              data-footnote-id={footnote.id}
            >
              <sup>{footnote.id}</sup>{" "}
              <span dangerouslySetInnerHTML={{ __html: footnote.content }} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  Sidenote.css = style
  Sidenote.afterDOMLoaded = `
  (() => {
    const insertAnchorElements = () => {
      const footnoteRefs = document.querySelectorAll('a[data-footnote-ref]');
      footnoteRefs.forEach((ref, index) => {
        if (!document.getElementById(\`sidenote-anchor-\${index}\`)) {
          const anchor = document.createElement('span');
          anchor.className = 'sidenote-anchor';
          anchor.id = \`sidenote-anchor-\${index}\`;
          ref.parentNode.insertBefore(anchor, ref.nextSibling);
        }
      });
    };
  
    const adjustSidenotes = () => {
      const sidenoteContainer = document.querySelector('.sidenote-container');
      const contentContainer = document.querySelector('.center');
      
      if (!sidenoteContainer || !contentContainer) {
        return;
      }
  
      const contentRect = contentContainer.getBoundingClientRect();
  
      document.querySelectorAll('.sidenote-item').forEach((sidenote, index) => {
        const anchor = document.getElementById(\`sidenote-anchor-\${index}\`);
        if (anchor) {
          const anchorRect = anchor.getBoundingClientRect();
          const topPosition = anchorRect.top - contentRect.top;
          
          sidenote.style.position = 'absolute';
          sidenote.style.top = \`\${topPosition}px\`;
          sidenote.style.left = '100%';
          sidenote.style.transform = 'translateX(20px)';
        }
      });
    };
  
    const setupSidenotes = () => {
      insertAnchorElements();
      adjustSidenotes();
      
      document.querySelectorAll('a[data-footnote-ref]').forEach((ref) => {
        const id = ref.getAttribute('href').replace('#user-content-fn-fn:', 'sidenote-fn:');
        const sidenote = document.getElementById(id);
  
        ref.addEventListener('mouseenter', () => {
          if (sidenote) {
            sidenote.classList.add('highlight');
          }
        });
  
        ref.addEventListener('mouseleave', () => {
          if (sidenote) {
            sidenote.classList.remove('highlight');
          }
        });
  
        ref.addEventListener('click', (e) => {
          e.preventDefault();
          if (sidenote) {
            sidenote.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });
    };

    const setupReferences = () => {
      const referenceEntries = document.querySelectorAll('.csl-entry');
      referenceEntries.forEach((entry, index) => {
        const anchor = document.createElement('a');
        anchor.id = \`reference-\${index + 1}\`;
        entry.insertBefore(anchor, entry.firstChild);
      });
    };

    const setupFootnoteLinks = () => {
      const footnoteLinks = document.querySelectorAll('.footnotes li a[href^="#citeproc_bib_item_"]');
      
      footnoteLinks.forEach((link, index) => {
        const refNumber = index + 1;
        const refAnchor = \`#reference-\${refNumber}\`;
        link.setAttribute('href', refAnchor);
        
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const refElement = document.querySelector(refAnchor);
          if (refElement) {
            refElement.scrollIntoView({ behavior: 'smooth' });
            refElement.closest('.csl-entry').classList.add('highlight');
            setTimeout(() => refElement.closest('.csl-entry').classList.remove('highlight'), 2000);
          }
        });
      });
    };
  
    // Run setup on initial load
    setupSidenotes();
    setupReferences();
    setupFootnoteLinks();
  
    // Adjust on scroll and resize
    window.addEventListener('scroll', adjustSidenotes);
    window.addEventListener('resize', adjustSidenotes);
    
    // Re-run setup when Quartz navigates to a new page
    document.addEventListener('nav', () => {
      setupSidenotes();
      setupReferences();
      setupFootnoteLinks();
    });
  })()
  `

  return Sidenote
}) satisfies QuartzComponentConstructor
