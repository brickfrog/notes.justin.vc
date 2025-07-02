import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

export interface ProgressBarOptions {
  showSectionName?: boolean
}

const defaultOptions: ProgressBarOptions = {
  showSectionName: true,
}

export default ((userOpts?: Partial<ProgressBarOptions>) => {
  const opts = { ...defaultOptions, ...userOpts }

  const ProgressBar: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
    // Always render to prevent layout shifts, but show title when no TOC
    const hasHeaders = fileData.toc && fileData.toc.length > 0
    const displayTitle = fileData.frontmatter?.title || "Reading..."

    return (
      <div class={classNames(displayClass, "progress-bar-container")}>
        {opts.showSectionName && (
          <div class="current-section" id="current-section" data-initial-title={displayTitle}>
            {displayTitle}
          </div>
        )}
        <div class="progress-bar">
          <div class="progress-fill" id="progress-fill"></div>
        </div>
      </div>
    )
  }

  ProgressBar.afterDOMLoaded = `
    document.addEventListener('DOMContentLoaded', function() {
      const progressFill = document.getElementById('progress-fill');
      const currentSection = document.getElementById('current-section');
      
      if (!progressFill || !currentSection) return;
      
      function updateProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.min(100, Math.max(0, (scrollTop / documentHeight) * 100));
        
        progressFill.style.width = scrollPercent + '%';
        
        // Find current section - look for headers in the main content
        const headers = document.querySelectorAll('article h1, article h2, article h3, article h4, article h5, article h6, .popover-hint h1, .popover-hint h2, .popover-hint h3, .popover-hint h4, .popover-hint h5, .popover-hint h6');
        let currentHeader = null;
        
        for (let i = headers.length - 1; i >= 0; i--) {
          const header = headers[i];
          const rect = header.getBoundingClientRect();
          if (rect.top <= 150) {
            currentHeader = header;
            break;
          }
        }
        
        if (currentHeader) {
          const headerText = currentHeader.textContent || '';
          // Clean up the header text
          const cleanText = headerText.replace(/^[\\d\\.\\s]+/, '').trim();
          currentSection.textContent = cleanText || 'Reading...';
        } else {
          // If no headers found, show article title or keep initial title
          const articleTitle = document.querySelector('h1.article-title, .frontmatter h1, article h1');
          if (articleTitle) {
            currentSection.textContent = articleTitle.textContent || 'Reading...';
          } else {
            // Keep the initial title from frontmatter if no headers exist
            const initialTitle = currentSection.getAttribute('data-initial-title');
            if (initialTitle) {
              currentSection.textContent = initialTitle;
            } else {
              currentSection.textContent = 'Reading...';
            }
          }
        }
      }
      
      // Initial call and scroll listener
      updateProgress();
      window.addEventListener('scroll', updateProgress, { passive: true });
    });
  `

  ProgressBar.css = `
    .progress-bar-container {
      width: 100%;
      padding: 0.5rem 0.5rem 0.25rem;
      margin-bottom: 0.5rem;
      
      @media all and (max-width: 1200px) {
        display: none;
      }
    }
    
    .current-section {
      font-size: 0.75rem;
      color: var(--dark);
      font-weight: 600;
      margin-bottom: 0.25rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .progress-bar {
      width: 100%;
      height: 2px;
      background-color: var(--lightgray);
      border-radius: 1px;
      overflow: hidden;
    }
    
    .progress-fill {
      height: 100%;
      width: 0%;
      background-color: var(--secondary);
      transition: width 0.1s ease;
    }
  `

  return ProgressBar
}) satisfies QuartzComponentConstructor
