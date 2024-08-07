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

  // Note that this is only tested working for ieee csl
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
      
      const sidenoteContainer = document.querySelector('.sidenote-container');
      if (!sidenoteContainer) return;
  
      // Clear existing sidenotes
      sidenoteContainer.innerHTML = '';
  
      document.querySelectorAll('a[data-footnote-ref]').forEach((ref, index) => {
        const footnoteId = ref.getAttribute('href').substring(1);
        const footnote = document.getElementById(footnoteId);
  
        if (footnote) {
          const sidenote = document.createElement('div');
          sidenote.id = \`sidenote-\${index}\`;
          sidenote.className = 'sidenote-item';
          
          // Clone the content of the footnote, preserving links
          const footnoteContent = footnote.querySelector('p').cloneNode(true);
          
          // Remove the backref link from the sidenote
          const backref = footnoteContent.querySelector('.data-footnote-backref');
          if (backref) {
            backref.remove();
          }
          
          sidenote.appendChild(footnoteContent);
          sidenoteContainer.appendChild(sidenote);
        }
  
        ref.addEventListener('mouseenter', () => {
          const sidenote = document.getElementById(\`sidenote-\${index}\`);
          if (sidenote) {
            sidenote.classList.add('highlight');
          }
        });
  
        ref.addEventListener('mouseleave', () => {
          const sidenote = document.getElementById(\`sidenote-\${index}\`);
          if (sidenote) {
            sidenote.classList.remove('highlight');
          }
        });
  
        ref.addEventListener('click', (e) => {
          e.preventDefault();
          const sidenote = document.getElementById(\`sidenote-\${index}\`);
          if (sidenote) {
            sidenote.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });
  
      adjustSidenotes();
    };
  
    const setupFootnoteLinks = () => {
      const citationLinks = document.querySelectorAll('a[href^="#citeproc_bib_item_"]');
      
      citationLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('href').substring(1);
          
          // Find the references container at the bottom
          const referencesContainer = document.querySelector('.csl-bib-body');
          
          if (referencesContainer) {
            // Find the specific reference within the container
            const targetElement = referencesContainer.querySelector(\`a[id="\${targetId}"]\`);
            
            if (targetElement) {
              // Scroll to the element
              const yOffset = -50; // Adjust this value to fine-tune the scroll position
              const y = referencesContainer.offsetTop + targetElement.offsetTop + yOffset;
              
              window.scrollTo({top: y, behavior: 'smooth'});
              
              // Fallback for browsers that don't support smooth scrolling
              setTimeout(() => {
                window.scrollTo(0, y);
              }, 500);
  
              const cslEntry = targetElement.closest('.csl-entry');
              if (cslEntry) {
                cslEntry.classList.add('highlight');
                setTimeout(() => cslEntry.classList.remove('highlight'), 2000);
              }            
            } else {
              console.error('Specific reference not found:', targetId);
            }
          } else {
            console.error('References container not found');
          }
        });
      });
    };
  
    // Run setup on initial load
    setupSidenotes();
    setupFootnoteLinks();
  
    // Adjust on scroll and resize
    window.addEventListener('scroll', adjustSidenotes);
    window.addEventListener('resize', adjustSidenotes);
    
    // Re-run setup when Quartz navigates to a new page
    document.addEventListener('nav', () => {
      setupSidenotes();
      setupFootnoteLinks();
    });
  })()
  `

  return Sidenote
}) satisfies QuartzComponentConstructor
